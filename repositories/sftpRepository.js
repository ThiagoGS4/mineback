import SftpClient from 'ssh2-sftp-client';
import sshConfig from '../config/ssh.js';

export async function uploadMod(localPath, remoteFileName) {
  const sftp = new SftpClient();
  try {
    await sftp.connect(sshConfig);
    await sftp.fastPut(localPath, `/home/${process.env.SSH_USER}/minecraft/mods/${remoteFileName}`);
  } finally {
    sftp.end();
  }
}

export async function deleteMod(remoteFileName) {
  const sftp = new SftpClient();
  try {
    await sftp.connect(sshConfig);
    await sftp.delete(`/home/${process.env.SSH_USER}/minecraft/mods/${remoteFileName}`);
  } finally {
    sftp.end();
  }
}
