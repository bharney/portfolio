module.exports = {
	plugins: [
		require('autoprefixer'),
		// PurgeCSS removes unused CSS — critical for Bootstrap which ships ~200KB of CSS
		// Only runs in production builds to keep dev experience fast
		...(process.env.NODE_ENV === 'production'
			? [
					require('@fullhuman/postcss-purgecss')({
						// Scan all TSX/HTML files for class names
						content: [
							'./src/client/**/*.tsx',
							'./src/client/**/*.ts',
							'./src/client/index.html'
						],
						// Safelist dynamic classes that PurgeCSS can't detect statically
						safelist: {
							standard: [
								// Navbar toggler states (toggled via Bootstrap JS or React)
								/^navbar/,
								/^nav-/,
								/^collapse/,
								/^collapsing/,
								/^show/,
								/^fade/,
								// Dynamic state classes added via JS
								'active',
								'overlay',
								// Offcanvas sidebar (dynamic template literals)
								/^row-offcanvas/,
								/^sidebar-offcanvas/,
								// Fixed navbar
								'fixed-top',
								'top-nav-collapse'
							],
							deep: [],
							greedy: []
						},
						// Default extractor that handles Bootstrap class patterns
						defaultExtractor: (content) =>
							content.match(/[\w-/:]+(?<!:)/g) || []
					})
			  ]
			: [])
	]
};
