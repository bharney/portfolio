class ParallaxPart {
	readonly el: HTMLElement;
	readonly speed: number;

	constructor(el: HTMLElement) {
		this.el = el;
		this.speed = parseFloat(el.getAttribute('data-parallax-speed') || '0');
	}
}

/**
 * Performant parallax scroll manager.
 *
 * Design choices (see developer.chrome.com/blog/performant-parallaxing):
 *  • One passive scroll listener stores scrollY; no DOM reads inside rAF.
 *  • A single rAF loop applies `translate3d` (compositor-friendly) to every layer.
 *  • The loop auto-pauses when the parallax container scrolls out of view
 *    (IntersectionObserver) so off-screen frames are free.
 *  • `destroy()` tears everything down for React unmount / route changes.
 */
class ParallaxManager {
	private parts: ParallaxPart[] = [];
	private scrollY = 0;
	private rafId = 0;
	private visible = true;
	private lastAppliedY = -1;
	private observer: IntersectionObserver | null = null;
	private readonly onScrollBound: () => void;

	constructor(selector: string, container?: string) {
		const nodeList = document.querySelectorAll<HTMLElement>(selector);
		if (nodeList.length === 0) {
			throw new Error('Parallax: No elements found');
		}

		for (const el of Array.from(nodeList)) {
			this.parts.push(new ParallaxPart(el));
		}

		// Capture initial scroll position and apply it immediately (avoids flash)
		this.scrollY = Math.max(window.scrollY, 0);
		this.requestTransformUpdate();

		// Passive scroll listener — only stores the value, never reads DOM
		this.onScrollBound = () => {
			this.scrollY = Math.max(window.scrollY, 0);
			this.requestTransformUpdate();
		};
		window.addEventListener('scroll', this.onScrollBound, { passive: true });

		// Pause the rAF loop when the parallax section leaves the viewport
		const containerEl = container
			? document.querySelector(container)
			: document.querySelector('.parallax-container');
		if (containerEl && typeof IntersectionObserver !== 'undefined') {
			this.observer = new IntersectionObserver(
				([entry]) => {
					this.visible = entry.isIntersecting;
					if (this.visible) this.requestTransformUpdate();
				},
				{ threshold: 0 }
			);
			this.observer.observe(containerEl);
		}
	}

	/* ---- rAF update scheduling ---- */

	private requestTransformUpdate(): void {
		if (!this.visible || this.rafId !== 0) return;
		this.rafId = requestAnimationFrame(() => {
			this.rafId = 0;
			this.applyTransforms();
		});
	}

	private applyTransforms(): void {
		const y = this.scrollY;
		if (y === this.lastAppliedY) return;
		this.lastAppliedY = y;

		const parts = this.parts;
		for (let i = 0, len = parts.length; i < len; i++) {
			const p = parts[i];
			// speed 0 → layer stays fixed; speed 1 → moves with scroll
			p.el.style.transform = `translate3d(0,${-(y * p.speed)}px,0)`;
		}
	}

	/* ---- cleanup ---- */

	destroy(): void {
		cancelAnimationFrame(this.rafId);
		this.rafId = 0;
		window.removeEventListener('scroll', this.onScrollBound);
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		// Reset transforms so stale state doesn't linger
		for (const p of this.parts) {
			p.el.style.transform = '';
		}
		this.parts = [];
	}
}

export { ParallaxManager };
