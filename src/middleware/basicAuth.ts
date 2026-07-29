import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../model/User';

export async function basicAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const base64Credentials = authHeader?.startsWith('Basic ') ? authHeader.split(' ')[1] : undefined;

  if (!base64Credentials) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
    res.status(401).send('Потрібна авторизація');
    return;
  }

  const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const separatorIndex = decoded.indexOf(':');
  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  const user = await User.findOne({ username });
  const isValid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!isValid) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
    res.status(401).send('Невірний логін або пароль');
    return;
  }

  next();
}