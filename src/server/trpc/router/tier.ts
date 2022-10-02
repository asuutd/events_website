import { authedProcedure, t } from '../trpc';
import { z } from 'zod';

export const tierRouter = t.router({
	getTiers: t.procedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const tier = await ctx.prisma.tier.findMany({
				where: {
					eventId: input.eventId
				}
			});

			return tier;
		})
});
