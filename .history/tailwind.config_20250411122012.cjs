/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,svelte}"
	],
	theme: {
		extend: {
			colors: {
				background: "#0f172a", // dark bluish gray
				accent: "#1e293b",     // lighter dark tone
				primary: "#38bdf8"     // Tailwind blue-400
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"]
			}
		}
	},
	plugins: [],
}
