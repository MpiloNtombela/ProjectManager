/**
 * **basic config for unauthenticated users**
 * */
export const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

/**
 * config to include **Authorization** header with value set to token
 * @param {string} token authorization token
 * @return {{headers: {Accept: string, "Content-Type": string}}} config (headers) and Authorization if token not null
 * */
export const tokenConfig = (token) => {
  // Headers
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  // If token, add to headers config
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};