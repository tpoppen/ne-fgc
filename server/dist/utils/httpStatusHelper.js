const isSuccessStatus = (status) => {
    return !!status && status >= 200 && status < 400;
};
const isFailureStatus = (status) => {
    return !!status && status >= 400 && status < 500;
};
const isErrorStatus = (status) => {
    return !status || status >= 500;
};
export { isSuccessStatus, isFailureStatus, isErrorStatus, };
