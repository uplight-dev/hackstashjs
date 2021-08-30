import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import Api from './api'

function* fetchApps(action) {
  try {
    const apps = yield call(Api.fetchApps);
    yield put({type: "FETCH_APPS_FULFILLED", apps: apps});
  } catch (e) {
    yield put({type: "FETCH_APPS_REJECTED", message: e.message});
  }
}

export default function* rootSaga() {
  yield takeLatest("APPS_FETCH_REQUESTED", fetchApps);
}
