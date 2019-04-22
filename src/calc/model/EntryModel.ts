
import { transaction } from "mobx";
import { types } from "mobx-state-tree";

import { Complex, ZERO } from "../app/Complex";

import { Calculator } from "./CalculatorModel";
import * as Op from "./Operations";

export const POWER_KEY = 41;
export const F_KEY = 42;
export const G_KEY = 43;

export type Entry = typeof EntryModel.Type;

export enum EntryState {
	NONE = "None", START = "Start", ENTRY = "Entry"
}

export const EntryModel = types.model("Entry", {
	shiftKey: types.optional(types.number, 0),
	keyCode: types.maybeNull(types.number),
	entryState: types.optional(types.enumeration(Object.values(EntryState)), EntryState.NONE),
	entry: types.maybeNull(types.string),
})
	.views(self => ({
		get isInEntry(): boolean {
			return self.entryState === EntryState.ENTRY;
		},
		get isMouseDown(): boolean {
			return !!self.keyCode;
		},
	}))
	.actions(self => { // tslint:disable-line:typedef

		function init(): void {
			self.shiftKey = 0;
		}

		function keyDown(c: Calculator, k: number, override: boolean = false): void {
			if (k === F_KEY || k === G_KEY) {
				self.shiftKey = k;
			} else {
				// if (DisableKeys && !override) {
				// 	return;
				// }
				const op = decode(k, self.shiftKey === 0 ? 0 : self.shiftKey === F_KEY ? 1 : 2);
				self.shiftKey = 0;
				if (op === undefined) {
					return;
				}
				// if (Running) {
				// 	clearTimeout(RunTimer);
				// 	Running = false;
				// 	return;
				// }
				if (op !== null) {
					try {
						// 		if (Prgm && op.info.programmable) {
						// 			PC++;
						// 			Program.splice(PC, 0, op);
						// 		} else {
						op.exec(c);
						// 			if (Running) {
						// 				RunTimer = setTimeout(run, 0);
						// 			}
						// 		}
					} catch (e) {
						if (e.name === "CalcError") {
							//							updateLCD("Error " + e.code);
							// 			DelayUpdate = -1;
						} else {
							throw e;
						}
					}
				}
			}
		}

		function keyUp(): void {
			// if (TemporaryDisplay) {
			// 	TemporaryDisplay = false;
			// 	if (DisplayTimeout === 0) {
			// 		delay_update_timeout();
			// 	}
			// }
		}

		function afterAction(c: Calculator): void {
			console.log("afterAction: " + JSON.stringify(c) + ", " + JSON.stringify(self));
			if (self.isInEntry) {
				if (self.entry && self.entry.length > 0 && self.entry.charAt(self.entry.length - 1) === 'e') {
					self.entry += "0";
				}
				c.x = new Complex(Number(self.entry));
			}
		}

		return {
			init,
			keyDown,
			keyUp,
			afterAction,
		};

	});

export const KeyTable: { [key: number]: Array<Op.Operation | null> } = {
	11: [Op.OpSqrt, null, Op.OpX2],
	12: [Op.OpEx, null, Op.OpLn],
	13: [Op.Op10x, null, Op.OpLog],
	14: [Op.OpYx, null, null],
	15: [Op.Op1x, null, null],
	16: [Op.OpChs, Op.OpAbs, null],
	17: [Op.Op7, null, null],
	18: [Op.Op8, null, null],
	19: [Op.Op9, null, null],
	10: [Op.OpDiv, null, null],
	21: [null, null, null],
	22: [null, null, null],
	23: [Op.OpSin, null, null],
	24: [Op.OpCos, null, null],
	25: [Op.OpTan, null, null],
	26: [null, null, null],
	27: [Op.Op4, null, null],
	28: [Op.Op5, null, null],
	29: [Op.Op6, null, null],
	20: [Op.OpMul, null, null],
	31: [null, null, null],
	32: [null, null, null],
	33: [null, null, null],
	34: [null, null, null],
	35: [null, null, Op.OpClx],
	36: [Op.OpEnter, null, null],
	37: [Op.Op1, null, null],
	38: [Op.Op2, null, null],
	39: [Op.Op3, null, null],
	30: [Op.OpSub, null, null],
	41: [null, null, null],
	42: [null, null, null],
	43: [null, null, null],
	44: [null, null, null],
	45: [null, null, null],
	46: [null, null, null],
	47: [Op.Op0, null, null],
	48: [Op.OpDot, null, null],
	49: [null, null, null],
	40: [Op.OpAdd, null, null],
};

export function decode(k: number, shift: number): Op.Operation | null {
	return KeyTable[k][shift];
	/*
		var d = null;
		var s = Shift;
		Shift = -1;
		if (Prefix != null) {
				d = Prefix;
		} else if (typeof(CharTable[k]) === "object") {
				if (User && "qE)^\\".indexOf(k) >= 0) {
						switch (s) {
								case 0: s = 1; break;
								case 1: s = 0; break;
						}
				}
				d = CharTable[k][s];
		} else {
				d = CharTable[k];
				if (d === undefined) {
						return null;
				}
		}
		OldPrefix = Prefix;
		Prefix = null;
		var r = d(k);
		if (Shift === -1) {
				Shift = 0;
				Display.clear_shift();
		}
		return r;
	*/
}

