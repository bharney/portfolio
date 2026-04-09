import {
	DefinePlugin,
	Configuration,
	NormalModuleReplacementPlugin,
	ProvidePlugin,
	LoaderOptionsPlugin,
	Compilation
} from 'webpack';
import 'webpack-dev-server';
import { resolve } from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { merge } from 'webpack-merge';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
const autoprefixer = require('autoprefixer');
interface Env {
	production: boolean;
	hot: boolean;
	analyze: boolean;
}

function createBaseConfig(env: Env): Configuration {
	return {
		mode: env.production ? 'production' : 'development',
		devtool: env.production ? false : 'inline-source-map',
		resolve: {
			extensions: ['.ts', '.tsx', '.js']
		},
		plugins: [
			new DefinePlugin({
				__PRODUCTION__: JSON.stringify(env.production)
			})
		]
	};
} // end base config

function createServerConfig(_env: Env): Configuration {
	return {
		name: 'server',
		target: 'node',
		context: resolve(__dirname, 'src/server'),
		externalsPresets: {
			node: true
		},
		ignoreWarnings: [
			{
				/*
				 * Express compilation issue:
				 * WARNING in ../node_modules/express/lib/view.js 81:13-25 Critical dependency: the request of a dependency is an expression
				 * more at: https://github.com/webpack/webpack/issues/1576
				 */
				module: /express/,
				message: /Critical\sdependency:\sthe\srequest\sof\sa\sdependency\sis\san\sexpression/
			}
		],
		entry: './app.ts',
		output: {
			path: resolve(__dirname, 'dist'),
			filename: 'app.js',
			publicPath: './' // file-loader prepends publicPath to the emited url. without this, react will complain about server and client mismatch
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: ['babel-loader', 'ts-loader'],
					exclude: /node_modules/
				},
				{
					test: /\.(sass|css|scss)$(\?|$)/,
					use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
				},
				{
					// Match client's asset module config (except emitFile: false equivalent)
					test: /\.(jpg|jpeg|png|gif|svg|webp|avif)$/,
					type: 'asset/resource',
					generator: {
						filename: 'images/[name].[contenthash][ext]',
						emit: false  // server doesn't need to emit image files; client already does
					}
				},
				{
					test: /\.(woff|woff2|eot|ttf)(\?|$)/,
					use: 'url-loader?limit=100000'
				}
			]
		},
		plugins: [
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: ['!public/**']
			}),
			new DefinePlugin({
				__Server__: JSON.stringify(true)
			}),
			new LoaderOptionsPlugin({
				minimize: true,
				debug: false,
				noInfo: true,
				options: {
					sassLoader: {
						includePaths: [resolve('styles')]
					},
					context: '/',
					postcss: () => [autoprefixer]
				}
			})
		]
	};
} // end server configuration

function createClientConfig(env: Env): Configuration {
	const babelConfig = {
		babelrc: false,
		presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
		plugins: [
			'@babel/plugin-transform-runtime',
			env.hot && require.resolve('react-refresh/babel')
		].filter(Boolean)
	};
	return {
		name: 'client',
		target: 'web',
		context: resolve(__dirname, 'src/client'),
		optimization: {
			splitChunks: {
				chunks: 'all'
			},
			minimizer: [
				'...',  // keep default JS minimizer (terser)
				new CssMinimizerPlugin()  // minify CSS in production
			],
			usedExports: true,  // tree-shake unused exports
			sideEffects: true   // respect package.json sideEffects field
		},
		entry: {
			index: './Index.tsx'
		},
		output: {
			path: resolve(__dirname, 'dist', 'public'),
			filename: env.production ? 'js/[name].[chunkhash].js' : 'js/[name].js',
			devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]',
			clean: true
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: { loader: 'babel-loader', options: babelConfig }
				},
				{
					// Use webpack 5 asset modules instead of file-loader
					test: /\.(jpg|jpeg|png|gif|svg|webp|avif)$/,
					type: 'asset',
					parser: {
						dataUrlCondition: {
							maxSize: 8 * 1024 // 8KB - inline small images as data URLs
						}
					},
					generator: {
						filename: 'images/[name].[contenthash][ext]'
					}
				},
				{
					test: /\.(woff|woff2|eot|ttf)$/,
					type: 'asset/resource',
					generator: {
						filename: 'fonts/[name].[contenthash][ext]'
					}
				},
				{
					test: /\.(sass|css|scss)$(\?|$)/,
					use: [
						// In production, extract CSS to separate files for caching & parallel loading
						// In dev, use style-loader for HMR
						env.production ? MiniCssExtractPlugin.loader : 'style-loader',
						'css-loader',
						'postcss-loader',
						'sass-loader'
					]
				}
			]
		},
		plugins: [
			new CleanWebpackPlugin(),
			new LoaderOptionsPlugin({
				minimize: true,
				debug: false,
				noInfo: true,
				options: {
					sassLoader: {
						includePaths: [resolve('styles')]
					},
					context: '/',
					postcss: () => [autoprefixer]
				}
			}),
			new HtmlWebpackPlugin({
				template: './index.html',
				minify: env.production ? {
					collapseWhitespace: true,
					removeComments: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true,
					useShortDoctype: true,
					minifyCSS: true,
					minifyJS: true
				} : false
			}),
			new CopyWebpackPlugin({
				patterns: [
					{ from: 'favicon.ico' },
					{ from: 'robots.txt' },
					{ from: 'sitemap.xml' }
				]
			}),
			new NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve('node-noop')), // Workaround for https://github.com/andris9/encoding/issues/16
			new DefinePlugin({
				__SERVER__: JSON.stringify(false)
			}),
			// Extract CSS into separate files in production for better caching
			env.production && new MiniCssExtractPlugin({
				filename: 'css/[name].[contenthash].css',
				chunkFilename: 'css/[id].[contenthash].css'
			}),
			(env.hot && new ReactRefreshPlugin()) as any, // casting so tsc will stop complaining
			env.analyze && new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }),
			// Make extracted CSS non-render-blocking and preload self-hosted fonts
			env.production && {
				apply(compiler: any) {
					compiler.hooks.compilation.tap('AsyncCssPlugin', (compilation: any) => {
						HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
							'AsyncCssPlugin',
							(data: any, cb: any) => {
								// 1. Make CSS links non-render-blocking
								[...data.headTags, ...data.bodyTags].forEach((tag: any) => {
									if (tag.tagName === 'link' && tag.attributes && tag.attributes.rel === 'stylesheet') {
										tag.attributes.media = 'print';
										tag.attributes.onload = "this.media='all'";
									}
								});

								// 2. Inject <link rel="preload"> for self-hosted fonts
								const woff2Assets = Object.keys(compilation.assets).filter((name: string) => name.endsWith('.woff2'));
								const woffAssets = Object.keys(compilation.assets).filter((name: string) => name.endsWith('.woff') && !name.endsWith('.woff2'));
								const fontPreloads = [
									...woff2Assets.map((name: string) => ({
										tagName: 'link',
										voidTag: true,
										attributes: {
											rel: 'preload',
											as: 'font',
											type: 'font/woff2',
											crossorigin: 'anonymous',
											href: `/${name}`
										}
									})),
									...woffAssets.map((name: string) => ({
										tagName: 'link',
										voidTag: true,
										attributes: {
											rel: 'preload',
											as: 'font',
											type: 'font/woff',
											crossorigin: 'anonymous',
											href: `/${name}`
										}
									}))
								];

								// 3. Inject <link rel="preload"> for key parallax layers (LCP candidates)
								//    Layer 0, 7, 10 are <8KB and inlined as data URLs — skip those
								//    Preload the visually largest layers that the browser needs for first paint
								const layerPreloads = [1, 15, 16].map(n => {
									const re = new RegExp(`images/Layer ${n}\\.[^.]+\\.webp$`);
									return Object.keys(compilation.assets).find((name: string) => re.test(name));
								}).filter(Boolean).map(name => ({
									tagName: 'link',
									voidTag: true,
									attributes: {
										rel: 'preload',
										as: 'image',
										type: 'image/webp',
										...(name === Object.keys(compilation.assets).find((n: string) => /images\/Layer 1\./.test(n)) ? { fetchpriority: 'high' } : {}),
										href: `/${name}`
									}
								}));

								// Insert preloads at the beginning of head tags
								data.headTags.unshift(...fontPreloads, ...layerPreloads);

								// 4. Inject inline @font-face for ALL self-hosted fonts into critical CSS
								//    so the browser can match font-family references immediately.
								//    Without this, fonts defined only in the async external stylesheet
								//    cause a layout shift when that stylesheet loads and the browser
								//    discovers + swaps them in.
								const woffFontFaceMap: Record<string, { family: string; weight: string }> = {
									'SlimJoe': { family: 'Slim Joe', weight: '400' },
									'BigJohn': { family: 'Big John', weight: '400' },
									'PlayfairDisplay-latin': { family: 'Playfair Display', weight: '400' }
								};
								const woff2FontFaceMap: Record<string, { family: string; weight: string; woffPair?: boolean }> = {
									'PlayfairDisplay-latin': { family: 'Playfair Display', weight: '400', woffPair: true },
									'FiraSansCondensed-200-latin': { family: 'Fira Sans Condensed', weight: '200' }
								};

								// Build woff2+woff combo rules for fonts that have both formats,
								// and woff-only / woff2-only rules for the rest
								const pairedFamilies = new Set<string>();
								const fontFaceRules: string[] = [];

								// First pass: woff2 fonts that also have a woff pair → combined src
								woff2Assets.forEach((w2name: string) => {
									const baseName = w2name.replace(/^fonts\//, '').replace(/\.[a-f0-9]+\.woff2$/, '');
									const meta = woff2FontFaceMap[baseName];
									if (!meta) return;
									const woffMatch = meta.woffPair
										? woffAssets.find((wn: string) => wn.replace(/^fonts\//, '').replace(/\.[a-f0-9]+\.woff$/, '') === baseName)
										: null;
									const src = woffMatch
										? `url('/${w2name}') format('woff2'),url('/${woffMatch}') format('woff')`
										: `url('/${w2name}') format('woff2')`;
									fontFaceRules.push(`@font-face{font-family:'${meta.family}';font-style:normal;font-weight:${meta.weight};font-display:optional;src:${src}}`);
									pairedFamilies.add(meta.family);
								});

								// Second pass: woff-only fonts (not already covered by a woff2 pair)
								woffAssets.forEach((name: string) => {
									const baseName = name.replace(/^fonts\//, '').replace(/\.[a-f0-9]+\.woff$/, '');
									const meta = woffFontFaceMap[baseName];
									if (!meta || pairedFamilies.has(meta.family)) return;
									fontFaceRules.push(`@font-face{font-family:'${meta.family}';font-style:normal;font-weight:${meta.weight};font-display:optional;src:url('/${name}') format('woff')}`);
								});

								const fontFaceCSS = fontFaceRules.join('');

								if (fontFaceCSS) {
									data.headTags.unshift({
										tagName: 'style',
										voidTag: false,
										innerHTML: fontFaceCSS,
										attributes: {}
									});
								}

								// 5. Inject inline layer background-image rules into critical CSS
								//    so the browser discovers all parallax layer images immediately
								//    instead of waiting for the async external stylesheet to load.
								//    Layers 0, 7, 10 are <8KB and inlined as data-URLs by webpack's
								//    asset module — they're handled via the external CSS and don't
								//    need critical-path injection.
								const layerZIndexBase = 3; // layer-0 starts at z-index:3
								const layerRules = Array.from({ length: 20 }, (_, i) => {
									const re = new RegExp(`images/Layer ${i}\\.[^.]+\\.webp$`);
									const asset = Object.keys(compilation.assets).find((n: string) => re.test(n));
									// Skip data-URL-inlined layers (no separate asset file emitted above 8KB)
									if (!asset) return '';
									return `.layer-${i}{z-index:${layerZIndexBase + i};background-image:url('/${asset}')}`;
								}).filter(Boolean).join('');

								if (layerRules) {
									data.headTags.unshift({
										tagName: 'style',
										voidTag: false,
										innerHTML: layerRules,
										attributes: {}
									});
								}

								cb(null, data);
							}
						);
					});
				}
			}
		].filter(Boolean),
		devServer: {
			hot: env.hot,
			port: 9000,
			// Only rewrite HTML page requests (not JS/CSS/font/image assets) to index.html.
			// Without this, historyApiFallback intercepts lazy-chunk requests (e.g. /js/NotFound.js)
			// and returns index.html, causing "Unexpected token '<'" errors.
			historyApiFallback: {
				rewrites: [
					{ from: /^\/js\//, to: (context: any) => context.parsedUrl.pathname },
					{ from: /^\/css\//, to: (context: any) => context.parsedUrl.pathname },
					{ from: /^\/fonts\//, to: (context: any) => context.parsedUrl.pathname },
					{ from: /^\/images\//, to: (context: any) => context.parsedUrl.pathname },
					{ from: /.*/, to: '/index.html' }
				]
			}
		}
	};
}

export default function (e: any) {
	const env: Env = {
		hot: !!e['HOT'],
		production: !!e['PRODUCTION'],
		analyze: !!e['ANALYZE']
	};

	const baseConfig = createBaseConfig(env);
	const clientConfig = merge(baseConfig, createClientConfig(env));
	const serverConfig = merge(baseConfig, createServerConfig(env));

	return [clientConfig, serverConfig];
}
