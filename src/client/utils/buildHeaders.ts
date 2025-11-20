type ApiHeaders = {
  'Content-Type': string,
  'Authorization'?: string;
}

const buildHeaders = (authToken: string | undefined, contentType: string | undefined = 'application/json') => {
  const headers: ApiHeaders = { 'Content-Type': contentType }
  if (authToken) { headers['Authorization'] = `Bearer ${authToken}`; }

  return headers;
};

export default buildHeaders;
