
import { transaction } from "mobx";
import { types } from "mobx-state-tree";

export type Complex = typeof ComplexModel.Type;
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

	const KeyTable = [
		['q', 'E', ')', '^', '\\','_', '7', '8', '9', '/'],
		['T', 'G', 's', 'c', 't', 'e', '4', '5', '6', '*'],
		['P', 'U', 'r', 'x', '\b','\r','1', '2', '3', '-'],
		['\x1b', 'f', 'g', 'S', 'R', '\r','0', '.', ';', '+']
	];

export const CalculatorModel = types.model("Calculator", {
	isOn: types.boolean,
	x: types.optional(ComplexModel, { r: 0, i: 0}),
	y: types.optional(ComplexModel, { r: 0, i: 0}),
	z: types.optional(ComplexModel, { r: 0, i: 0}),
	t: types.optional(ComplexModel, { r: 0, i: 0}),
	lastX: types.optional(ComplexModel, { r: 0, i: 0}),
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
			},
			mouseUp(): void {
				self.isMouseDown = false;
				self.keyRow = null;
				self.keyCol = null;
			},
		};
	});
