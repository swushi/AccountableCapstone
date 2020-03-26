export default (state = true, action) => {
  switch (action.type) {
    case "canNotify":
      return action.payload;
    default:
      return state;
  }
};
