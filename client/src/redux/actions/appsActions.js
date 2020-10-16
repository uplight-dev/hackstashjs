import axios from "axios";

export function fetchApps() {
  //the return of function is handled by react-thunk middleware
  return function(dispatch) {
    dispatch({type: "FETCH_APPS"});
    
    axios.get("/api/repos")
      .then((response) => {
        dispatch({type: "FETCH_APPS_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "FETCH_APPS_REJECTED", payload: err})
      })
  }
}