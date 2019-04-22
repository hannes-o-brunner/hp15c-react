
import { Complex } from "../app/Complex";

import { Calculator } from "./CalculatorModel";

export type Action = (c: Calculator) => void;

export class Operation {

	action: Action;
	keys: Array<number>;

	constructor(keys: Array<number>, action: Action) {
		this.keys = keys;
		this.action = action;
	}

	exec(c: Calculator): void {
		//		c.isNewEntry = false;
		//		OldStackLift = StackLift;
		//		NewStackLift = true;
		try {
			this.action(c);
		} finally {
			//			c.isEntry = c.isNewEntry;
			// StackLift = NewStackLift;
			c.entry.afterAction(c);
		}
	}

}

export type NullaryOperation = () => void;
export type UnaryOperation = (x: Complex) => Complex;
export type BinaryOperation = (x: Complex, y: Complex) => Complex;

export class NullOp extends Operation {
	constructor(keys: Array<number>, op: NullaryOperation) {
		super(keys, function (c: Calculator): void { op; });
	}
}

export class UnaryOp extends Operation {
	constructor(keys: Array<number>, op: UnaryOperation) {
		super(keys, function (c: Calculator): void { c.unOp(op); });
	}
}

export class BinaryOp extends Operation {
	constructor(keys: Array<number>, op: BinaryOperation) {
		super(keys, function (c: Calculator): void { c.binOp(op); } );
	}
}
