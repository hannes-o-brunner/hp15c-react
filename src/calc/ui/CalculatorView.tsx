
import * as React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { Calculator } from "../model/CalculatorModel";
import { F_KEY, G_KEY } from "../model/EntryModel";

export interface KeyProps extends React.Props<KeyView> {
	keyCode: number | null;
}

@observer
class KeyView extends React.Component<KeyProps, {}> {

	render(): JSX.Element | null {
		const keyRow = Math.floor(this.props.keyCode! / 10);
		const keyCol = this.props.keyCode! % 10;
		const h = (keyCol == 6 && keyRow! >= 3) ? 99 : 34;
		var keyx = 81 + (keyCol - 1) * 57;
		var keyy = 169 + (keyRow - 1) * 65;
		return (
			<div id="press" style={{ display: this.props.keyCode ? "block" : "none", left: keyx, top: keyy, height: h, width: 39 }}>
				<img id="presskey" src="../assets/images/15.jpg" style={{ left: -keyx, top: -keyy + 2 }} />
			</div>
		);
	}

}

export interface SignProps extends React.Props<SignView> {
	isOn: boolean;
	isNegative: boolean;
}

@observer
class SignView extends React.Component<SignProps, {}> {

	render(): JSX.Element | null {
		if (!this.props.isOn) {
			return null;
		}
		return (
			<div className="lcd" style={{ top: 80, left: 158 }}>
				{this.props.isNegative && <img className="lcd" src="../assets/images/neg.png" />}
			</div>
		);
	}

}

export interface DigitProps extends React.Props<DigitView> {
	isOn: boolean;
	index: number;
	digit: string | null;
	decimal: string | null;
}

@observer
class DigitView extends React.Component<DigitProps, {}> {

	render(): JSX.Element | null {
		if (!this.props.isOn) {
			return null;
		}
		const digit = this.props.digit;
		const decimal = this.props.decimal;
		return (
			<div className="lcd" style={{ top: 67, left: 175 + this.props.index * 27 }}>
				{digit && <img className="lcd" src={"../assets/images/" + digit + ".png"} style={{ top: 0, left: 0 }} />}
				{decimal && <img className="lcd" src={"../assets/images/" + decimal + ".png"} style={{ top: 24, left: 19 }} />}
			</div>
		);
	}

}

export interface ShiftProps extends React.Props<ShiftView> {
	isOn: boolean;
	id: string;
}

@observer
class ShiftView extends React.Component<ShiftProps, {}> {

	render(): JSX.Element | null {
		if (!this.props.isOn) {
			return null;
		}
		return (
			<div id={this.props.id} className="shift indicator">{this.props.id}</div>
		);
	}

}

export interface CalculatorProps extends React.Props<CalculatorView> {
	calculator: Calculator;
}

function runTests(calculator: Calculator): void {
}

@observer
class CalculatorView extends React.Component<CalculatorProps & RouteComponentProps<any>, {}> {

	onMouseDown(e: React.MouseEvent<HTMLImageElement>): void {
		var x = e.pageX;
		var y = e.pageY;
		if (x >= 65 && x < 645 && y >= 155 && y < 405) {
			var col = Math.floor((x - 65) / 57) + 1;
			var row = Math.floor((y - 155) / 65) + 1;
			if (col >= 1 && col <= 10 && row >= 1 && row <= 4) {
				if (col == 6 && row >= 3) {
					row = 3;
				}
				this.props.calculator.mouseDown(10 * row + col % 10);
			}
		}
		e.preventDefault();
	}

	onMouseUp(e: React.MouseEvent<HTMLDivElement>): void {
		this.props.calculator.mouseUp();
	}

	render(): JSX.Element | null {
		const history = this.props.history;
		console.log(`CalculatorView.reender: ${history.location.pathname}`); // tslint:disable-line:no-console
		return (
			<div>

				<div id="frame" onMouseUp={(e: React.MouseEvent<HTMLDivElement>): void => { this.onMouseUp(e); }}>

					<img id="calc" src="../assets/images/15.jpg" onMouseDown={(e: React.MouseEvent<HTMLImageElement>): void => { this.onMouseDown(e); }} />

					<SignView isOn={this.props.calculator.isOn} isNegative={this.props.calculator.display.isNegative} />

					<DigitView isOn={this.props.calculator.isOn} index={0} digit={this.props.calculator.display.digits[0].value} decimal={this.props.calculator.display.digits[0].decimal} />
					<DigitView isOn={this.props.calculator.isOn} index={1} digit={this.props.calculator.display.digits[1].value} decimal={this.props.calculator.display.digits[1].decimal} />
					<DigitView isOn={this.props.calculator.isOn} index={2} digit={this.props.calculator.display.digits[2].value} decimal={this.props.calculator.display.digits[2].decimal} />
					<DigitView isOn={this.props.calculator.isOn} index={3} digit={this.props.calculator.display.digits[3].value} decimal={this.props.calculator.display.digits[3].decimal} />
					<DigitView isOn={this.props.calculator.isOn} index={4} digit={this.props.calculator.display.digits[4].value} decimal={this.props.calculator.display.digits[4].decimal} />
					<DigitView isOn={this.props.calculator.isOn} index={5} digit={this.props.calculator.display.digits[5].value} decimal={this.props.calculator.display.digits[5].decimal} />
					<DigitView isOn={this.props.calculator.isOn} index={6} digit={this.props.calculator.display.digits[6].value} decimal={this.props.calculator.display.digits[6].decimal} />
					<DigitView isOn={this.props.calculator.isOn} index={7} digit={this.props.calculator.display.digits[7].value} decimal={this.props.calculator.display.digits[7].decimal} />
					<DigitView isOn={this.props.calculator.isOn} index={8} digit={this.props.calculator.display.digits[8].value} decimal={this.props.calculator.display.digits[8].decimal} />
					<DigitView isOn={this.props.calculator.isOn} index={9} digit={this.props.calculator.display.digits[9].value} decimal={this.props.calculator.display.digits[9].decimal} />

					<ShiftView id="f" isOn={this.props.calculator.isOn && this.props.calculator.entry.shiftKey == F_KEY} />
					<ShiftView id="g" isOn={this.props.calculator.isOn && this.props.calculator.entry.shiftKey == G_KEY} />

					<div id="user" className="indicator preload">USER</div>
					<div id="trigmode" className="indicator preload">GRAD</div>
					<div id="complex" className="indicator preload">C</div>
					<div id="program" className="indicator preload">PRGM</div>

				</div>

				<div id="stack">
					<table>
						<tbody>
							<tr>
								<td>entry.shiftKey</td>
								<td><input size={8} value={this.props.calculator.entry.shiftKey} style={{ textAlign: "right" }} readOnly={true} /></td>
							</tr>
							<tr>
								<td>entry.keyCode</td>
								<td><input size={8} value={this.props.calculator.entry.keyCode!} style={{ textAlign: "right" }} readOnly={true} /></td>
							</tr>
							<tr>
								<td>entry.entryState</td>
								<td><input size={8} value={this.props.calculator.entry.entryState} style={{ textAlign: "right" }} readOnly={true} /></td>
							</tr>
							<tr>
								<td>entry.entry</td>
								<td><input size={8} value={this.props.calculator.entry.entry!} style={{ textAlign: "right" }} readOnly={true} /></td>
							</tr>
							<tr>
								<td>Display</td>
								<td><input size={8} value={this.props.calculator.display.lcdDisplay} style={{ textAlign: "right" }} readOnly={true} /></td>
							</tr>
							<tr>
								<td>X</td>
								<td><input id="stack_0" size={8} value={this.props.calculator.x.re} style={{ textAlign: "right" }} readOnly={true} /></td>
								{this.props.calculator.x.isComplex && <td className="stacki">Xi</td>}
								{this.props.calculator.x.isComplex && <td className="stacki"><input id="stacki_0" size={8} value={this.props.calculator.x.im!} style={{ textAlign: "right" }} readOnly={true} /></td>}
							</tr>
							<tr>
								<td>Y</td>
								<td><input id="stack_1" size={8} value={this.props.calculator.y.re} style={{ textAlign: "right" }} readOnly={true} /></td>
								{this.props.calculator.y.isComplex && <td className="stacki">Yi</td>}
								{this.props.calculator.y.isComplex && <td className="stacki"><input id="stacki_1" size={8} value={this.props.calculator.y.im!} style={{ textAlign: "right" }} readOnly={true} /></td>}
							</tr>
							<tr>
								<td>Z</td>
								<td><input id="stack_2" size={8} value={this.props.calculator.z.re} style={{ textAlign: "right" }} readOnly={true} /></td>
								{this.props.calculator.z.isComplex && <td className="stacki">Zi</td>}
								{this.props.calculator.z.isComplex && <td className="stacki"><input id="stacki_2" size={8} value={this.props.calculator.z.im!} style={{ textAlign: "right" }} readOnly={true} /></td>}
							</tr>
							<tr>
								<td>T</td>
								<td><input id="stack_3" size={8} value={this.props.calculator.t.re} style={{ textAlign: "right" }} readOnly={true} /></td>
								{this.props.calculator.t.isComplex && <td className="stacki">Ti</td>}
								{this.props.calculator.t.isComplex && <td className="stacki"><input id="stacki_3" size={8} value={this.props.calculator.t.im!} style={{ textAlign: "right" }} readOnly={true} /></td>}
							</tr>
							<tr>
								<td>last X</td>
								<td><input id="last_x" size={8} value={this.props.calculator.lastX.re} style={{ textAlign: "right" }} readOnly={true} /></td>
								{this.props.calculator.lastX.isComplex && <td className="stacki">last Xi</td>}
								{this.props.calculator.lastX.isComplex && <td className="stacki"><input id="last_xi" size={8} value={this.props.calculator.lastX.im!} style={{ textAlign: "right" }} readOnly={true} /></td>}
							</tr>
						</tbody>
					</table>
				</div>

				<div id="reg">
					<table>
						<tbody>
							<tr><td>0</td><td><input id="reg_0" readOnly={true} /></td></tr>
							<tr><td>1</td><td><input id="reg_1" readOnly={true} /></td></tr>
							<tr><td>2</td><td><input id="reg_2" readOnly={true} /></td></tr>
							<tr><td>3</td><td><input id="reg_3" readOnly={true} /></td></tr>
							<tr><td>4</td><td><input id="reg_4" readOnly={true} /></td></tr>
							<tr><td>5</td><td><input id="reg_5" readOnly={true} /></td></tr>
							<tr><td>6</td><td><input id="reg_6" readOnly={true} /></td></tr>
							<tr><td>7</td><td><input id="reg_7" readOnly={true} /></td></tr>
							<tr><td>8</td><td><input id="reg_8" readOnly={true} /></td></tr>
							<tr><td>9</td><td><input id="reg_9" readOnly={true} /></td></tr>
							<tr><td>I</td><td><input id="reg_I" readOnly={true} /></td></tr>
						</tbody>
					</table>
				</div>

				<div id="test">
					<input type="button" onClick={(): void => { runTests(this.props.calculator); }} value="Test" />
				</div>

			</div>
		);
	}

}

export default withRouter<CalculatorProps & RouteComponentProps<any>>(CalculatorView);
