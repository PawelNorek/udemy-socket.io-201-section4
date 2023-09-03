// const userName = prompt('What is your user name')
// const password = prompt('What is your user password')

const userName = 'Fornol'
const password = 'x'

const socket = io('http://192.168.1.191:3001')

socket.on('connect', () => {
	console.log('Connected')
	socket.emit('clientConnect')
})

socket.on('nsList', nsData => {
	console.log(nsData)
	const nameSpacesDiv = document.querySelector('.namespaces')
	nsData.forEach(ns => {
		nameSpacesDiv.innerHTML += `<div class="namespace" ns='${ns.name}'><img src='${ns.image}'></div>`
	})
})
