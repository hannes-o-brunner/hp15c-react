
import * as React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { Calculator } from "../model/CalculatorModel";

// import { Session, SessionState } from "session/app/SessionModel";

// import { Auth0Error } from "auth0-js";
// import { AuthCallback } from "session/ui/AuthCallback";
// import App from "App";

/**
 * valid state / path combinations
 * close       {any} => will redirect to Authentication
 * pendingAuth /callback
 * pendingOpen /callback
 * open        {any}
 * other       => close & back to home
 */

export interface CalculatorProps extends React.Props<CalculatorView> {
	calculator: Calculator;
	// injected
// 	session?: Session;
}

function run_test(): void {

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

// @inject("session")
@observer
class CalculatorView extends React.Component<CalculatorProps & RouteComponentProps<any>, {}> {

	render(): JSX.Element | null {
		const history = this.props.history;
		console.log(`AppFrame.render: ${history.location.pathname}`); // tslint:disable-line:no-console
		var h = 34;
		if (this.props.calculator.keyCol == 5 && this.props.calculator.keyRow! >= 2) {
			h = 99;
		}
		var keyx = 81 + this.props.calculator.keyCol! * 57;
		var keyy = 169 + this.props.calculator.keyRow! * 65;
			return (
			<div>

				<div id="frame" onMouseUp={(e: React.MouseEvent<HTMLDivElement>): void => { onMouseUp(this.props.calculator, e); }}>
					<img id="calc" src="../assets/images/15.jpg" onMouseDown={(e: React.MouseEvent<HTMLImageElement>): void => { onMouseDown(this.props.calculator, e); }}/>
					<div id="press" style={{ display: this.props.calculator.isMouseDown ? "block" : "none", left: keyx, top: keyy, height: h, width: 39 }}>
						<img id="presskey" src="../assets/images/15.jpg" style={{ left: -keyx, top: -keyy + 2 }}/>
					</div>
					<img id="dig0" className="lcd"/>
					<img id="dig1" className="lcd"/>
					<img id="dig2" className="lcd"/>
					<img id="dig3" className="lcd"/>
					<img id="dig4" className="lcd"/>
					<img id="dig5" className="lcd"/>
					<img id="dig6" className="lcd"/>
					<img id="dig7" className="lcd"/>
					<img id="dig8" className="lcd"/>
					<img id="dig9" className="lcd"/>
					<img id="decimal0" className="lcd"/>
					<img id="decimal1" className="lcd"/>
					<img id="decimal2" className="lcd"/>
					<img id="decimal3" className="lcd"/>
					<img id="decimal4" className="lcd"/>
					<img id="decimal5" className="lcd"/>
					<img id="decimal6" className="lcd"/>
					<img id="decimal7" className="lcd"/>
					<img id="decimal8" className="lcd"/>
					<img id="decimal9" className="lcd"/>
					<img id="neg" className="lcd" src="../assets/images/neg.png"/>
					<div id="user" className="indicator">USER</div>
					<div id="f" className="shift indicator">f</div>
					<div id="g" className="shift indicator">g</div>
					<div id="trigmode" className="indicator"/>
					<div id="complex" className="indicator">C</div>
					<div id="program" className="indicator">PRGM</div>
				</div>

				<div id="stack">
					<table>
						<tr>
							<td>X</td>
							<td><input id="stack_0" size={8} value={this.props.calculator.x.r} style={{ textAlign: "right" }}/></td>
							<td className="stacki">Xi</td>
							<td className="stacki"><input id="stacki_0" size={8} value={this.props.calculator.x.i} style={{ textAlign: "right" }}/></td>
						</tr>
						<tr>
							<td>Y</td>
							<td><input id="stack_1" size={8} value={this.props.calculator.y.r} style={{ textAlign: "right" }}/></td>
							<td className="stacki">Yi</td>
							<td className="stacki"><input id="stacki_1" size={8} value={this.props.calculator.y.i} style={{ textAlign: "right" }}/></td>
						</tr>
						<tr>
							<td>Z</td>
							<td><input id="stack_2" size={8} value={this.props.calculator.z.r} style={{ textAlign: "right" }}/></td>
							<td className="stacki">Zi</td>
							<td className="stacki"><input id="stacki_2" size={8} value={this.props.calculator.z.i} style={{ textAlign: "right" }}/></td>
						</tr>
						<tr>
							<td>T</td>
							<td><input id="stack_3" size={8} value={this.props.calculator.t.r} style={{ textAlign: "right" }}/></td>
							<td className="stacki">Ti</td>
							<td className="stacki"><input id="stacki_3" size={8} value={this.props.calculator.t.i} style={{ textAlign: "right" }}/></td>
						</tr>
						<tr>
							<td>last X</td>
							<td><input id="last_x" size={8} value={this.props.calculator.lastX.r} style={{ textAlign: "right" }}/></td>
							<td className="stacki">last Xi</td>
							<td className="stacki"><input id="last_xi" size={8} value={this.props.calculator.lastX.i} style={{ textAlign: "right" }}/></td>
						</tr>
					</table>
				</div>

				<div id="reg">
					<table>
						<tr><td>0</td><td><input id="reg_0"/></td></tr>
						<tr><td>1</td><td><input id="reg_1"/></td></tr>
						<tr><td>2</td><td><input id="reg_2"/></td></tr>
						<tr><td>3</td><td><input id="reg_3"/></td></tr>
						<tr><td>4</td><td><input id="reg_4"/></td></tr>
						<tr><td>5</td><td><input id="reg_5"/></td></tr>
						<tr><td>6</td><td><input id="reg_6"/></td></tr>
						<tr><td>7</td><td><input id="reg_7"/></td></tr>
						<tr><td>8</td><td><input id="reg_8"/></td></tr>
						<tr><td>9</td><td><input id="reg_9"/></td></tr>
						<tr><td>I</td><td><input id="reg_I"/></td></tr>
					</table>
				</div>

				<img className="preload" src="../assets/images/0.png"/>
				<img className="preload" src="../assets/images/1.png"/>
				<img className="preload" src="../assets/images/2.png"/>
				<img className="preload" src="../assets/images/3.png"/>
				<img className="preload" src="../assets/images/4.png"/>
				<img className="preload" src="../assets/images/5.png"/>
				<img className="preload" src="../assets/images/6.png"/>
				<img className="preload" src="../assets/images/7.png"/>
				<img className="preload" src="../assets/images/8.png"/>
				<img className="preload" src="../assets/images/9.png"/>
				<img className="preload" src="../assets/images/decimal.png"/>
				<img className="preload" src="../assets/images/comma.png"/>
				<img className="preload" src="../assets/images/neg.png"/>

				<div id="test">
					<input type="button" onClick={(): void => { run_test(); }} value="Test"/>
				</div>

			</div>
		);
	}

}

export default withRouter<CalculatorProps & RouteComponentProps<any>>(CalculatorView);
