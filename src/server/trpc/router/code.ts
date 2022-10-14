import { authedProcedure, t } from '../trpc';
import { z } from 'zod';
import generateCode from '../../../utils/generateCode';
import { Prisma } from '@prisma/client';

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
					tier: true,
					_count: {
						select: { tickets: true }
					}
				}
			});

			return code;
		}),
	createReferalCode: authedProcedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;
			try {
				const code = await ctx.prisma.refCode.create({
					data: {
						userId: userId,
						eventId: input.eventId,
						code: generateCode(6)
					},
					include: {
						event: true
					}
				});
				return { code: code.code, ref_req: code.event.ref_quantity, ref_completed: 0 };
			} catch (err) {
				if (err instanceof Prisma.PrismaClientKnownRequestError) {
					if (err.code === 'P2002') {
						const code = await ctx.prisma.refCode.findFirst({
							where: {
								userId: userId,
								eventId: input.eventId
							},
							include: {
								event: true,
								_count: {
									select: { tickets: true }
								}
							}
						});
						if (code) {
							return {
								code: code.code,
								ref_req: code.event.ref_quantity,
								ref_completed: code._count.tickets
							};
						} else {
							return { code: ':)' };
						}
					} else {
						return { code: err.code };
					}
				} else {
					return { code: ':(' };
				}
			}
		}),
	getMyRefCodes: authedProcedure
		.input(
			z.object({
				eventId: z.string().nullish()
			})
		)
		.query(({ ctx, input }) => {
			return ctx.prisma.refCode.findMany({
				where: {
					userId: ctx.session.user.id,
					...(input.eventId ? { eventId: input.eventId } : {})
				},
				include: {
					_count: {
						select: { tickets: true }
					}
				}
			});
		})
});
