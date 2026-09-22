import { defineConfig } from "vitest/config";

export default defineConfig({
  // Force Vite's internal development server to bypass DNS lookup
	server: {
		host: "127.0.0.1",
	},
	test: {
		include: [
			"test/**/*.{js,ts}", // support separate test files
		],
		pool: "forks", // the v4 default; stated here for clarity
		maxWorkers: 1, // single worker process
		fileParallelism: false,
		isolate: false,
		passWithNoTests: true, // a fresh clone has no tests yet
		coverage: {
			provider: "v8",
			enabled: false,
			include: [
        		"src/**/*.{ts,tsx}", // only instrument src
			],
		},
	},
});
