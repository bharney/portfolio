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
								/^navbar/,
								/^nav-/,
								/^modal/,
								/^dropdown/,
								/^collapse/,
								/^collapsing/,
								/^show/,
								/^fade/,
								/^active/,
								/^affix/,
								/^overlay/,
								/^offcanvas/,
								/^toast/,
								/^btn/,
								/^card/,
								/^container/,
								/^row/,
								/^col/,
								/^g-/,
								/^gy-/,
								/^gx-/,
								/^alert/,
								/^list-group/,
								/^shadow/,
								/^border/,
								/^rounded/,
								/^text-/,
								/^bg-/,
								/^fixed-top/,
								/^me-auto/,
								/^ms-/,
								/^mb-/,
								/^mt-/,
								/^pt-/,
								/^pb-/,
								/^py-/,
								/^px-/,
								/^p-/,
								/^m-/,
								/^w-/,
								/^h-/,
								/^d-/,
								/^flex/,
								/^justify-/,
								/^align-/,
								/^img-fluid/
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
