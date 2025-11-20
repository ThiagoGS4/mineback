import express from "express"
import mineRoutes from "../routes/mineRoutes.js"
import azureAPIRutes from "../routes/azureAPIRoutes.js"
//importar rotas aqui

export const routes = (app => {
    app.get('/', (req, res) =>{
        res.send("Health OK!")
    })

    app.use(
        express.json(),
        mineRoutes,
        azureAPIRutes,
    )
})