import layer1Desktop from '../../images/Layer 1-desktop.webp';
import layer1Mobile from '../../images/Layer 1-mobile.webp';
import layer2Desktop from '../../images/Layer 2-desktop.webp';
import layer2Mobile from '../../images/Layer 2-mobile.webp';
import layer3Desktop from '../../images/Layer 3-desktop.webp';
import layer3Mobile from '../../images/Layer 3-mobile.webp';
import layer4Desktop from '../../images/Layer 4-desktop.webp';
import layer4Mobile from '../../images/Layer 4-mobile.webp';
import layer5Desktop from '../../images/Layer 5-desktop.webp';
import layer5Mobile from '../../images/Layer 5-mobile.webp';
import layer6Desktop from '../../images/Layer 6-desktop.webp';
import layer6Mobile from '../../images/Layer 6-mobile.webp';
import layer7Desktop from '../../images/Layer 7-desktop.webp';
import layer7Mobile from '../../images/Layer 7-mobile.webp';
import layer8Desktop from '../../images/Layer 8-desktop.webp';
import layer8Mobile from '../../images/Layer 8-mobile.webp';
import layer9Desktop from '../../images/Layer 9-desktop.webp';
import layer9Mobile from '../../images/Layer 9-mobile.webp';
import layer11Desktop from '../../images/Layer 10-desktop.webp';
import layer11Mobile from '../../images/Layer 10-mobile.webp';
import layer12Desktop from '../../images/Layer 11-desktop.webp';
import layer12Mobile from '../../images/Layer 11-mobile.webp';
import layer13Desktop from '../../images/Layer 12-desktop.webp';
import layer13Mobile from '../../images/Layer 12-mobile.webp';
import layer14Desktop from '../../images/Layer 13-desktop.webp';
import layer14Mobile from '../../images/Layer 13-mobile.webp';
import layer15Desktop from '../../images/Layer 14-desktop.webp';
import layer15Mobile from '../../images/Layer 14-mobile.webp';
import layer16Desktop from '../../images/Layer 15-desktop.webp';
import layer16Mobile from '../../images/Layer 15-mobile.webp';

export interface ParallaxLayerConfig {
	id: number;
	speed: number;
	zIndex: number;
	desktopImage: string;
	mobileImage: string;
	backgroundSize?: string;
	backgroundPosition?: string;
}

export const parallaxLayers: ParallaxLayerConfig[] = [
	{ id: 1, speed: 0.03, zIndex: 4, desktopImage: layer1Desktop, mobileImage: layer1Mobile },
	{ id: 2, speed: 0.045, zIndex: 5, desktopImage: layer2Desktop, mobileImage: layer2Mobile },
	{ id: 3, speed: 0.06, zIndex: 6, desktopImage: layer3Desktop, mobileImage: layer3Mobile },
	{ id: 4, speed: 0.08, zIndex: 7, desktopImage: layer4Desktop, mobileImage: layer4Mobile },
	{ id: 5, speed: 0.1, zIndex: 8, desktopImage: layer5Desktop, mobileImage: layer5Mobile },
	{ id: 6, speed: 0.125, zIndex: 9, desktopImage: layer6Desktop, mobileImage: layer6Mobile },
	{ id: 7, speed: 0.15, zIndex: 10, desktopImage: layer7Desktop, mobileImage: layer7Mobile },
	{ id: 8, speed: 0.18, zIndex: 11, desktopImage: layer8Desktop, mobileImage: layer8Mobile },
	{ id: 9, speed: 0.215, zIndex: 12, desktopImage: layer9Desktop, mobileImage: layer9Mobile },
	{ id: 11, speed: 0.3, zIndex: 14, desktopImage: layer11Desktop, mobileImage: layer11Mobile },
	{ id: 12, speed: 0.35, zIndex: 15, desktopImage: layer12Desktop, mobileImage: layer12Mobile },
	{ id: 13, speed: 0.41, zIndex: 16, desktopImage: layer13Desktop, mobileImage: layer13Mobile },
	{ id: 14, speed: 0.48, zIndex: 17, desktopImage: layer14Desktop, mobileImage: layer14Mobile },
	{ id: 15, speed: 0.57, zIndex: 18, desktopImage: layer15Desktop, mobileImage: layer15Mobile },
	{ id: 16, speed: 0.68, zIndex: 19, desktopImage: layer16Desktop, mobileImage: layer16Mobile }
];

export const parallaxLcpDesktopImage = layer2Desktop;
export const parallaxLayerIds = parallaxLayers.map(layer => layer.id);
export const parallaxPreloadIds = [0, 2, 5, 15];
