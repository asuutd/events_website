import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>ASU Events</title>
				<meta name="description" content="Pay for special events that ASU hosts" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="py-2 ">
				<div className="sm:hero min-h-screen bg-base-100 mx-auto sm:mx-5">
					<div className="hero-content flex flex-col gap-10 justify-between items-center p-0">
						<h1 className="text-4xl font-bold text-primary">Fall Ball is Here!!!</h1>
						<img
							src="https://ucarecdn.com/0f711f3c-8937-42ad-ade5-5db0e8159edf/-/preview/-/quality/smart/-/format/auto/"
							className="sm:hidden w-auto lg:max-w-sm rounded-lg shadow-2xl object-fit"
						/>
						<img
							src="https://ucarecdn.com/39567007-8c47-4d19-a39c-a8ecc39aecfc/"
							className="hidden sm:block w-auto lg:max-w-sm rounded-lg shadow-2xl object-fit"
						/>

						<Link href="/events/cl8r36itw0000uh8sjkoy3uo7">
							<a className="btn btn-primary">Get Tickets</a>
						</Link>
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;
