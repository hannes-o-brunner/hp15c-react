
import { transaction } from "mobx";
import { types } from "mobx-state-tree";
import { sprintf } from "sprintf-js";

const MAX = 9.999999999e99;
const MAX_MAG = 99;

const KeyTable = [
	['q', 'E', ')', '^', '\\', '_', '7', '8', '9', '/'],
	['T', 'G', 's', 'c', 't', 'e', '4', '5', '6', '*'],
	['P', 'U', 'r', 'x', '\b', '\r', '1', '2', '3', '-'],
	['\x1b', 'f', 'g', 'S', 'R', '\r', '0', '.', ';', '+']
];

export type Complex = typeof ComplexModel.Type;
export type Digit = typeof DigitModel.Type;
export type Calculator = typeof CalculatorModel.Type;

export const ComplexModel = types.model("Complex", {
	r: types.optional(types.number, 0),
	i: types.optional(types.number, 0),
})
	.views(self => { // tslint:disable-line:typedef
		return {
			get isComplex(): boolean {
				return self.i !== 0.0;
			},
			get isReal(): boolean {
				return self.i === 0.0;
			}
		};
	})
	.actions(self => { // tslint:disable-line:typedef
		return {
			clear(): void {
				self.r = 0;
				self.i = 0;
			},
		};
	});

export const DigitModel = types.model("Digit", {
	value: types.maybe(types.string),
	decimal: types.maybe(types.string),
})
	.actions(self => { // tslint:disable-line:typedef
		return {
			clear(): void {
				self.value = null;
				self.decimal = null;
			},
		};
	});

export const CalculatorModel = types.model("Calculator", {
	isOn: types.optional(types.boolean, false),
	// stack
	x: types.optional(ComplexModel, { r: 0, i: 0 }),
	y: types.optional(ComplexModel, { r: 0, i: 0 }),
	z: types.optional(ComplexModel, { r: 0, i: 0 }),
	t: types.optional(ComplexModel, { r: 0, i: 0 }),
	lastX: types.optional(ComplexModel, { r: 0, i: 0 }),
	// display
	displayMode: types.optional(types.number, 1), // 1=FIX 2=SCI 3=ENG
	displayDigits: types.optional(types.number, 4),
	lcdDisplay: types.optional(types.string, ""),
	isNegative: types.optional(types.boolean, false),
	digits: types.optional(types.array(DigitModel), [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]),
	// current keypress
	isMouseDown: types.optional(types.boolean, false),
	keyRow: types.maybe(types.number),
	keyCol: types.maybe(types.number),
})
	.views(self => { // tslint:disable-line:typedef
		return {
			get keyCode(): string | null {
				if (self.isMouseDown) {
					return KeyTable[self.keyRow!][self.keyCol!];
				}
				return null;
			}
		};
	})
	.actions(self => { // tslint:disable-line:typedef
		return {
			clearDigits(): void {
				self.isNegative = false;
				self.digits.forEach((d) => {
					d.clear();
				});
			},
			setNegative(): void {
				self.isNegative = true;
			},
			setDigit(i: number, value: string | null): void {
				self.digits[i].value = value;
			},
			setDecimal(i: number, decimal: string): void {
				self.digits[i].decimal = decimal;
			},
		};

	})
	.actions(self => { // tslint:disable-line:typedef

		function updateLCD(s: string): void {
			self.lcdDisplay = s;
			self.clearDigits();
			if (!self.isOn) {
				return;
			}
			// if (Flags[9] && !BlinkOn) {
			// 	return;
			// }
			var eex: number | null = null;
			var d = 0;
			for (var i = 0; i < s.length; i++) {
				var c = s.charAt(i);
				if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'E') || c === 'o' || c === 'r' || c === 'u') {
					if (eex !== null) {
						eex = eex * 10 + c.charCodeAt(0) - "0".charCodeAt(0);
						var t = sprintf("%02d", eex);
						self.setDigit(8, t.charAt(0));
						self.setDigit(9, t.charAt(1));
					} else if (d < 10) {
						self.setDigit(d, c);
						d++;
					}
				} else if (c === '.') {
					self.setDecimal(d - 1, "decimal");
				} else if (c === ',') {
					self.setDecimal(d - 1, "comma");
				} else if (c === '-') {
					if (eex !== null) {
						self.setDigit(7, "-");
					} else if (d > 0) {
						self.setDigit(d, "-");
						d++;
					} else {
						self.setNegative();
					}
				} else if (c === 'e') {
					eex = 0;
					d = 9;
					self.setDigit(7, null);
					self.setDigit(8, "0");
					self.setDigit(9, "0");
				} else if (c === ' ') {
					d++;
				}
			}
		}

		function insertCommas(s: string): string {
			var sign = "";
			if (s.charAt(0) === "-") {
				sign = s.charAt(0);
				s = s.substr(1);
			}
			var d = s.indexOf(".");
			if (d < 0) {
				d = s.indexOf("e");
				if (d < 0) {
					d = s.length;
				}
			}
			while (true) {
				d -= 3;
				if (d <= 0) {
					break;
				}
				s = s.substr(0, d) + "," + s.substr(d);
			}
			return sign + s;
		}

		function trunc(x: number): number {
			if (x < 0) {
				return -Math.floor(-x);
			} else {
				return Math.floor(x);
			}
		}

		function log10int(x: number): number {
			var mag = 0;
			var x = Math.abs(x);
			if (x >= 1) {
				while (x >= 10) {
					mag++;
					x /= 10;
				}
			} else if (x > 0) {
				while (x < 1) {
					mag--;
					x *= 10;
				}
			}
			return mag;
		}

		function updateNumericDisplay(n: number): void {
			// if (n instanceof Descriptor) {
			// 	update_lcd(sprintf("%c    %2d %2d",
			// 		"A".charCodeAt(0) + n.label,
			// 		g_Matrix[n.label].rows,
			// 		g_Matrix[n.label].cols));
			// } else {
			if (n > MAX) {
				n = MAX;
				// Flags[9] = true;
			} else if (n < -MAX) {
				n = -MAX;
				// Flags[9] = true;
			}
			var s = n.toString();
			var mag = log10int(n);
			var sign = "";
			if (n < 0) {
				n = -n;
				sign = "-";
			}
			if (self.displayMode === 1 && (mag >= 10 || mag < -self.displayDigits)) {
				self.displayMode = 2;
			}
			switch (self.displayMode) {
				case 1:
					var x = Math.round(n * Math.pow(10, self.displayDigits));
					s = x.toString();
					while (s.length < self.displayDigits + 1) {
						s = '0' + s;
					}
					s = s.substr(0, s.length - self.displayDigits) + '.' + s.substr(s.length - self.displayDigits);
					s = insertCommas(s);
					break;
				case 2:
					var x = Math.round(n * Math.pow(10, self.displayDigits - mag));
					// Not sure what case the following loop addresses
					while (log10int(x) > self.displayDigits) {
						if (mag >= MAX_MAG) {
							x = Math.floor(n * Math.pow(10, self.displayDigits - mag));
							break;
						}
						mag++;
						x /= 10;
					}
					s = x.toString();
					while (s.length < self.displayDigits + 1) {
						s = '0' + s;
					}
					s = s.substr(0, 1) + '.' + s.substr(1);
					s += "e" + mag;
					break;
				case 3:
					var x = Math.round(n * Math.pow(10, self.displayDigits - mag));
					s = x.toString();
					while (s.length < self.displayDigits + 1) {
						s = '0' + s;
					}
					var ilen = 1;
					while (mag % 3) {
						ilen++;
						if (s.length < ilen) {
							s += '0';
						}
						mag--;
					}
					s = s.substr(0, ilen) + '.' + s.substr(ilen);
					s += "e" + mag;
					break;
			}
			updateLCD(sign + s);
			// }
		}

		function updateDisplay(): void {
			transaction(() => {
				// if (Prgm) {
				// 	var s = sprintf("%03d-", PC);
				// 	if (PC > 0) {
				// 		if (Program[PC].info.user) {
				// 			s = s.substr(0, 3) + "u";
				// 		}
				// 		var keys = Program[PC].info.keys;
				// 		switch (keys.length) {
				// 			case 1:
				// 				s += sprintf("    %2d", keys[0]);
				// 				break;
				// 			case 2:
				// 				if (Math.floor(keys[1]) === keys[1]) {
				// 					s += sprintf(" %2d %2d", keys[0], keys[1]);
				// 				} else {
				// 					s += sprintf(" %2d  .%d", keys[0], keys[1] * 10);
				// 				}
				// 				break;
				// 			case 3:
				// 				if (Math.floor(keys[2]) === keys[2]) {
				// 					s += sprintf("%2d,%2d,%2d", keys[0], keys[1], keys[2]);
				// 				} else {
				// 					s += sprintf("%2d,%2d,.%d", keys[0], keys[1], keys[2] * 10);
				// 				}
				// 				break;
				// 		}
				// 	}
				// 	update_lcd(s);
				// } else {
				// if (DigitEntry) {
				// 	if (Entry !== "") {
				// 		update_lcd(insert_commas(Entry));
				// 	} else {
				// 		update_display_num(0);
				// 	}
				// } else {
				updateNumericDisplay(self.x.r);
				// }
				// }
				// Display.set_complex(Flags[8]);
				// Display.set_prgm(Prgm);
				// if (Flags[9]) {
				// 	if (Blinker === null) {
				// 		Blinker = setInterval(function () {
				// 			BlinkOn = !BlinkOn;
				// 			update_display();
				// 		}, 300);
				// 	}
				// } else {
				// 	if (Blinker !== null) {
				// 		clearInterval(Blinker);
				// 		Blinker = null;
				// 	}
				// }
			});
		}

		function keyDown(k: string, override: boolean = false) {
			if (!self.isOn && k != '\x1b') {
				return;
			}
			console.log("keyDown(" + k + ")");
			if (k === '\x1b') {
				self.isOn = !self.isOn;
			} else if (k === '\r') {
				self.displayMode = 1;
				self.x.r = 0;
			} else {
				if (self.x.r) {
					self.x.r = 10 * self.x.r;
				} else {
					self.x.r = 123;
				}
			}
			// if (DisableKeys && !override) {
			// 	return;
			// }
			// var op = decode(k);
			// if (op === undefined) {
			// 	return;
			// }
			// if (Running) {
			// 	clearTimeout(RunTimer);
			// 	Running = false;
			// 	return;
			// }
			// if (op !== null) {
			// 	try {
			// 		if (Prgm && op.info.programmable) {
			// 			PC++;
			// 			Program.splice(PC, 0, op);
			// 		} else {
			// 			op.exec();
			// 			if (Running) {
			// 				RunTimer = setTimeout(run, 0);
			// 			}
			// 		}
			// 	} catch (e) {
			// 		if (e.name === "CalcError") {
			// 			update_lcd("Error " + e.code);
			// 			DelayUpdate = -1;
			// 		} else {
			// 			throw e;
			// 		}
			// 	}
			// }
			// if (DelayUpdate === 0) {
			updateDisplay();
			// } else {
			// 	if (DelayUpdate > 0) {
			// 		TemporaryDisplay = true;
			// 		DisplayTimeout = setTimeout(delay_update_timeout, DelayUpdate);
			// 	}
			// 	DelayUpdate = 0;
			// }
		}

		function keyUp() {
			// if (TemporaryDisplay) {
			// 	TemporaryDisplay = false;
			// 	if (DisplayTimeout === 0) {
			// 		delay_update_timeout();
			// 	}
			// }
		}

		return {
			handleKey(key: string): void {
				keyDown(key);
				keyUp();
			},
		};

	})
	.actions(self => { // tslint:disable-line:typedef

		function init(): void {
			transaction(() => {
				self.x.clear();
				self.y.clear();
				self.z.clear();
				self.lastX.clear();
			});
		}

		return {
			powerOn(): void {
				self.isOn = true;
				init();
			},
			powerOff(): void {
				self.isOn = false;
			},
			mouseDown(row: number, col: number): void {
				self.isMouseDown = true;
				self.keyRow = row;
				self.keyCol = col;
				self.handleKey(self.keyCode!);
			},
			mouseUp(): void {
				self.isMouseDown = false;
				self.keyRow = null;
				self.keyCol = null;
			},
		};

	});
