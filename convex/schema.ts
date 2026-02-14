import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
	...authTables,
	users: defineTable({
		name: v.optional(v.string()),
		image: v.optional(v.string()),
		email: v.optional(v.string()),
		emailVerificationTime: v.optional(v.number()),
		phone: v.optional(v.string()),
		phoneVerificationTime: v.optional(v.number()),
		isAnonymous: v.optional(v.boolean()),
		color: v.optional(v.string()),
	}),
	numbers: defineTable({
		value: v.number(),
	}),
	blocks: defineTable({
		index: v.number(),
		userId: v.optional(v.id("users")),
		captureTime: v.optional(v.number()),
		expiresAt: v.optional(v.number()),
	}).index("by_user", ["userId"]),
});
