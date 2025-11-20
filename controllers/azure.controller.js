//importar funções do repositório
import { computeClient } from "../index.js";;
import { getPowerState } from "../repositories/azureRepository.js";

export default class AzureController {
    static GetVmState = async (req, res, next) => {
        try {
    const powerState = await getPowerState();
    res.json({
      vmName: process.env.AZ_VM_NAME,
      powerState,
      host: process.env.MC_HOSTNAME,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to get status' });
  }
    }

    static startVm = async (req, res, next) =>{
        try {
    await computeClient.virtualMachines.beginStartAndWait(
      process.env.AZ_RESOURCE_GROUP,
      process.env.AZ_VM_NAME
    );
    const powerState = await getPowerState();
    res.json({
      status: 'started',
      powerState,
      host: process.env.MC_HOSTNAME,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to start VM' });
  }
    }

    static stopVm = async (req, res, next) =>{
          try {
    await computeClient.virtualMachines.beginDeallocateAndWait(
      process.env.AZ_RESOURCE_GROUP,
      process.env.AZ_VM_NAME
    );
    const powerState = await getPowerState();
    res.json({
      status: 'stopped',
      powerState,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to stop VM' });
  }
    }
}