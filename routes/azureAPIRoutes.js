import express from 'express'
import AzureController from '../controllers/azure.controller.js'
//importar controller

const router = express.Router()

router
    .get('/status', AzureController.GetVmState)
    .post('/start', AzureController.startVm)
    .post('/stop', AzureController.stopVm)


export default router