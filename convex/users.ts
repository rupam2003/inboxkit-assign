import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) return null;
		return await ctx.db.get(userId);
	},
});

export const getTopConquerers = query({
	args: {},
	handler: async (ctx) => {
		const blocks = await ctx.db.query("blocks").collect();
		const userToBlocksCountMap = new Map<Id<"users">, number>();
		blocks.forEach((block) => {
			if (block.userId) {
				userToBlocksCountMap.set(
					block.userId,
					(userToBlocksCountMap.get(block.userId) ?? 0) + 1,
				);
			}
		});
		const userToBlocksCountObjectArray: {
			userId: Id<"users">;
			count: number;
		}[] = [];
		userToBlocksCountMap.forEach((value, key) => {
			userToBlocksCountObjectArray.push({ userId: key, count: value });
		});
		userToBlocksCountObjectArray.sort((a, b) => b.count - a.count);

		return await Promise.all(
			userToBlocksCountObjectArray.slice(0, 5).map(async (e) => {
				return {
					...e,
					user: await ctx.db.get("users", e.userId),
				};
			}),
		);
	},
});

export const changeColor = mutation({
	args: {
		color: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) return;
		await ctx.db.patch("users", userId, { color: args.color });
	},
});
