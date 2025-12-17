import express from 'express'
import multer from 'multer'
import MineServer from '../controllers/mineServer.controller.js'
import checkStateVM from '../middlewares/checkStateVM.js'
//importar controller

const router = express.Router()
const upload = multer({ dest: '/tmp/uploads' });

router
    .get('/mods', checkStateVM, MineServer.getModsList)
    .post('/mods', checkStateVM, upload.array('mods'), MineServer.addMods)
    .delete('/mods', checkStateVM, MineServer.removeMods)
    .get('/mc/status', MineServer.getMcStatus)
    .post('/startServer', checkStateVM, MineServer.startMcServer)
    .post('/stopServer', checkStateVM, MineServer.stopMcServer)
    .get('/worlds', MineServer.getWorldsList)
    .post('/moveWorld', MineServer.moveWorld)
    .post('/restoreWorld', MineServer.restoreSelectedWorld)

export default router