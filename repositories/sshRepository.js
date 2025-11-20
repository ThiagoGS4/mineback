// services/sshService.js
import { Client } from 'ssh2';
import sshConfig from '../config/ssh.js';

export function execSsh(command) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let stdout = '';
    let stderr = '';

    conn
      .on('ready', () => {
        conn.exec(command, (err, stream) => {
          if (err) {
            conn.end();
            return reject(err);
          }
          stream
            .on('close', (code) => {
              conn.end();
              if (code === 0) resolve(stdout.trim());
              else reject(new Error(stderr || `exit code ${code}`));
            })
            .on('data', (data) => {
              stdout += data.toString();
            })
            .stderr.on('data', (data) => {
              stderr += data.toString();
            });
        });
      })
      .on('error', (err) => reject(err))
      .connect(sshConfig);
  });
}
