class ParallaxPart {
	private el: HTMLElement;
	private speed: number;

	constructor(el: HTMLElement) {
		this.el = el;
		this.speed = parseFloat(this.el.getAttribute('data-parallax-speed') || '0');
	}

	update(scrollY: number): void {
		// speed=0 → layer stays fixed (doesn't move at all)
		// speed=1 → layer moves with normal scroll (disappears at same rate as page)
		// Values in between create the parallax depth effect
		const offset = -(scrollY * this.speed);
		this.el.style.transform = `translate3d(0, ${offset}px, 0)`;
	}
}

class ParallaxManager {
	private parts: ParallaxPart[] = [];
	private ticking = false;

	constructor(selector: string) {
		const nodeList = document.querySelectorAll<HTMLElement>(selector);
		if (nodeList.length === 0) {
			throw new Error('Parallax: No elements found');
		}
		for (const el of Array.from(nodeList)) {
			this.parts.push(new ParallaxPart(el));
		}
		window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
		this.scrollHandler();
	}

	private onScroll(): void {
		if (!this.ticking) {
			this.ticking = true;
			window.requestAnimationFrame(() => {
				this.scrollHandler();
				this.ticking = false;
			});
		}
	}

	private scrollHandler(): void {
		const scrollY = Math.max(window.pageYOffset, 0);
		for (const part of this.parts) {
			part.update(scrollY);
		}
	}
}

export { ParallaxManager };
