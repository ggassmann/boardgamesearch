import { log } from 'src/lib/log';
import {ScrapeProgress} from 'src/services/entities/ScrapeProgress';
import {Connection, createConnection} from 'typeorm';

let connection: Connection;

export const con = async (): Promise<Connection> => {
  return await new Promise<Connection>((resolve) => {
    const conInterval = setInterval(() => {
      if (connection !== undefined) {
        resolve(connection);
        clearInterval(conInterval);
      }
    }, 1);
  });
};

createConnection({
    type: 'mysql',
    host: CFG.DEV_DATABASE.host,
    port: CFG.DEV_DATABASE.port,
    username: CFG.DEV_DATABASE.username,
    password: CFG.DEV_DATABASE.password,
    database: 'boardgamesearch',
    entities: [
      ScrapeProgress,
    ],
    synchronize: true,
    logging: false,
}).then((c) => {
  connection = c;
}).catch((error) => log(error));
