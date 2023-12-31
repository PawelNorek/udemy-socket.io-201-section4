import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import namespaces from './data/namespaces.mjs'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname + '/public'))

io.on('connection', socket => {
	socket.emit('welcome', 'Welcome to the server.')
	socket.on('clientConnect', data => {
		console.log(socket.id, 'has connected')
	})
	socket.emit('nsList', namespaces)
})

httpServer.listen(3001)
