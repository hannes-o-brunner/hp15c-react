
import { transaction } from "mobx";
import { types } from "mobx-state-tree";

import { Complex, ZERO } from "../app/Complex";

import { DisplayModel } from "./DisplayModel";
import { EntryModel, EntryState, POWER_KEY } from "./EntryModel";

export type Calculator = typeof CalculatorModel.Type;

export const CalculatorModel = types.model("Calculator", {
	isOn: types.optional(types.boolean, true),
	// stack
	x: types.optional(types.frozen<Complex>(), ZERO),
	y: types.optional(types.frozen<Complex>(), ZERO),
	z: types.optional(types.frozen<Complex>(), ZERO),
	t: types.optional(types.frozen<Complex>(), ZERO),
	lastX: types.optional(types.frozen<Complex>(), ZERO),
	// display
	display: types.optional(DisplayModel, {}),
	// entry
	entry: types.optional(EntryModel, {}),
})
	.actions(self => { // tslint:disable-line:typedef

		function init(): void {
			self.x = ZERO;
			self.y = ZERO;
			self.z = ZERO;
			self.lastX = ZERO;
			self.entry.init();
		}

		return {
			powerOn(): void {
				self.isOn = true;
				init();
			},
			powerOff(): void {
				self.isOn = false;
			},
		};

	})
	.actions(self => ({
		push(n: Complex): void {
			if (n.isNaN || n.isInfinity) {
				throw new Error();
			}
			console.log("push(" + JSON.stringify(n) + ")");
			self.t = self.z;
			self.z = self.y;
			self.y = self.x;
			self.x = n;
		},
		pop(): Complex {
			const x = self.x;
			console.log("pop()" + JSON.stringify(x));
			self.x = self.y;
			self.y = self.z;
			self.z = self.t;
			self.t = ZERO;
			return x;
		},
	}))
	.actions(self => ({
		unOp(f: (x: Complex) => Complex): void {
			self.lastX = self.x;
			const x = self.pop();
			const r = f(x);
			//console.log("unop(" + JSON.stringify(x) + "): " + JSON.stringify(r));
			self.push(r);
			self.entry.entryState = EntryState.NONE;
		},
		binOp(f: (x: Complex, y: Complex) => Complex): void {
			self.lastX = self.x;
			const x = self.pop();
			const y = self.pop();
			const r = f(x, y);
			//console.log("binop(" + JSON.stringify(x) + ", " + JSON.stringify(y) + "): " + JSON.stringify(r));
			self.push(r);
			self.entry.entryState = EntryState.NONE;
		},
	}))
	.actions(self => { // tslint:disable-line:typedef

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
				self.display.updateNumericDisplay(self.x.re);
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

		return {
			updateDisplay,
		};

	})
	.actions(self => { // tslint:disable-line:typedef

		function keyDown(keyCode: number, override: boolean = false): void {
			console.log("keyDown(" + keyCode + ")");
			self.entry.keyCode = keyCode;
			if (!self.isOn && keyCode === POWER_KEY) {
				self.powerOn();
			} else if (!self.isOn) {
				return;
			} else if (keyCode === POWER_KEY) {
				self.powerOff();
			} else {
				self.entry.keyDown(<Calculator>self, keyCode, override);
			}
			// if (DelayUpdate === 0) {
			self.updateDisplay();
			// } else {
			// 	if (DelayUpdate > 0) {
			// 		TemporaryDisplay = true;
			// 		DisplayTimeout = setTimeout(delay_update_timeout, DelayUpdate);
			// 	}
			// 	DelayUpdate = 0;
			// }
		}

		function keyUp(): void {
			self.entry.keyCode = null;
			// if (TemporaryDisplay) {
			// 	TemporaryDisplay = false;
			// 	if (DisplayTimeout === 0) {
			// 		delay_update_timeout();
			// 	}
			// }
		}

		return {
			afterCreate() {
				self.updateDisplay();
			},
			keyDown,
			keyUp,
			handleKey(keyCode: number): void {
				keyDown(keyCode);
				keyUp();
			},
		};
	});
