import { User } from "../../types";

export const storeUser = (user: User) => {
  return {
    type: "storeUser",
    payload: user,
  };
};

export const canNotify = (notify: Boolean) => {
  return {
    type: "canNotify",
    payload: notify,
  };
};

export const storeAccountable = (user: User) => {
  return {
    type: "storeAccountable",
    payload: user,
  };
};
