import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

export const getGrid = query({
	args: {},
	handler: async (ctx) => {
		const blocks = (await ctx.db.query("blocks").collect())
			.sort((a, b) => a.index - b.index)
			.slice(0, 1000);
		const userIds = [...new Set(blocks.map((block) => block.userId))].filter(
			(userId) => userId !== undefined,
		);
		const users = await ctx.db
			.query("users")
			.filter((q) =>
				q.or(...userIds.map((userId) => q.eq(q.field("_id"), userId))),
			)
			.collect();
		const blockToUserMap = new Map<Id<"blocks">, Doc<"users"> | null>();
		blocks.forEach((block) => {
			if (block.userId) {
				blockToUserMap.set(
					block._id,
					users.find((user) => user?._id === block.userId) ?? null,
				);
			}
		});
		return blocks.map((block) => {
			return {
				...block,
				user: blockToUserMap.get(block._id),
			};
		});
	},
});

export const captureBlock = mutation({
	args: {
		blockId: v.id("blocks"),
	},
	handler: async (ctx, args) => {
		const { blockId } = args;
		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("User not Authenticated");
		const expiresAt = Date.now() + 30000;
		const block = await ctx.db.get("blocks", blockId);
		if (block?.userId) {
			return {
				success: false,
				message: "Block already captured",
			};
		}
		await ctx.db.patch("blocks", blockId, {
			userId,
			expiresAt,
		});
		await ctx.scheduler.runAt(expiresAt, internal.blocks.releaseBlock, {
			blockId,
		});
		return {
			success: true,
			message: "Block captured successfully",
		};
	},
});

export const releaseBlock = internalMutation({
	args: {
		blockId: v.id("blocks"),
	},
	handler: async (ctx, args) => {
		const { blockId } = args;
		await ctx.db.patch("blocks", blockId, {
			userId: undefined,
			expiresAt: undefined,
		});
	},
});
