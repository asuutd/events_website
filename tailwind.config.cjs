/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			animation: {
				"slow-spin": "spin 50s linear infinite",
			}
		}
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#ea77ad',

					secondary: '#24d6ca',

					accent: '#1fe0b6',

					neutral: '#27192E',

					'base-100': '#F9F6F9',

					info: '#5BADC8',

					success: '#157560',

					warning: '#A67711',

					error: '#F5524D'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
