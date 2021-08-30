export default function reducer(state={
    apps: [],
    fetching: false,
    fetched: false,
    error: null
  }, action) {

    switch (action.type) {
      case "APPS_FETCH_REQUESTED": {
        return {...state, fetching: true}
      }
      case "FETCH_APPS_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_APPS_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          apps: action.payload
        }
      }
    }

    return state
}