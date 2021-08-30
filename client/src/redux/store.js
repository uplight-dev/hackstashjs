import { applyMiddleware, createStore } from "redux"

import createSagaMiddleware from 'redux-saga'
import sagas from './reducers/sagas'

// import logger from "redux-logger"
// import thunk from "redux-thunk"
// import promise from "redux-promise-middleware"

import reducer from "./reducers"

const sagaMiddleware = createSagaMiddleware()

const middleware = applyMiddleware(sagaMiddleware)
const store = createStore(reducer, middleware);

sagaMiddleware.run(sagas);

export default store;