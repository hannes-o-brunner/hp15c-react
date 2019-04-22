
import { transaction } from "mobx";
import { types } from "mobx-state-tree";
import { sprintf } from "sprintf-js";

const MAX = 9.999999999e99;
const MAX_MAG = 99;

export type Digit = typeof DigitModel.Type;
export type Display = typeof DisplayModel.Type;

export const DigitModel = types.model("Digit", {
	value: types.maybeNull(types.string),
	decimal: types.maybeNull(types.string),
})
	.actions(self => ({
		clear(): void {
			self.value = null;
			self.decimal = null;
		},
	}));

export const DisplayModel = types.model("Display", {
	// display configuration
	displayMode: types.optional(types.number, 1), // 1=FIX 2=SCI 3=ENG
	displayDigits: types.optional(types.number, 4),
	// display
	lcdDisplay: types.optional(types.string, ""),
	isNegative: types.optional(types.boolean, false),
	digits: types.optional(types.array(DigitModel), [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]),
})
	.actions(self => ({
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
	}))
	.actions(self => { // tslint:disable-line:typedef

		function updateLCD(s: string): void {
			self.lcdDisplay = s;
			self.clearDigits();
			// if (!self.isOn) {
			// 	return;
			// }
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

		return {
			updateNumericDisplay,
		};

	});
