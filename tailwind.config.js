/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
			},
			keyframes: {
				wiggle: {
					"0%, 100%": { transform: "rotate(-10deg)" },
					"50%": { transform: "rotate(10deg)" },
				},
				updown: {
					"0%, 100%": { top: "180px" },
					"50%": { top: "200px" },
				},
			},
			animation: {
				updown: "updown 3s ease-in-out infinite",
				wiggle: "wiggle 3s ease-in-out infinite",
			},
		},
	},
	plugins: [],
};
