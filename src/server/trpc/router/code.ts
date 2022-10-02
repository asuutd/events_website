import { authedProcedure, t } from '../trpc';
import { z } from 'zod';

export const codeRouter = t.router({
	getCode: authedProcedure
		.input(
			z.object({
				code: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			//const userId = ctx.session.user.id;
			const code = await ctx.prisma.code.findFirst({
				where: {
					code: input.code
				},
				include: {
					tier: true
				}
			});

			return code;
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
