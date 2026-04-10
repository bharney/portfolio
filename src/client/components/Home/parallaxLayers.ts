import layer0 from '../../images/Layer 0.webp';
import layer1 from '../../images/Layer 1.webp';
import layer2 from '../../images/Layer 2.webp';
import layer3 from '../../images/Layer 3.webp';
import layer4 from '../../images/Layer 4.webp';
import layer5 from '../../images/Layer 5.webp';
import layer6 from '../../images/Layer 6.webp';
import layer7 from '../../images/Layer 7.webp';
import layer8 from '../../images/Layer 8.webp';
import layer9 from '../../images/Layer 9.webp';
import layer11 from '../../images/Layer 10.webp';
import layer12 from '../../images/Layer 11.webp';
import layer13 from '../../images/Layer 12.webp';
import layer14 from '../../images/Layer 13.webp';
import layer15 from '../../images/Layer 14.webp';
import layer16 from '../../images/Layer 15.webp';

export interface ParallaxLayerConfig {
	id: number;
	speed: number;
	zIndex: number;
	image: string;
	backgroundSize?: string;
	backgroundPosition?: string;
}

export const parallaxLayers: ParallaxLayerConfig[] = [
	{ id: 0, speed: 0.015, zIndex: 3, image: layer0 },
	{ id: 1, speed: 0.03, zIndex: 4, image: layer1 },
	{ id: 2, speed: 0.045, zIndex: 5, image: layer2 },
	{ id: 3, speed: 0.06, zIndex: 6, image: layer3 },
	{ id: 4, speed: 0.08, zIndex: 7, image: layer4 },
	{ id: 5, speed: 0.1, zIndex: 8, image: layer5 },
	{ id: 6, speed: 0.125, zIndex: 9, image: layer6 },
	{ id: 7, speed: 0.15, zIndex: 10, image: layer7 },
	{ id: 8, speed: 0.18, zIndex: 11, image: layer8 },
	{ id: 9, speed: 0.215, zIndex: 12, image: layer9 },
	{ id: 11, speed: 0.3, zIndex: 14, image: layer11 },
	{ id: 12, speed: 0.35, zIndex: 15, image: layer12 },
	{ id: 13, speed: 0.41, zIndex: 16, image: layer13 },
	{ id: 14, speed: 0.48, zIndex: 17, image: layer14 },
	{ id: 15, speed: 0.57, zIndex: 18, image: layer15 },
	{ id: 16, speed: 0.68, zIndex: 19, image: layer16 }
];

export const parallaxLcpMobileImage = layer0;
export const parallaxLcpDesktopImage = layer2;
export const parallaxLayerIds = parallaxLayers.map(layer => layer.id);
export const parallaxPreloadIds = [1, 16, 17];
