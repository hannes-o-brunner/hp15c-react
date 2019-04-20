
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import { Provider } from "mobx-react";
// import { unregisterServiceWorker } from "common/utils/ServiceWorker";

// import { Language } from "common/i18n/Language";
// import { Session, SessionModel } from "session/app/SessionModel";
// import { NavigatorImpl } from "frame/app/impl/NavigationImpl";

import { CalculatorModel } from "./calc/model/CalculatorModel";

// import AppFrame from "AppFrame";

import Calculator from "./calc/ui/CalculatorView";

const browserHistory = createBrowserHistory();
const router = new RouterStore();
const history = syncHistoryWithStore(browserHistory, router);
const calculator = CalculatorModel.create({
	isOn: true,
});

// const session: Session = SessionModel.create({
// 	locale: Language.en
// });

// const navigator = new NavigatorImpl(session, history);

const store = {
	router,
	history
// 	session,
// 	navigator,
// 	appStore
};

ReactDOM.render(
	<Provider {...store}>
		<Router history={history}>
			<Calculator calculator={calculator}/>
		</Router>
	</Provider>,
	document.getElementById("root") as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// unregisterServiceWorker();

import "./calc/ui/calc.css";
