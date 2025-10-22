const getJWTFromAuthHeader = (authHeader: string) => {
  return authHeader.split(' ')[1];
}

export default getJWTFromAuthHeader;
