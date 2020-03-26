import { combineReducers } from "redux";

// reducers
import UserReducer from "./UserReducer";
import NotifyReducer from "./NotifyReducer";

export default combineReducers({
  user: UserReducer,
  notify: NotifyReducer
});
