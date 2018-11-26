import { spawn } from 'child_process';
import { log } from 'src/lib/log';

(async () => {
  const spawnService = (core: string) => {
    const service = spawn(
      'rsync',
      [
        '-av',
        '-e',
        'ssh -i /c/Users/ggassmann/Documents/home_solr.pem',
        `src/solr/cores/${core}/`,
        `solr@gavingassmann.com:/var/solr/data/${core}`,
      ],
    );

    service.stdout.on('data', (data) => {
      process.stdout.write(`${data.toString()}`);
    });

    service.stderr.on('data', (data) => {
      process.stdout.write(`ERR: ${data}`);
    });

    service.on('close', (code, signal) => {
      spawnService(core);
    });
  };
  spawnService('amazon');
  spawnService('boardgame');
})();
