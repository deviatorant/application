
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				},
				medical: {
					50: '#f0f7ff',
					100: '#e0f0ff',
					200: '#baddff',
					300: '#7ebeff',
					400: '#3a9fff',
					500: '#0a84ff',
					600: '#0063e6',
					700: '#004dcc',
					800: '#0042a9',
					900: '#063b8b',
					950: '#042357',
				},
				// Nouvelles couleurs SIHATI
				sihati: {
					blue: {
						50: '#e6f8ff',
						100: '#cceeff',
						200: '#99ddff',
						300: '#66cbff',
						400: '#33baff',
						500: '#00a9ff',
						600: '#0087cc',
						700: '#006599',
						800: '#004466',
						900: '#002233',
					},
					teal: {
						50: '#e6fff7',
						100: '#ccfff0',
						200: '#99ffe0',
						300: '#66ffd1',
						400: '#33ffc1',
						500: '#00ffb2',
						600: '#00cc8e',
						700: '#00996b',
						800: '#006647',
						900: '#003324',
					},
					green: {
						50: '#eafff2',
						100: '#d5ffe6',
						200: '#abffcc',
						300: '#80ffb3',
						400: '#56ff99',
						500: '#2bff80',
						600: '#22cc66',
						700: '#1a994d',
						800: '#116633',
						900: '#09331a',
					},
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: { 
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: { 
						opacity: '1',
						transform: 'translateY(0)' 
					},
				},
				'slide-in': {
					from: { 
						transform: 'translateX(100%)' 
					},
					to: { 
						transform: 'translateX(0)' 
					},
				},
				'slide-up': {
					from: { 
						transform: 'translateY(100%)',
						opacity: '0'
					},
					to: { 
						transform: 'translateY(0)',
						opacity: '1'
					},
				},
				'scale-in': {
					from: { 
						transform: 'scale(0.95)',
						opacity: '0'
					},
					to: { 
						transform: 'scale(1)',
						opacity: '1'
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'slide-in': 'slide-in 0.3s ease-out forwards',
				'slide-up': 'slide-up 0.4s ease-out forwards',
				'scale-in': 'scale-in 0.3s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
