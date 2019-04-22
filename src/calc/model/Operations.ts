
import { Complex, ZERO, E, TEN } from "../app/Complex";

import { Calculator } from "./CalculatorModel";
import { EntryState } from "./EntryModel";

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

export const OpSqrt = new UnaryOp([11], (x) => { return x.sqrt(); });
// export const OpA         = new Operation([42,11],   op_A);
export const OpX2 = new UnaryOp([43, 11], (x) => { return new Complex(x.re * x.re); });

export const OpEx = new UnaryOp([12], (x) => { return E.pow(x); });
// export const OpB         = new Operation([42,12],   op_B);
export const OpLn = new UnaryOp([43, 12], (x) => { return x.ln(); });

export const Op10x = new UnaryOp([13], (x) => { return TEN.pow(x); });
// export const OpC         = new Operation([42,13],   op_C);
export const OpLog = new UnaryOp([43, 13], (x) => { return x.log(); });

export const OpYx = new BinaryOp([14], (x, y) => { return y.pow(x); });
// export const OpD         = new Operation([42,14],   op_D);
// export const OpPct       = new Operation([43,14],   op_pct);

export const Op1x = new UnaryOp([15], (x) => { return x.inv(); });
// export const OpE         = new Operation([42,15],   op_E);
// export const OpDpct      = new Operation([43,15],   op_dpct);

export const OpChs = new UnaryOp([16], (x) => { return x.chs(); });
//export const OpMatrix
export const OpAbs = new UnaryOp([43, 16], (x) => { return x.abs(); });

export const Op7 = new Operation([7], function (c: Calculator) { op_input(c, '7'); });
//export const OpFix
// export const OpDeg       = new Operation([43,7],    op_deg);

export const Op8 = new Operation([8], function (c: Calculator) { op_input(c, '8'); });
//export const OpSci
// export const OpRad       = new Operation([43,8],    op_rad);

export const Op9 = new Operation([9], function (c: Calculator) { op_input(c, '9'); });
//export const OpEng
// export const OpGrd       = new Operation([43,9],    op_grd);

export const OpDiv = new BinaryOp([10], (x, y) => { return y.div(x); });
//export const OpSolve
// export const OpLe        = new Operation([43,10],   op_le);

// export const OpSst       = new Operation([21],      op_sst, false);
//export const OpLbl
// export const OpBst       = new Operation([43,21],   op_bst, false);

//export const OpGto
//export const OpHyp
//export const OpAhyp

export const OpSin = new UnaryOp([23], (x) => { return x.sin(); });
//export const OpDim
// export const OpAsin      = new Operation([43,23],   op_asin);

export const OpCos = new UnaryOp([24], (x) => { return x.cos(); });
// export const OpIndex     = new Operation([42,24],   op_index, false);
// export const OpAcos      = new Operation([43,24],   op_acos);

export const OpTan = new UnaryOp([25], (x) => { return x.tan(); });
// export const OpI         = new Operation([42,25],   op_I);
// export const OpAtan      = new Operation([43,25],   op_atan);

export const OpEex = new Operation([26], function (c: Calculator) { op_input(c, 'e'); });
//export const OpResult
// export const OpPi        = new Operation([43,26],   op_pi);

export const Op4 = new Operation([4], function (c: Calculator) { op_input(c, '4'); });
//export const OpXchg
//export const OpSf

export const Op5 = new Operation([5], function (c: Calculator) { op_input(c, '5'); });
//export const OpDse       = new Operation([42,5],    op_dse);
//export const OpCf

export const Op6 = new Operation([6], function (c: Calculator) { op_input(c, '6'); });
//export const OpIsg       = new Operation([42,6],    op_isg);
//export const OpFtest

export const OpMul = new BinaryOp([20], (x, y) => { return y.mul(x); });
//export const OpIntegrate
// export const OpEq        = new Operation([43,20],   op_eq);

// export const OpRs        = new Operation([31],      op_rs);
// export const OpPse       = new Operation([42,31],   op_pse);
// export const OpPr        = new Operation([43,31],   op_pr, false);

//export const OpGsb
// export const OpClearStat = new Operation([42,32],   op_clear_stat);
// export const OpRtn       = new Operation([43,32],   op_rtn);

// export const OpRoll      = new Operation([33],      op_roll);
// export const OpClearPrgm = new Operation([42,33],   op_clear_prgm, false);
// export const OpRollup    = new Operation([43,33],   op_rollup);

// export const OpXy        = new Operation([34],      op_xy);
// export const OpClearReg  = new Operation([42,34],   op_clear_reg);
// export const OpRnd       = new Operation([43,34],   op_rnd);

// export const OpBack      = new Operation([35],      op_back, false);
// export const OpClearPrefix=new Operation([42,35],   op_clear_prefix, false);
export const OpClx = new Operation([43, 35], op_clx);

export const OpEnter = new Operation([36], op_enter);
// export const OpRand      = new Operation([42,36],   op_rand);
// export const OpLastx     = new Operation([43,36],   op_lastx);

export const Op1 = new Operation([1], function (c: Calculator) { op_input(c, '1'); });
// export const OpToR       = new Operation([42,1],    op_to_r);
// export const OpToP       = new Operation([43,1],    op_to_p);

export const Op2 = new Operation([2], function (c: Calculator) { op_input(c, '2'); });
// export const OpToHms     = new Operation([42,2],    op_to_hms);
// export const OpToH       = new Operation([43,2],    op_to_h);

export const Op3 = new Operation([3], function (c: Calculator) { op_input(c, '3'); });
// export const OpToRad     = new Operation([42,3],    op_to_rad);
// export const OpToDeg     = new Operation([43,3],    op_to_deg);

export const OpSub = new BinaryOp([30], (x, y) => { return y.sub(x); });
// export const OpReIm      = new Operation([42,30],   op_re_im);
//export const OpTest

// export const OpOn        = new Operation([41],      op_on, false);

//export const OpSto
// export const OpFrac      = new Operation([42,44],   op_frac);
// export const OpInt       = new Operation([43,44],   op_int);

//export const OpRcl
// export const OpUser      = new Operation([42,46],   op_user, false);
// export const OpMem       = new Operation([43,46],   op_mem, false);

export const Op0 = new Operation([0], function (c: Calculator) { op_input(c, '0'); });
// export const OpFact      = new Operation([42,0],    op_fact);
// export const OpMean      = new Operation([43,0],    op_mean);

export const OpDot = new Operation([48], function (c: Calculator) { op_input(c, '.'); });
// export const OpYhat      = new Operation([42,48],   op_yhat);
// export const OpS         = new Operation([43,48],   op_s);

// export const OpSum       = new Operation([49],      op_sum);
// export const OpLr        = new Operation([42,49],   op_lr);
// export const OpSumsub    = new Operation([43,49],   op_sumsub);

export const OpAdd = new BinaryOp([40], (x, y) => { return y.add(x); });
// export const OpPyx       = new Operation([42,40],   op_Pyx);
// export const OpCyx       = new Operation([43,40],   op_Cyx);

function op_input(c: Calculator, ch: string): void {
	if (!c.entry.isInEntry) {
		if (c.entry.entryState === EntryState.NONE) {
			c.push(ZERO); // c.push("");
		}
		c.entry.entry = "";
	}
	if (!c.entry.entry || c.entry.entry.length === 0) {
		switch (ch) {
			case 'e':
				c.entry.entry = "1";
				break;
			case '.':
				c.entry.entry = "0";
				break;
		}
	}
	c.entry.entry = c.entry.entry + ch;
	c.entry.entryState = EntryState.ENTRY;
}

function op_enter(c: Calculator): void {
	//	c.push(Stack[0], true);
	c.push(c.x);
	c.entry.entryState = EntryState.START;
	// push() only pushes the real part,
	// so copy the imaginary part too
	// StackI[0] = StackI[1];
	// NewStackLift = false;
}

function op_clx(c: Calculator): void {
	c.x = ZERO;
	c.entry.entryState = EntryState.START;
	//	NewStackLift = false;
}
