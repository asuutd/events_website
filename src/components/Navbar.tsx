import React, { MouseEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import {
	ClientSafeProvider,
	getProviders,
	LiteralUnion,
	signIn,
	signOut,
	useSession
} from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BuiltInProviderType } from 'next-auth/providers';

const Navbar = () => {
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>(null);
	//const url = new URL(window.location.href);

	useEffect(() => {
		getProviders().then((providers) => setProviders(providers));
		console.log(providers);
	}, []);
	const router = useRouter();

	useEffect(() => {
		console.log(window.location.href);
	}, [router]);
	const { data: session, status } = useSession();
	const handleLogout = (e: MouseEvent<HTMLAnchorElement>) => {
		//assertConfiguration().close(); //Close Ably Client on Logout
		signOut({ redirect: true, callbackUrl: window.location.href });
	};
	return (
		<div className="navbar bg-base-100">
			<div className="flex-1">
				<Link className="btn btn-ghost normal-case text-xl" href="/">
					<a className="flex items-center gap-1">
						<img src="/pic_4.png" alt="ASU" className="h-10 w-10" />
						Events
					</a>
				</Link>
			</div>
			<div className="flex-none gap-2">
				<div className="dropdown dropdown-end">
					{status === 'unauthenticated' ? (
						<>
							<div className="dropdown dropdown-end">
								<label tabIndex={0} className="btn m-1 btn-primary uppercase">
									Sign In
								</label>
								<ul tabIndex={0} className="dropdown-content menu  rounded-box w-52">
									{providers &&
										Object.values(providers)
											.filter((provider) => provider.name != 'Credentials')
											.map((provider) => (
												<li key={provider.name} className=" justify-center">
													<button
														className={` shadow-md w-auto rounded-md gap-1  content-between px-2 py-3 my-2 justify-start bg-base-100 text-black`}
														onClick={() =>
															signIn(provider.id, { callbackUrl: window.location.href })
														}
													>
														<img
															src={`/OAuthProviderIcons/${provider.name}.svg`}
															alt="Discord"
															className="h-6 w-6"
														/>
														Sign in with {provider.name}
													</button>
												</li>
											))}
								</ul>
							</div>
							{/* <ul
								tabIndex={0}
								className="menu menu-compact dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-box w-52"
							>
								{providers &&
									providers !== undefined &&
									Object.values(providers).map((provider) => (
										<div key={provider.name} className="justify-center flex">
											<button
												className={`rounded-md content-center px-2 py-3 my-2 ${
													provider.id === 'facebook'
														? 'bg-[#1778F2] text-white'
														: 'bg-slate-200 text-black'
												}`}
												onClick={() =>
													signIn(provider.id, { callbackUrl: 'http://localhost:3000' })
												}
											>
												Sign in with {provider.name}
											</button>
										</div>
									))}
							</ul> */}
						</>
					) : status === 'loading' ? (
						<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
							<div className="w-10 rounded-full">
								<h2 className="h-10 w-10 rounded-full bg-gray-400 animate-pulse avatar" />
							</div>
						</label>
					) : (
						<>
							<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
								<div className="w-10 rounded-full">
									<Image
										src={session?.user?.image || '/Missing_avatar.svg'}
										layout="intrinsic"
										className="w-10 rounded-full"
										width="100"
										height="100"
									/>
								</div>
							</label>
							<ul
								tabIndex={0}
								className="menu menu-compact dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-box w-52"
							>
								<li>
									<Link href="/tickets">Tickets</Link>
								</li>

								<li>
									<a onClick={(e) => handleLogout(e)}>Logout</a>
								</li>
							</ul>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
