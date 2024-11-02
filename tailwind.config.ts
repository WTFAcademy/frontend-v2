import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./features/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
    	container: {
    		center: true,
    		padding: {
    			DEFAULT: '0',
    			'4xl': '20rem'
    		},
    		screens: {
    			DEFAULT: '100%',
    			'4xl': '2560px'
    		}
    	},
    	extend: {
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			black: 'hsl(var(--wtf-base-black))',
    			white: 'hsl(var(--wtf-base-white))',
    			blue: {
    				'50': 'hsl(var(--wtf-base-blue-50))',
    				'100': 'hsl(var(--wtf-base-blue-100))',
    				'200': 'hsl(var(--wtf-base-blue-200))',
    				'300': 'hsl(var(--wtf-base-blue-300))',
    				'400': 'hsl(var(--wtf-base-blue-400))',
    				'500': 'hsl(var(--wtf-base-blue-500))',
    				'600': 'hsl(var(--wtf-base-blue-600))',
    				'700': 'hsl(var(--wtf-base-blue-700))',
    				'800': 'hsl(var(--wtf-base-blue-800))',
    				'900': 'hsl(var(--wtf-base-blue-900))',
    				'950': 'hsl(var(--wtf-base-blue-950))'
    			},
    			gray: {
    				'50': 'hsl(var(--wtf-base-gray-50))',
    				'100': 'hsl(var(--wtf-base-gray-100))',
    				'200': 'hsl(var(--wtf-base-gray-200))',
    				'300': 'hsl(var(--wtf-base-gray-300))',
    				'400': 'hsl(var(--wtf-base-gray-400))',
    				'500': 'hsl(var(--wtf-base-gray-500))',
    				'600': 'hsl(var(--wtf-base-gray-600))',
    				'700': 'hsl(var(--wtf-base-gray-700))',
    				'800': 'hsl(var(--wtf-base-gray-800))',
    				'900': 'hsl(var(--wtf-base-gray-900))',
    				'950': 'hsl(var(--wtf-base-gray-950))'
    			},
    			green: {
    				'50': 'hsl(var(--wtf-base-green-50))',
    				'100': 'hsl(var(--wtf-base-green-100))',
    				'200': 'hsl(var(--wtf-base-green-200))',
    				'300': 'hsl(var(--wtf-base-green-300))',
    				'400': 'hsl(var(--wtf-base-green-400))',
    				'500': 'hsl(var(--wtf-base-green-500))',
    				'600': 'hsl(var(--wtf-base-green-600))',
    				'700': 'hsl(var(--wtf-base-green-700))',
    				'800': 'hsl(var(--wtf-base-green-800))',
    				'900': 'hsl(var(--wtf-base-green-900))',
    				'950': 'hsl(var(--wtf-base-green-950))'
    			},
    			red: {
    				'50': 'hsl(var(--wtf-base-red-50))',
    				'100': 'hsl(var(--wtf-base-red-100))',
    				'200': 'hsl(var(--wtf-base-red-200))',
    				'300': 'hsl(var(--wtf-base-red-300))',
    				'400': 'hsl(var(--wtf-base-red-400))',
    				'500': 'hsl(var(--wtf-base-red-500))',
    				'600': 'hsl(var(--wtf-base-red-600))',
    				'700': 'hsl(var(--wtf-base-red-700))',
    				'800': 'hsl(var(--wtf-base-red-800))',
    				'900': 'hsl(var(--wtf-base-red-900))',
    				'950': 'hsl(var(--wtf-base-red-950))'
    			},
    			orange: {
    				'50': 'hsl(var(--wtf-base-orange-50))',
    				'100': 'hsl(var(--wtf-base-orange-100))',
    				'200': 'hsl(var(--wtf-base-orange-200))',
    				'300': 'hsl(var(--wtf-base-orange-300))',
    				'400': 'hsl(var(--wtf-base-orange-400))',
    				'500': 'hsl(var(--wtf-base-orange-500))',
    				'600': 'hsl(var(--wtf-base-orange-600))',
    				'700': 'hsl(var(--wtf-base-orange-700))',
    				'800': 'hsl(var(--wtf-base-orange-800))',
    				'900': 'hsl(var(--wtf-base-orange-900))',
    				'950': 'hsl(var(--wtf-base-orange-950))'
    			},
    			'wtf-brand': {
    				'1': 'hsl(var(--wtf-brand-1))',
    				'2': 'hsl(var(--wtf-brand-2))',
    				'3': 'hsl(var(--wtf-brand-3))'
    			},
    			'wtf-content': {
    				'1': 'hsl(var(--wtf-content-1))',
    				'2': 'hsl(var(--wtf-content-2))',
    				'3': 'hsl(var(--wtf-content-3))',
    				'4': 'hsl(var(--wtf-content-4))',
    				white: 'hsl(var(--wtf-content-white))',
    				black: 'hsl(var(--wtf-content-black))',
    				inverted: 'hsl(var(--wtf-content-inverted))'
    			},
    			'wtf-border': {
    				divider: 'hsl(var(--wtf-border-divider))',
    				line: 'hsl(var(--wtf-border-line))',
    				outline: 'hsl(var(--wtf-border-outline))'
    			},
    			'wtf-function': {
    				success: 'var(--wtf-function-success)',
    				successBg: 'var(--wtf-function-success-bg)',
    				error: 'var(--wtf-function-error)',
    				errorBg: 'var(--wtf-function-error-bg)',
    				warning: 'var(--wtf-function-warning)',
    				warningBg: 'var(--wtf-function-warning-bg)',
    				link: 'var(--wtf-function-link)',
    				brandBg: 'var(--wtf-function-brand-bg)'
    			},
    			'wtf-background': {
    				primary: 'var(--wtf-background-primary)',
    				code: 'var(--wtf-background-code)',
    				block: 'var(--wtf-background-block)',
    				tag: 'var(--wtf-background-tag)',
    				navbar: 'var(--wtf-background-navbar)',
    				navbar2: 'var(--wtf-background-navbar-2)',
    				footer: 'var(--wtf-background-footer)',
    				mask: 'var(--wtf-background-mask)',
    				hover: 'var(--wtf-background-hover)',
					navButton: 'var(--wtf-background-nav-button)',
					navButtonHover: 'var(--wtf-background-nav-button-hover)'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		fontFamily: {
    			roboto: ['var(--font-roboto)'],
    			inter: ['var(--font-inter)'],
    			'roboto-mono': ['var(--font-roboto-mono)']
    		},
    		screens: {
    			'4xl': '2560px'
    		}
    	}
    },
	plugins: [
		require("tailwindcss-animate"),
		require("tailwind-scrollbar-hide"),
	],
};
export default config;
