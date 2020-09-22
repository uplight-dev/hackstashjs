import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { Provider } from 'react-redux';

import Home from './routes/home';

import store from './redux/store';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.setState({
			currentUrl: e.url
		});
	};

	render() {
		return (
			<Provider store={store}>
				<div id="app">
					<Router onChange={this.handleRoute}>
						<Home path="/" />
					</Router>
				</div>
			</Provider>
		);
	}
}
