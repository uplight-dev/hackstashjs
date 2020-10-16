import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import Api from './api'

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchApps(action) {
  try {
    const apps = yield call(Api.fetchApps);
    yield put({type: "APPS_FETCH_SUCCEEDED", apps: apps});
  } catch (e) {
    yield put({type: "APPS_FETCH_FAILED", message: e.message});
  }
}

function* sagas() {
  yield takeLatest("APPS_FETCH_REQUESTED", fetchApps);
}

export default sagas;