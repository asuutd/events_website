import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import MobileCarousel from '../components/MobileCarousel';
import TypeWriter from 'typewriter-effect';
import { trpc } from '@/utils/trpc';
import Image from 'next/image';
import { format } from 'date-fns';
const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Kazala</title>
				<meta name="description" content="Pay for special events that ASU hosts" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="py-2 ">
				<div className="hero min-h-[65vh] mx-auto">
					<div className="hero-content flex-col md:flex-row-reverse items-start w-full">
						<div className="mx-auto">
							<MobileCarousel />
						</div>

						<div className="my-5 max-w-xs">
							<h1 className="text-3xl ">
								Events{' '}
								<div className="text-primary font-semibold w-96">
									<TypeWriter
										options={{
											strings: ['around your campus.', 'from your orgs.', 'run by you?'],
											autoStart: true,
											loop: true,
											delay: 100,
											wrapperClassName: ' text-3xl my-10  rounded-lg w-96'
										}}
									/>
								</div>
							</h1>
						</div>
					</div>
				</div>

				<div className="my-5 ">
					<h2 className="text-3xl">Upcoming Events</h2>
					<EventCards />
				</div>
			</main>
		</>
	);
};

export default Home;

const EventCards = () => {
	const client = trpc.event.getEvents.useQuery();
	return (
		<div className="md:grid md:grid-cols-2  md:gap-2 ">
			{client.data?.map((event) => (
				<div className="card w-72 sm:w-96 bg-base-100 shadow-xl my-4 mx-auto" key={event.id}>
					<figure className="px-10 pt-10">
						<Image
							src={event.image ?? ''}
							alt="Shoes"
							className="rounded-xl object-cover"
							width={400}
							height={300}
						/>
					</figure>
					<div className="card-body items-center text-center">
						<h2 className="card-title">{event.name}</h2>
						<div className="flex items-center gap-2">
							<img src="/clock.svg" alt="" className="w-5 h-5" />
							<h2>{format(event.start, 'PPP')}</h2>
						</div>
					</div>
					<div className="card-actions justify-end">
						<Link href={`/events/${event.id}`}>
							<a className="btn btn-primary rounded-tr-none rounded-bl-none">Get Tickets</a>
						</Link>
					</div>
				</div>
			))}
		</div>
	);
};
