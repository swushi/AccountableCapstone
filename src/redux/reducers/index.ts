import { combineReducers } from "redux";

// reducers
import UserReducer from "./UserReducer";

export default combineReducers({
  user: UserReducer
});
