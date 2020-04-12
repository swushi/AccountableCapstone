export default (state = {}, action) => {
  switch (action.type) {
    case "storeAccountable":
      return action.payload;
    default:
      return state;
  }
};
