import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import MobileCarousel from '../components/MobileCarousel';
import TypeWriter from 'typewriter-effect';
const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>ASU Events</title>
				<meta name="description" content="Pay for special events that ASU hosts" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="py-2 ">
				<MobileCarousel />
				<div>
					<h1 className="text-3xl ">
						Events{' '}
						<span className="text-primary font-semibold">
							<TypeWriter
								options={{
									strings: ['around your campus.', 'from your orgs.', 'run by you?'],
									autoStart: true,
									loop: true,
									delay: 100
								}}
							/>
						</span>
					</h1>
				</div>
			</main>
		</>
	);
};

export default Home;
