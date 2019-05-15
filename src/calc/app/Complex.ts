
export class Complex {

	re: number;
	im: number | null;

	constructor(re: number, im: number | null = null) {
		this.re = re;
		this.im = im;
	}

	get isReal(): boolean {
		return !this.im;
	}

	get isComplex(): boolean {
		return !this.isReal;
	}

	get isNaN(): boolean {
		return isNaN(this.re) || (!!this.im && isNaN(this.im));
	}

	get isInfinity(): boolean {
		return this.re === Infinity || this.re === -Infinity || this.im === Infinity || this.im === -Infinity;
	}

	abs(): Complex {
		return new Complex(Math.abs(this.re));
	}

	chs(): Complex {
		return new Complex(-this.re, this.im === null ? null : -this.im);
	}

	inv(): Complex {
		return new Complex(1.0/this.re);
	}

	sqrt(): Complex {
		const x = new Complex(Math.sqrt(this.re));
		console.log("sqrt(" + JSON.stringify(this) + "): " + JSON.stringify(x));
		return x;
	}

	sqr(): Complex {
		return new Complex(this.re*this.re);
	}

	add(y: Complex): Complex {
		return new Complex(this.re + y.re, this.im == null && y.im == null ? null : (this.im || 0) + (y.im || 0));
	}

	sub(y: Complex): Complex {
		return new Complex(this.re - y.re, this.im == null && y.im == null ? null : (this.im || 0) - (y.im || 0));
	}

	mul(y: Complex): Complex {
		return new Complex(this.re * y.re);
	}

	div(y: Complex): Complex {
		return new Complex(this.re / y.re);
	}

	pow(y: Complex): Complex {
		return new Complex(Math.pow(this.re, y.re));
	}

	ln(): Complex {
		return new Complex(Math.log(this.re));
	}

	log(): Complex {
		return new Complex(Math.log10(this.re));
	}

	sin(): Complex {
		return new Complex(Math.sin(this.re));
	}

	cos(): Complex {
		return new Complex(Math.cos(this.re));
	}

	tan(): Complex {
		return new Complex(Math.tan(this.re));
	}

}

export const ZERO = new Complex(0);

export const ONE = new Complex(1);

export const E = new Complex(Math.E);

export const PI = new Complex(Math.PI);

export const TEN = new Complex(10);

export const I = new Complex(0, 1);
