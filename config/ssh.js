import fs from 'fs';

const sshConfig = {
  host: process.env.SSH_HOST,
  port: 22,
  username: process.env.SSH_USER,
  privateKey: fs.readFileSync(process.env.SSH_KEY_PATH),
};

export default sshConfig