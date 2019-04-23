
import { Complex, ZERO, E, TEN } from "../app/Complex";

import { Calculator } from "./CalculatorModel";
import { EntryState } from "./EntryModel";
import * as Op from "./Operation";

export const OpSqrt = new Op.UnaryOp([11], (x) => { return x.sqrt(); });
// export const OpA         = new Op.Operation([42,11],   op_A);
export const OpX2 = new Op.UnaryOp([43, 11], (x) => { return new Complex(x.re * x.re); });

export const OpEx = new Op.UnaryOp([12], (x) => { return E.pow(x); });
// export const OpB         = new Op.Operation([42,12],   op_B);
export const OpLn = new Op.UnaryOp([43, 12], (x) => { return x.ln(); });

export const Op10x = new Op.UnaryOp([13], (x) => { return TEN.pow(x); });
// export const OpC         = new Op.Operation([42,13],   op_C);
export const OpLog = new Op.UnaryOp([43, 13], (x) => { return x.log(); });

export const OpYx = new Op.BinaryOp([14], (x, y) => { return y.pow(x); });
// export const OpD         = new Op.Operation([42,14],   op_D);
// export const OpPct       = new Op.Operation([43,14],   op_pct);

export const Op1x = new Op.UnaryOp([15], (x) => { return x.inv(); });
// export const OpE         = new Op.Operation([42,15],   op_E);
// export const OpDpct      = new Op.Operation([43,15],   op_dpct);

export const OpChs = new Op.UnaryOp([16], (x) => { return x.chs(); });
//export const OpMatrix
export const OpAbs = new Op.UnaryOp([43, 16], (x) => { return x.abs(); });

export const Op7 = new Op.Operation([7], function (c: Calculator) { op_input(c, '7'); });
//export const OpFix
// export const OpDeg       = new Op.Operation([43,7],    op_deg);

export const Op8 = new Op.Operation([8], function (c: Calculator) { op_input(c, '8'); });
//export const OpSci
// export const OpRad       = new Op.Operation([43,8],    op_rad);

export const Op9 = new Op.Operation([9], function (c: Calculator) { op_input(c, '9'); });
//export const OpEng
// export const OpGrd       = new Op.Operation([43,9],    op_grd);

export const OpDiv = new Op.BinaryOp([10], (x, y) => { return y.div(x); });
//export const OpSolve
// export const OpLe        = new Op.Operation([43,10],   op_le);

// export const OpSst       = new Op.Operation([21],      op_sst, false);
//export const OpLbl
// export const OpBst       = new Op.Operation([43,21],   op_bst, false);

//export const OpGto
//export const OpHyp
//export const OpAhyp

export const OpSin = new Op.UnaryOp([23], (x) => { return x.sin(); });
//export const OpDim
// export const OpAsin      = new Op.Operation([43,23],   op_asin);

export const OpCos = new Op.UnaryOp([24], (x) => { return x.cos(); });
// export const OpIndex     = new Op.Operation([42,24],   op_index, false);
// export const OpAcos      = new Op.Operation([43,24],   op_acos);

export const OpTan = new Op.UnaryOp([25], (x) => { return x.tan(); });
// export const OpI         = new Op.Operation([42,25],   op_I);
// export const OpAtan      = new Op.Operation([43,25],   op_atan);

export const OpEex = new Op.Operation([26], function (c: Calculator) { op_input(c, 'e'); });
//export const OpResult
// export const OpPi        = new Op.Operation([43,26],   op_pi);

export const Op4 = new Op.Operation([4], function (c: Calculator) { op_input(c, '4'); });
//export const OpXchg
//export const OpSf

export const Op5 = new Op.Operation([5], function (c: Calculator) { op_input(c, '5'); });
//export const OpDse       = new Op.Operation([42,5],    op_dse);
//export const OpCf

export const Op6 = new Op.Operation([6], function (c: Calculator) { op_input(c, '6'); });
//export const OpIsg       = new Op.Operation([42,6],    op_isg);
//export const OpFtest

export const OpMul = new Op.BinaryOp([20], (x, y) => { return y.mul(x); });
//export const OpIntegrate
// export const OpEq        = new Op.Operation([43,20],   op_eq);

// export const OpRs        = new Op.Operation([31],      op_rs);
// export const OpPse       = new Op.Operation([42,31],   op_pse);
// export const OpPr        = new Op.Operation([43,31],   op_pr, false);

//export const OpGsb
// export const OpClearStat = new Op.Operation([42,32],   op_clear_stat);
// export const OpRtn       = new Op.Operation([43,32],   op_rtn);

// export const OpRoll      = new Op.Operation([33],      op_roll);
// export const OpClearPrgm = new Op.Operation([42,33],   op_clear_prgm, false);
// export const OpRollup    = new Op.Operation([43,33],   op_rollup);

// export const OpXy        = new Op.Operation([34],      op_xy);
// export const OpClearReg  = new Op.Operation([42,34],   op_clear_reg);
// export const OpRnd       = new Op.Operation([43,34],   op_rnd);

// export const OpBack      = new Op.Operation([35],      op_back, false);
// export const OpClearPrefix=new Op.Operation([42,35],   op_clear_prefix, false);
export const OpClx = new Op.Operation([43, 35], op_clx);

export const OpEnter = new Op.Operation([36], op_enter);
// export const OpRand      = new Op.Operation([42,36],   op_rand);
// export const OpLastx     = new Op.Operation([43,36],   op_lastx);

export const Op1 = new Op.Operation([1], function (c: Calculator) { op_input(c, '1'); });
// export const OpToR       = new Op.Operation([42,1],    op_to_r);
// export const OpToP       = new Op.Operation([43,1],    op_to_p);

export const Op2 = new Op.Operation([2], function (c: Calculator) { op_input(c, '2'); });
// export const OpToHms     = new Op.Operation([42,2],    op_to_hms);
// export const OpToH       = new Op.Operation([43,2],    op_to_h);

export const Op3 = new Op.Operation([3], function (c: Calculator) { op_input(c, '3'); });
// export const OpToRad     = new Op.Operation([42,3],    op_to_rad);
// export const OpToDeg     = new Op.Operation([43,3],    op_to_deg);

export const OpSub = new Op.BinaryOp([30], (x, y) => { return y.sub(x); });
// export const OpReIm      = new Op.Operation([42,30],   op_re_im);
//export const OpTest

// export const OpOn        = new Op.Operation([41],      op_on, false);

//export const OpSto
// export const OpFrac      = new Op.Operation([42,44],   op_frac);
// export const OpInt       = new Op.Operation([43,44],   op_int);

//export const OpRcl
// export const OpUser      = new Op.Operation([42,46],   op_user, false);
// export const OpMem       = new Op.Operation([43,46],   op_mem, false);

export const Op0 = new Op.Operation([0], function (c: Calculator) { op_input(c, '0'); });
// export const OpFact      = new Op.Operation([42,0],    op_fact);
// export const OpMean      = new Op.Operation([43,0],    op_mean);

export const OpDot = new Op.Operation([48], function (c: Calculator) { op_input(c, '.'); });
// export const OpYhat      = new Op.Operation([42,48],   op_yhat);
// export const OpS         = new Op.Operation([43,48],   op_s);

// export const OpSum       = new Op.Operation([49],      op_sum);
// export const OpLr        = new Op.Operation([42,49],   op_lr);
// export const OpSumsub    = new Op.Operation([43,49],   op_sumsub);

export const OpAdd = new Op.BinaryOp([40], (x, y) => { return y.add(x); });
// export const OpPyx       = new Op.Operation([42,40],   op_Pyx);
// export const OpCyx       = new Op.Operation([43,40],   op_Cyx);

function op_input(c: Calculator, ch: string): void {
	console.log("input(" + ch + ")");
	const entry = c.entry;
	if (!entry.isInEntry) {
		if (entry.entryState === EntryState.NONE) {
			c.push(ZERO); // c.push("");
		}
		entry.entry = "";
	}
	if (!entry.entry || entry.entry.length === 0) {
		switch (ch) {
			case 'e':
				entry.entry = "1";
				break;
			case '.':
				entry.entry = "0";
				break;
		}
	}
	entry.entry = entry.entry + ch;
	entry.entryState = EntryState.ENTRY;
}

function op_enter(c: Calculator): void {
	//	c.push(Stack[0], true);
	c.push(c.x);
	// push() only pushes the real part,
	// so copy the imaginary part too
	// StackI[0] = StackI[1];
	// NewStackLift = false;
	c.entry.entryState = EntryState.START;
}

function op_clx(c: Calculator): void {
	c.x = ZERO;
	//	NewStackLift = false;
	c.entry.entryState = EntryState.START;
}
