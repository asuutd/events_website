import type { TRPCError } from '@trpc/server';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { trpc } from '../../../utils/trpc';

const ValidatePage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const ticketId = typeof id === 'string' ? id : id == undefined ? ':)' : id[0]!;
	const [errorText, setErrorText] = useState<string | null>(null);

	const validate = trpc.ticket.validateTicket.useMutation({});
	const admin = trpc.auth.getAdmin.useQuery(
		{
			ticketId: ticketId
		},
		{
			enabled: false,
			onError: (err) => {
				setErrorText(err.message);
			},
			retry: 0
		}
	);

	useEffect(() => {
		if (router.isReady) {
			admin.refetch();
		}

		console.log(router.isReady);
	}, [router.isReady]);
	return (
		<div className="flex flex-col justify-center min-h-[66vh] gap-3">
			<button
				className={`btn btn-primary ${errorText && 'btn-disabled'}`}
				onClick={() => {
					admin.isSuccess &&
						validate.mutate({
							eventId: admin.data.eventId,
							ticketId: ticketId
						});
				}}
			>
				{' '}
				CHECK ATTENDEE
			</button>
			{errorText && <h2 className="text-error font-semibold text-xl text-center">{errorText}</h2>}
		</div>
	);
};

export default ValidatePage;
