import ReactDOM from 'react-dom';
import React from "react";
import store from "./store";
import {Provider} from "react-redux";
import App from './components/App';

ReactDOM.render(
    // <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>,
    // </React.StrictMode>,
    document.getElementById('app')
);