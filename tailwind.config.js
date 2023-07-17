/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}'
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	daisyui: {
		themes: [
			'autumn',
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
	plugins: [require('daisyui'), require('tailwindcss-animate')]
};
