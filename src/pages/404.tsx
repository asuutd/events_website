import Link from 'next/link';
import React from 'react';

const ErrorPage = () => {
	return (
		<div className="flex flex-col justify-center min-h-[66vh]">
			<h2 className="text-secondary text-7xl text-center">:(</h2>
			<p>Life is hard as a sole developer. Don't make it harder</p>
			<Link href="/" className="underline text-center">
				Go home
			</Link>
		</div>
	);
};

export default ErrorPage;
