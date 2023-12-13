export interface JwtDecodeResponse {
  id: number,
  email: string,
  roles: string[],
  iat: number,
  exp: number,
}
