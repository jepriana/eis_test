export const AuthConfig = {
    accessKey: process.env.ACCESS_TOKEN_KEY ?? '',
    refreshKey: process.env.REFRESH_TOKEN_KEY ?? '',
    accessAge: parseInt(process.env.ACCESS_TOKEN_AGE ?? '86400', 10),
    refreshAge: parseInt(process.env.REFRESH_TOKEN_AGE ?? '2592000', 10),
  };
  