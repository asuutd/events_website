import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useMemo } from 'react';
import {
	Html5QrcodeResult,
	Html5QrcodeScanner,
	QrcodeErrorCallback,
	QrcodeSuccessCallback
} from 'html5-qrcode';
import { useRouter } from 'next/router';
import { Html5QrcodeScannerConfig } from 'html5-qrcode/esm/html5-qrcode-scanner';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';
import Autocomplete, { usePlacesWidget } from 'react-google-autocomplete';
import { env } from '@/env/client.mjs';
import { useAddressAutofillCore } from '@mapbox/search-js-react';
import { randomUUID } from 'crypto';
import dynamic from 'next/dynamic';
import { trpc } from '@/utils/trpc';
const qrcodeRegionId = 'html5qr-code-full-region';

// Creates the configuration object for Html5QrcodeScanner.
type ConfigProps = any;
const createConfig = (props: Html5QrcodeScannerConfig) => {
	const config: any = {};
	if (props.fps) {
		config.fps = props.fps;
	}
	if (props.qrbox) {
		config.qrbox = props.qrbox;
	}
	if (props.aspectRatio) {
		config.aspectRatio = props.aspectRatio;
	}
	if (props.disableFlip !== undefined) {
		config.disableFlip = props.disableFlip;
	}
	return config;
};
type newType = Html5QrcodeScannerConfig & {
	fps: number;
	verbose?: boolean;
	qrCodeSuccessCallback: QrcodeSuccessCallback;
	qrCodeErrorCallback: QrcodeErrorCallback;
};
const Html5QrcodePlugin: React.FC<newType> = (props) => {
	useEffect(() => {
		// when component mounts
		const config = createConfig(props);
		const verbose = props.verbose === true;
		// Suceess callback is required.
		if (!props.qrCodeSuccessCallback) {
			throw 'qrCodeSuccessCallback is required callback.';
		}
		const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
		html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

		// cleanup function when component will unmount
		return () => {
			html5QrcodeScanner.clear().catch((error) => {
				console.error('Failed to clear html5QrcodeScanner. ', error);
			});
		};
	}, []);

	return <div id={qrcodeRegionId} />;
};

export default function Test() {
	const router = useRouter();
	const validateMut = trpc.ticket.validateTicket.useMutation();
	const onNewScanResult = (decodedText: string, decodedResult: Html5QrcodeResult) => {
		// handle decoded results here
		router.push(decodedText);
	};

	const locationQuery = useMemo(() => {
		const url = new URL('https://www.google.com/maps/embed/v1/place');
		url.searchParams.append('key', env.NEXT_PUBLIC_GOOGLE_MAPS_KEY);
		url.searchParams.append(
			'q',
			'3000 Northside Boulevard, Richardson, Texas 75080, United States'
		);
		return url.toString();
	}, []);

	const sessionToken = useMemo(() => {
		return uuidv4();
	}, []);

	const onError = (errorMessage: string, error: Html5QrcodeError) => {
		const url = new URL(errorMessage);
		const ticketId = url.searchParams.get('id');
		const eventId = url.searchParams.get('eventId');
		if (ticketId && eventId) {
			validateMut.mutate({
				eventId,
				ticketId
			});
		}
	};

	return (
		<>
			<Html5QrcodePlugin
				fps={10}
				qrbox={250}
				rememberLastUsedCamera={true}
				disableFlip={false}
				qrCodeSuccessCallback={onNewScanResult}
				qrCodeErrorCallback={onError}
			/>

			{validateMut.isSuccess && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="Layer_1"
					className=" w-5 h-5 fill-success"
					viewBox="0 0 122.88 101.6"
				>
					<title>tick-green</title>
					<path d="M4.67,67.27c-14.45-15.53,7.77-38.7,23.81-24C34.13,48.4,42.32,55.9,48,61L93.69,5.3c15.33-15.86,39.53,7.42,24.4,23.36L61.14,96.29a17,17,0,0,1-12.31,5.31h-.2a16.24,16.24,0,0,1-11-4.26c-9.49-8.8-23.09-21.71-32.91-30v0Z" />
				</svg>
			)}
		</>
	);
}

const MapBoxComponent = dynamic(() => import('../components/MapBox'), {
	ssr: false
});
