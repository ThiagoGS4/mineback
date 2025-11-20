import { computeClient } from "../index.js";

export async function getPowerState() {
  const vm = await computeClient.virtualMachines.get(
    process.env.AZ_RESOURCE_GROUP,
    process.env.AZ_VM_NAME,
    { expand: 'instanceView' }
  );
  const status = vm.instanceView?.statuses?.find(s =>
    s.code?.startsWith('PowerState/')
  );
  return status?.displayStatus || 'Unknown';
}