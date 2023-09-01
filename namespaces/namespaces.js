import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname + '/public'))

io.on('connectio', socket => {
	console.log(socket.id, 'connected')
	socket.on('newMessageToSever', dataFromClient => {
		console.log('Data:', dataFromClient)
		io.emit('newMessageToClients', { text: dataFromClient.text })
	})
})

httpServer.listen(3001)
