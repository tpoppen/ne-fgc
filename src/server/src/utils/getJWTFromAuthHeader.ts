const getJWTFromAuthHeader = (authHeader: string) => {
  const [prefix, token] = authHeader.split(' ');
  if (prefix === 'Bearer') {
    return token;
  } else {
    return undefined
  }
}

export default getJWTFromAuthHeader;
