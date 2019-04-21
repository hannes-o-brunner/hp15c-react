
import * as React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { Calculator } from "../model/CalculatorModel";

export interface SignProps extends React.Props<SignView> {
	calculator: Calculator;
}

@observer
class SignView extends React.Component<SignProps, {}> {

	render(): JSX.Element | null {
		if (!this.props.calculator.isOn) {
			return null;
		}
		const isNegative = this.props.calculator.isNegative;
		return (
			<div className="lcd" style={{ top: 80, left: 158 }}>
				{isNegative && <img className="lcd" src="../assets/images/neg.png" />}
			</div>
		);
	}

}

export interface DigitProps extends React.Props<DigitView> {
	calculator: Calculator;
	index: number;
}

@observer
class DigitView extends React.Component<DigitProps, {}> {

	render(): JSX.Element | null {
		if (!this.props.calculator.isOn) {
			return null;
		}
		const digit = this.props.calculator.digits[this.props.index].value;
		const decimal = this.props.calculator.digits[this.props.index].decimal;
		return (
			<div className="lcd" style={{ top: 67, left: 175 + this.props.index * 27 }}>
				{digit && <img className="lcd" src={"../assets/images/" + digit + ".png"} style={{ top: 0, left: 0 }} />}
				{decimal && <img className="lcd" src={"../assets/images/" + decimal + ".png"} style={{ top: 24, left: 19 }} />}
			</div>
		);
	}

}

export interface CalculatorProps extends React.Props<CalculatorView> {
	calculator: Calculator;
}

function onMouseDown(calculator: Calculator, e: React.MouseEvent<HTMLImageElement>): void {
	var x = e.pageX;
	var y = e.pageY;
	if (x >= 65 && x < 645 && y >= 155 && y < 405) {
		var col = Math.floor((x - 65) / 57);
		var row = Math.floor((y - 155) / 65);
		if (col >= 0 && col < 10 && row >= 0 && row < 4) {
			if (col == 5 && row >= 2) {
				row = 2;
			}
			calculator.mouseDown(row, col);
		}
	}
	e.preventDefault();
}

function onMouseUp(calculator: Calculator, e: React.MouseEvent<HTMLDivElement>): void {
	calculator.mouseUp();
}

function runTests(calculator: Calculator): void {
}

@observer
class CalculatorView extends React.Component<CalculatorProps & RouteComponentProps<any>, {}> {

	render(): JSX.Element | null {
		const history = this.props.history;
		console.log(`CalculatorView.render: ${history.location.pathname}`); // tslint:disable-line:no-console
		var h = 34;
		if (this.props.calculator.keyCol == 5 && this.props.calculator.keyRow! >= 2) {
			h = 99;
		}
		var keyx = 81 + this.props.calculator.keyCol! * 57;
		var keyy = 169 + this.props.calculator.keyRow! * 65;
		return (
			<div>

				<div id="frame" onMouseUp={(e: React.MouseEvent<HTMLDivElement>): void => { onMouseUp(this.props.calculator, e); }}>

					<img id="calc" src="../assets/images/15.jpg" onMouseDown={(e: React.MouseEvent<HTMLImageElement>): void => { onMouseDown(this.props.calculator, e); }} />
					<div id="press" style={{ display: this.props.calculator.isMouseDown ? "block" : "none", left: keyx, top: keyy, height: h, width: 39 }}>
						<img id="presskey" src="../assets/images/15.jpg" style={{ left: -keyx, top: -keyy + 2 }} />
					</div>

					<SignView calculator={this.props.calculator} />

					<DigitView calculator={this.props.calculator} index={0} />
					<DigitView calculator={this.props.calculator} index={1} />
					<DigitView calculator={this.props.calculator} index={2} />
					<DigitView calculator={this.props.calculator} index={3} />
					<DigitView calculator={this.props.calculator} index={4} />
					<DigitView calculator={this.props.calculator} index={5} />
					<DigitView calculator={this.props.calculator} index={6} />
					<DigitView calculator={this.props.calculator} index={7} />
					<DigitView calculator={this.props.calculator} index={8} />
					<DigitView calculator={this.props.calculator} index={9} />

					<div id="user" className="indicator">USER</div>
					<div id="f" className="shift indicator">f</div>
					<div id="g" className="shift indicator">g</div>
					<div id="trigmode" className="indicator">GRAD</div>
					<div id="complex" className="indicator">C</div>
					<div id="program" className="indicator">PRGM</div>

				</div>

				<div id="stack">
					<table>
						<tbody>
							<tr>
								<td>Display</td>
								<td><input size={8} value={this.props.calculator.lcdDisplay} style={{ textAlign: "right" }} readOnly={true} /></td>
							</tr>
							<tr>
								<td>X</td>
								<td><input id="stack_0" size={8} value={this.props.calculator.x.r} style={{ textAlign: "right" }} readOnly={true} /></td>
								<td className="stacki">Xi</td>
								<td className="stacki"><input id="stacki_0" size={8} value={this.props.calculator.x.i} style={{ textAlign: "right" }} readOnly={true} /></td>
							</tr>
							<tr>
								<td>Y</td>
								<td><input id="stack_1" size={8} value={this.props.calculator.y.r} style={{ textAlign: "right" }} readOnly={true} /></td>
								<td className="stacki">Yi</td>
								<td className="stacki"><input id="stacki_1" size={8} value={this.props.calculator.y.i} style={{ textAlign: "right" }} readOnly={true} /></td>
							</tr>
							<tr>
								<td>Z</td>
								<td><input id="stack_2" size={8} value={this.props.calculator.z.r} style={{ textAlign: "right" }} readOnly={true} /></td>
								<td className="stacki">Zi</td>
								<td className="stacki"><input id="stacki_2" size={8} value={this.props.calculator.z.i} style={{ textAlign: "right" }} readOnly={true} /></td>
							</tr>
							<tr>
								<td>T</td>
								<td><input id="stack_3" size={8} value={this.props.calculator.t.r} style={{ textAlign: "right" }} readOnly={true} /></td>
								<td className="stacki">Ti</td>
								<td className="stacki"><input id="stacki_3" size={8} value={this.props.calculator.t.i} style={{ textAlign: "right" }} readOnly={true} /></td>
							</tr>
							<tr>
								<td>last X</td>
								<td><input id="last_x" size={8} value={this.props.calculator.lastX.r} style={{ textAlign: "right" }} readOnly={true} /></td>
								<td className="stacki">last Xi</td>
								<td className="stacki"><input id="last_xi" size={8} value={this.props.calculator.lastX.i} style={{ textAlign: "right" }} readOnly={true} /></td>
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

				<img className="preload" src="../assets/images/0.png" />
				<img className="preload" src="../assets/images/1.png" />
				<img className="preload" src="../assets/images/2.png" />
				<img className="preload" src="../assets/images/3.png" />
				<img className="preload" src="../assets/images/4.png" />
				<img className="preload" src="../assets/images/5.png" />
				<img className="preload" src="../assets/images/6.png" />
				<img className="preload" src="../assets/images/7.png" />
				<img className="preload" src="../assets/images/8.png" />
				<img className="preload" src="../assets/images/9.png" />
				<img className="preload" src="../assets/images/decimal.png" />
				<img className="preload" src="../assets/images/comma.png" />
				<img className="preload" src="../assets/images/neg.png" />

				<div id="test">
					<input type="button" onClick={(): void => { runTests(this.props.calculator); }} value="Test" />
				</div>

			</div>
		);
	}

}

export default withRouter<CalculatorProps & RouteComponentProps<any>>(CalculatorView);
