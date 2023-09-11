import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import namespaces from './data/namespaces.mjs'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

import path from 'path'
import { fileURLToPath } from 'url'
import Room from './classes/Room.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname + '/public'))

app.get('/change-ns', (req, res) => {
	namespaces[0].addRoom(new Room(0, 'Deleted articles', 0))
	io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0])
	res.json(namespaces[0])
})

io.on('connection', socket => {
	socket.emit('welcome', 'Welcome to the server.')
	socket.on('clientConnect', data => {
		console.log(socket.id, 'has connected')
		socket.emit('nsList', namespaces)
	})
})

namespaces.forEach(namespace => {
	io.of(namespace.endpoint).on('connection', socket => {
		console.log(`${socket.id} has connected to ${namespace.endpoint} `)
	})
})

httpServer.listen(3001)
