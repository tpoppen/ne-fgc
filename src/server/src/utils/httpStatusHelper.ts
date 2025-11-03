
const isSuccessStatus = (status: number | undefined) => {
  return !!status && status >= 200 && status < 400;
}

const isFailureStatus = (status: number | undefined) => {
  return !!status && status >= 400 && status < 500;
}

const isErrorStatus = (status: number | undefined) => {
  return !status || status >= 500;
}

export {
  isSuccessStatus,
  isFailureStatus,
  isErrorStatus,
};
