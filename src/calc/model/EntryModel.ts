
import { transaction } from "mobx";
import { types } from "mobx-state-tree";

import { Complex, ZERO } from "../app/Complex";

import { Calculator } from "./CalculatorModel";
import { Operation } from "./Operation";
import * as Ops from "./Operations";

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

export const KeyTable: { [key: number]: Array<Operation | null> } = {
	11: [Ops.OpSqrt, null, Ops.OpX2],
	12: [Ops.OpEx, null, Ops.OpLn],
	13: [Ops.Op10x, null, Ops.OpLog],
	14: [Ops.OpYx, null, null],
	15: [Ops.Op1x, null, null],
	16: [Ops.OpChs, Ops.OpAbs, null],
	17: [Ops.Op7, null, null],
	18: [Ops.Op8, null, null],
	19: [Ops.Op9, null, null],
	10: [Ops.OpDiv, null, null],
	21: [null, null, null],
	22: [null, null, null],
	23: [Ops.OpSin, null, null],
	24: [Ops.OpCos, null, null],
	25: [Ops.OpTan, null, null],
	26: [null, null, null],
	27: [Ops.Op4, null, null],
	28: [Ops.Op5, null, null],
	29: [Ops.Op6, null, null],
	20: [Ops.OpMul, null, null],
	31: [null, null, null],
	32: [null, null, null],
	33: [null, null, null],
	34: [null, null, null],
	35: [null, null, Ops.OpClx],
	36: [Ops.OpEnter, null, null],
	37: [Ops.Op1, null, null],
	38: [Ops.Op2, null, null],
	39: [Ops.Op3, null, null],
	30: [Ops.OpSub, null, null],
	41: [null, null, null],
	42: [null, null, null],
	43: [null, null, null],
	44: [null, null, null],
	45: [null, null, null],
	46: [null, null, null],
	47: [Ops.Op0, null, null],
	48: [Ops.OpDot, null, null],
	49: [null, null, null],
	40: [Ops.OpAdd, null, null],
};

export function decode(k: number, shift: number): Operation | null {
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

