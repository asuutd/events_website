import { authedProcedure, t } from '../trpc';
import { z } from 'zod';

export const ticketRouter = t.router({
	createTicket: authedProcedure
		.input(
			z.object({
				codeId: z.string().nullish(),
				eventId: z.string(),
				tierId: z.string(),
				amount: z.number()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;
			const ticket = await ctx.prisma.ticket.create({
				data: {
					tierId: input.tierId,
					eventId: input.eventId,
					userId: userId
				}
			});

			return ticket;
		}),
	getTicket: authedProcedure.query(({ ctx }) => {
		return ctx.prisma.ticket.findMany({
			where: {
				userId: ctx.session.user.id
			},
			include: {
				event: true
			}
		});
	})
});
