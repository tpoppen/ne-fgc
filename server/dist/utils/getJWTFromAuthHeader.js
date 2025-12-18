const getJWTFromAuthHeader = (authHeader) => {
    if (!authHeader) {
        return undefined;
    }
    const [prefix, token] = authHeader.split(' ');
    if (prefix === 'Bearer') {
        return token;
    }
    return undefined;
};
export default getJWTFromAuthHeader;
