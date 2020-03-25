import { User } from "../../types";

export const storeUser = (user: User) => {
  return {
    type: "storeUser",
    payload: user
  };
};
