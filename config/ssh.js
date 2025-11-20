import fs from 'fs';

function getPrivateKey() {
  if (process.env.SSH_PRIVATE_KEY) {
    return process.env.SSH_PRIVATE_KEY;
  }

  if (process.env.SSH_KEY_PATH) {
    return fs.readFileSync(process.env.SSH_KEY_PATH);
  }

  throw new Error('No SSH key configured');
}

const sshConfig = {
  host: process.env.SSH_HOST,
  port: 22,
  username: process.env.SSH_USER,
  privateKey: getPrivateKey(),
};

export default sshConfig;
