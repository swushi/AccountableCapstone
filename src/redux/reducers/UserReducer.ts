export default (state = null, action) => {
  switch (action.type) {
    case "storeUser":
      return action.payload;
    default:
      return state;
  }
};
