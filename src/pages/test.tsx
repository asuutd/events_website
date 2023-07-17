import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';

export default function Test() {
	return (
		<>
			<label htmlFor="party">Enter a date and time for your party booking:</label>
			<input
				id="party"
				type="datetime-local"
				name="partydate"
				value="2017-06-01T08:30"
				onChange={(e) => console.log(e.target.value)}
			/>
		</>
	);
}
