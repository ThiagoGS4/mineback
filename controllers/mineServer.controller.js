import { getPowerState } from "../repositories/azureRepository.js";
import { deleteMod, uploadMod } from "../repositories/sftpRepository.js";
import { execSsh } from "../repositories/sshRepository.js";

export default class MineServer {
  static getModsList = async (req, res) => {
    try {
      const output = await execSsh("cd ~/minecraft && ls mods");
      res.json({ mods: output.split("\n").filter(Boolean) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Falha ao listar mods" });
    }
  };

static getMcStatus = async (req, res) => {
  try {

    const powerState = await getPowerState();

    if (!powerState.includes('running')) {
      return res.json({
        vmPowerState: powerState,
        mcStatus: 'offline',
      });
    }

    const result = await execSsh(
      'screen -ls mc >/dev/null 2>&1 && echo running || echo stopped'
    );
    const mcStatus = result.trim() === 'running' ? 'online' : 'offline';

    res.json({
      vmPowerState: powerState,
      mcStatus: mcStatus
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao checar status do servidor MC' });
  }
};


  static startMcServer = async (req, res) => {
    try {
      const cmd =
        'cd ~/minecraft && screen -S mc -dm bash -c "java -Xms1G -Xmx2G -jar server.jar nogui"';
      await execSsh(cmd);
      res.json({ status: "mc_server_started" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Falha ao iniciar servidor MC" });
    }
  };

  static stopMcServer = async (req, res) => {
    try {
      const cmd = "cd ~/minecraft && screen -S mc -p 0 -X stuff 'stop\\n'";
      await execSsh(cmd);
      res.json({ status: "mc_server_stopped" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Falha ao parar servidor MC" });
    }
  };

  static addMods = async (req, res) => {
      try {
    const files = req.files; // array de arquivos
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    await Promise.all(
      files.map((file) => uploadMod(file.path, file.originalname))
    );

    res.json({
      status: 'mods_uploaded',
      names: files.map((f) => f.originalname),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao enviar mods' });
  }
  };

  static removeMods = async (req, res) => {
  try {
    const { names } = req.body;
    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ error: 'Nenhum mod informado' });
    }

    await Promise.all(names.map((name) => deleteMod(name)));

    res.json({ status: 'mods_deleted', names });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao remover mods' });
  }
};
}
