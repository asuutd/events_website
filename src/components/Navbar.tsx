import React, { MouseEvent } from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
	const { data: session, status } = useSession();
	const handleLogout = (e: MouseEvent<HTMLAnchorElement>) => {
		//assertConfiguration().close(); //Close Ably Client on Logout
		signOut({ redirect: true, callbackUrl: '/' });
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
							<label tabIndex={0} className="btn btn-primary" htmlFor="my-modal-4">
								SIGN IN
							</label>
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
