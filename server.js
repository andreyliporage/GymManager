const express = require("express")//permite pegar arquivos js externos
const nunjucks = require("nunjucks")
const routes = require('./routes')
const methodOverride = require("method-override")

const server = express()

server.use(express.urlencoded({extended: true})) // faz o req.body funcionar
server.use(express.static("public"))
server.use(methodOverride("_method"))// tenho que colocar acima do routes
server.use(routes)

server.set("view engine", "njk")

nunjucks.configure("views", {//"caminho - pasta"
    express:server,//qual dependencia vai usar e sua constante 
    noCache: true,
    autoescape: false
})

server.listen(5000, function() {//callback é uma função dentro de outra função
    console.log("server is running")
})