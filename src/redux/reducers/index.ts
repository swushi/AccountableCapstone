import { combineReducers } from "redux";

// reducers
import UserReducer from "./UserReducer";
import NotifyReducer from "./NotifyReducer";
import AccountableReducer from "./AccountableReducer";

export default combineReducers({
  user: UserReducer,
  notify: NotifyReducer,
  accountable: AccountableReducer,
});
