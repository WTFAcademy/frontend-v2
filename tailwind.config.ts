import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// 仅用于 ShadCN 默认变量，尽量不使用，后期替换 UI 中的使用变量
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
				// WTF 2024 变量
				'wtf-brand': {
					primary: 'var(--wtf-brand-primary)',
					secondary: 'var(--wtf-brand-secondary)',
					bg: 'var(--wtf-brand-bg)',
					'primary-light': 'var(--wtf-brand-primary-light)',
				},
				'wtf-text': {
					1: 'var(--wtf-text-1)',
					2: 'var(--wtf-text-2)',
					3: 'var(--wtf-text-3)',
					4: 'var(--wtf-text-4)',
					white: 'var(--wtf-text-white)',
					black: 'var(--wtf-text-black)',
					link: 'var(--wtf-text-link)',
				},
				'wtf-bg': {
					primary: 'var(--wtf-bg-primary)',
					gray: 'var(--wtf-bg-gray)',
					code: 'var(--wtf-bg-code)',
					mask: 'var(--wtf-bg-mask)',
					'white-light': 'var(--wtf-bg-white-light)',
					'black-light': 'var(--wtf-bg-black-light)',
					'black-lighter': 'var(--wtf-bg-black-lighter)',
				},
				'wtf-border': {
					divider: 'var(--wtf-border-divider)',
					line: 'var(--wtf-border-line)',
					outline: 'var(--wtf-border-outline)',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
