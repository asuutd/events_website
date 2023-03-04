/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			animation: {
				'slow-spin': 'spin 50s linear infinite'
			},
			backgroundImage: {
				'hero-lg':
					"url('https://ucarecdn.com/1873c6d8-b49d-4346-8b13-c88802b1b567/-/preview/-/quality/smart/-/format/auto//')",
				'hero-sm':
					"url('https://ucarecdn.com/77e47e18-943f-4c5f-bbf6-3a9fcbf3d02a/-/preview/-/quality/smart/-/format/auto//')",
				'main-img':
					"url('https://ucarecdn.com/743a3324-3a7a-47d4-b34a-5ae9f0053459/-/preview/587x270/-/quality/smart/-/format/auto//')"
			}
		}
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#E89700',

					secondary: '#455709',

					accent: '#4B140A',

					neutral: '#21202D',

					'base-100': '#EEEFF2',

					info: '#339EDB',

					success: '#1D8C65',

					warning: '#F4952F',

					error: '#E65B72'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
