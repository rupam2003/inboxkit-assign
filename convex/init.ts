import { internalMutation } from "./_generated/server";

export const intialize = internalMutation({
	args: {},
	handler: async (ctx) => {
		for (let index = 0; index < 2000; index++) {
			await ctx.db.insert("blocks", {
				index,
			});
		}
	},
});
