export default (state = {}, action) => {
  console.log(state);
  switch (action.type) {
    case "storeAccountable":
      return action.payload;
    default:
      return state;
  }
};
