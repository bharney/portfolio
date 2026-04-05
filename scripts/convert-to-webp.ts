#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * Converts all JPG/PNG images in src/client/images/ to WebP format.
 * Keeps the originals as fallbacks for the <picture> element.
 *
 * Usage:
 *   npx ts-node scripts/convert-to-webp.ts
 *
 * Prerequisites:
 *   npm install --save-dev sharp
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.resolve(__dirname, '..', 'src', 'client', 'images');
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

async function convertImages() {
	const files = fs.readdirSync(IMAGES_DIR);
	let converted = 0;

	for (const file of files) {
		const ext = path.extname(file).toLowerCase();
		if (!EXTENSIONS.includes(ext)) continue;

		const inputPath = path.join(IMAGES_DIR, file);
		const outputPath = path.join(IMAGES_DIR, `${path.parse(file).name}.webp`);

		// Skip if WebP already exists
		if (fs.existsSync(outputPath)) {
			console.log(`  ⏭  ${file} → WebP already exists, skipping`);
			continue;
		}

		try {
			const inputStats = fs.statSync(inputPath);
			await sharp(inputPath)
				.webp({ quality: 80 })
				.toFile(outputPath);

			const outputStats = fs.statSync(outputPath);
			const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
			console.log(
				`  ✅ ${file} → ${path.parse(file).name}.webp  (${savings}% smaller)`
			);
			converted++;
		} catch (err) {
			console.error(`  ❌ Failed to convert ${file}:`, err);
		}
	}

	console.log(`\nConverted ${converted} image(s) to WebP.`);
	console.log('Original files kept as fallbacks for <picture> element.');
}

convertImages();
