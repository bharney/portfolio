import {
	DefinePlugin,
	Configuration,
	NormalModuleReplacementPlugin,
	ProvidePlugin,
	LoaderOptionsPlugin
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
			env.analyze && new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true })
		].filter(Boolean),
		devServer: {
			hot: env.hot,
			port: 9000,
			historyApiFallback: true
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
