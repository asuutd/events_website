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
				<div className="hero h-[60vh] sm:h-[75vh] lg:h-screen bg-hero-sm md:bg-hero-lg rounded-md">
					<div className="hero-overlay bg-black bg-opacity-60 rounded-md"></div>
					<div className="hero-content text-center text-neutral-content">
						<div className="max-w-md">
							<Link href="/events/clep15dtk0000uh5kq4hy07ud">
								<a className="btn btn-primary btn-lg">GET TICKETS</a>
							</Link>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;
