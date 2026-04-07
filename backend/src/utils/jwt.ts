import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  role: string;
  username?: string;
}

export const generateToken = (payload: TokenPayload, expiresIn = '7d'): string => {
  const secret = process.env.JWT_SECRET ?? '';
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET ?? '';
  return jwt.verify(token, secret) as TokenPayload;
};
