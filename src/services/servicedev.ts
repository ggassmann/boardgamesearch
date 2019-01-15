import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import yargs from 'yargs';
import { log } from '../lib/log';
const readDir = util.promisify(fs.readdir);

const targetService = yargs(process.argv).argv._[2] || null;

interface INamedServiceBundle extends ChildProcess {
  name?: string;
}

(async () => {
  const filenameToServiceName = (fname: string) => {
    return fname.replace(/\.bundle\.js/, '');
  };
  const buildService = (serviceBundle: string) => {
    const service: INamedServiceBundle = spawn('node', [path.resolve(__dirname, serviceBundle)]);
    service.name = filenameToServiceName(serviceBundle);
    log(`Spawned Process: ${service.name}`);

    service.stdout.on('data', (data) => {
      process.stdout.write(`${data.toString()}`);
    });

    service.stderr.on('data', (data) => {
      process.stdout.write(`ERR: ${data}`);
    });

    service.on('close', (code, signal) => {
      if (signal === 'SIGINT') {
        return;
      }
      log(`${service.name} exited${code === null ? '.' : ` with code ${code}`}`);
    });

    return service;
  };
  let serviceBundles = (await readDir(__dirname)).filter((x) => x !== 'servicedev.bundle.js');
  if (targetService !== null) {
    serviceBundles = serviceBundles
      .filter((serviceBundle) => filenameToServiceName(serviceBundle) === targetService);
  }
  log(serviceBundles);

  let services = serviceBundles.map((serviceBundle) => {
    let isBuildingNew = false;
    fs.watch(path.resolve(__dirname, serviceBundle), {}, async (event, filename) => {
      const serviceName = filenameToServiceName(filename);
      if (event === 'change') {
        if (isBuildingNew) {
          return;
        }
        isBuildingNew = true;
        log(`Killing old ${serviceName}`);
        const oldService = services.filter((service) => service.name === serviceName)[0];
        await new Promise((resolve, reject) => {
          oldService.kill('SIGINT');
          oldService.on('close', resolve);
          setTimeout(resolve, 1000);
        });
        const newService = buildService(filename);
        services = [
          ...services.filter((service) => service.name !== serviceName),
          newService,
        ];
        setTimeout(() => { isBuildingNew = false; }, 5);
      }
    });
    return buildService(serviceBundle);
  });

  interface IExitOptions {
    cleanup?: boolean;
    exit?: boolean;
  }

  let didStartExiting = false;

  function exitHandler(options: IExitOptions, exitCode: number) {
    if (didStartExiting) {
      return;
    }
    didStartExiting = true;
    log('Exiting');
    if (options.cleanup) {
      services.forEach((service) => {
        log(`Killing ${service.name}`);
        service.kill('SIGINT');
      });
    }
    if (options.exit) {
      process.exit();
    } else {
      didStartExiting = false;
    }
  }
  process.on('exit', exitHandler.bind(null, { cleanup: true }));
  process.on('SIGINT', exitHandler.bind(null, { exit: true, cleanup: true }));
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true, cleanup: true }));
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true, cleanup: true }));
  process.on('uncaughtException', exitHandler.bind(null, { exit: true, cleanup: true }));
})();
