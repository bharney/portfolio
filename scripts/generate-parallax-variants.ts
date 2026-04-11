#!/usr/bin/env node

/**
 * Parallax Layer Variant Generator
 *
 * Converts source layer PNGs named like:
 *   _0015_Layer-0.png
 *   _0007_Layers-8.png
 * into:
 *   Layer 0-desktop.webp
 *   Layer 0-mobile.webp
 *
 * Defaults:
 * - desktop width: 1440
 * - mobile width: 960
 * - webp quality: 82
 *
 * Usage:
 *   npm run images:parallax
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.resolve(__dirname, '..', 'src', 'client', 'images');
const DESKTOP_WIDTH = 1440;
const MOBILE_WIDTH = 960;
const WEBP_QUALITY = 82;

const SOURCE_LAYER_RE = /^_0+\d+_Layers?-(\d+)\.png$/i;

interface LayerSource {
	layerId: number;
	fileName: string;
	inputPath: string;
}

function getLayerSources(): LayerSource[] {
	const files = fs.readdirSync(IMAGES_DIR);

	const layerSources = files
		.map((fileName: string) => {
			const match = fileName.match(SOURCE_LAYER_RE);
			if (!match) return null;

			const layerId = Number(match[1]);
			return {
				layerId,
				fileName,
				inputPath: path.join(IMAGES_DIR, fileName)
			};
		})
		.filter((value: LayerSource | null): value is LayerSource => value !== null)
		.sort((a: LayerSource, b: LayerSource) => a.layerId - b.layerId);

	return layerSources;
}

async function generateVariant(
	inputPath: string,
	outputPath: string,
	width: number,
	quality: number
): Promise<void> {
	await sharp(inputPath)
		.resize({ width, withoutEnlargement: true })
		.webp({ quality })
		.toFile(outputPath);
}

async function generateParallaxVariants(): Promise<void> {
	const sources = getLayerSources();

	if (sources.length === 0) {
		console.log('No source files found matching _000*_Layer-*.png or _000*_Layers-*.png');
		process.exitCode = 1;
		return;
	}

	console.log(`Found ${sources.length} layer source file(s).`);
	console.log(
		`Generating WebP variants (desktop: ${DESKTOP_WIDTH}px, mobile: ${MOBILE_WIDTH}px, quality: ${WEBP_QUALITY})`
	);

	let generatedCount = 0;

	for (const source of sources) {
		const desktopOutput = path.join(IMAGES_DIR, `Layer ${source.layerId}-desktop.webp`);
		const mobileOutput = path.join(IMAGES_DIR, `Layer ${source.layerId}-mobile.webp`);

		try {
			await Promise.all([
				generateVariant(source.inputPath, desktopOutput, DESKTOP_WIDTH, WEBP_QUALITY),
				generateVariant(source.inputPath, mobileOutput, MOBILE_WIDTH, WEBP_QUALITY)
			]);

			generatedCount += 2;
			console.log(
				`OK Layer ${source.layerId}: ${path.basename(desktopOutput)}, ${path.basename(mobileOutput)}`
			);
		} catch (error) {
			console.error(`Failed generating variants for ${source.fileName}:`, error);
			process.exitCode = 1;
		}
	}

	console.log(`Generated ${generatedCount} file(s).`);
}

generateParallaxVariants().catch((error: unknown) => {
	console.error('Unexpected error generating parallax variants:', error);
	process.exit(1);
});
