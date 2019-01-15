import * as bcrypt from 'bcryptjs';
import { promisify } from 'typed-promisify';

export const genSalt = async (rounds?: number): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.genSalt(rounds || 10, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        resolve(salt);
      }
    });
  });
};
export const hash = promisify(bcrypt.hash);
export const compare = promisify(bcrypt.compare);
export const getRounds = bcrypt.getRounds;
