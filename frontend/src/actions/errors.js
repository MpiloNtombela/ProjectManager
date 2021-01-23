import { GET_ERRORS } from "./types";

const returnErrors = (errors, status) => {
  const errList = [];
  console.log(errors);
  for (const er of Object.entries(errors)) {
    const field = er[0];
    const error = er[1].join();
    const err = {
      field,
      error,
    };
    errList.push(err);
  }
  return {
    type: GET_ERRORS,
    payload: {
      errors: errList,
      status,
    },
  };
};
export default returnErrors;
