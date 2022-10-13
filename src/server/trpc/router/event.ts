import { authedProcedure, t } from '../trpc';
import { z } from 'zod';

export const eventRouter = t.router({
	getEvent: t.procedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const tier = await ctx.prisma.event.findFirst({
				where: {
					id: input.eventId
				},
				include: {
					Tier: true
				}
			});

			return tier;
		})
});
