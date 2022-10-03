import type { NextPage } from 'next';
import Head from 'next/head';
import { signIn, signOut, useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import Link from 'next/link';

const Home: NextPage = () => {
	const hello = trpc.example.hello.useQuery({ text: 'from tRPC' });

	return (
		<>
			<Head>
				<title>ASU Events</title>
				<meta name="description" content="Pay for special events that ASU hosts" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="mx-6   py-2 ">
				<div className="hero min-h-screen bg-base-100 px-5">
					<div className="hero-content flex-col lg:flex-row-reverse gap-10 justify-between">
						<img
							src="https://ucarecdn.com/507bbe81-26dd-4cec-ad8c-978419c619eb/-/preview/-/quality/smart/-/format/auto/"
							className="w-auto lg:max-w-sm rounded-lg shadow-2xl object-fit"
						/>
						<div className="p-6 m-6 basis-1/2">
							<h1 className="text-5xl font-bold text-primary">Fall Ball is Here!!!</h1>
							<p className="py-6">
								Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
								exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
							</p>
							<Link href="/events/cl8r36itw0000uh8sjkoy3uo7">
								<a className="btn btn-primary">Get your Tickets</a>
							</Link>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;
