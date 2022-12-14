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
	const [admin, setAdmin] = useState<
		| {
				eventId: string;
		  }
		| undefined
	>();

	const validate = trpc.ticket.validateTicket.useMutation({
		onError: (err) => {
			setErrorText(err.message);
		}
	});
	const adminQuery = trpc.auth.getAdmin.useQuery(
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

	const validateTicket = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();

		admin &&
			validate.mutate({
				eventId: admin.eventId,
				ticketId: ticketId
			});
	};

	useEffect(() => {
		async function anyNameFunction() {
			const { data, isSuccess } = await adminQuery.refetch();
			if (isSuccess) {
				setAdmin(data);
			}
		}

		// Execute the created function directly
		anyNameFunction();
	}, [router.isReady]);
	return (
		<div className="flex flex-col justify-center min-h-[66vh] gap-3 max-w-md mx-auto">
			<button
				className={`btn btn-primary ${errorText && 'btn-disabled'}`}
				onClick={(e) => {
					validateTicket(e);
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
