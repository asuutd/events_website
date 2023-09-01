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
		console.log(errorMessage);
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

			<div className=" bottom-0  left-0 w-full overflow-hidden leading-0 z-[0] h-[50vh]">
				<svg
					data-name="Layer 1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1200 120"
					preserveAspectRatio="none"
					className="relative block w-[calc(128%+1.3px)] h-54"
				>
					<path
						d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
						className="fill-[#F1B4B4]"
					></path>
				</svg>
			</div>
		</>
	);
}

const MapBoxComponent = dynamic(() => import('../components/MapBox'), {
	ssr: false
});
