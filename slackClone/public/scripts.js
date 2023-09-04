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
		nameSpacesDiv.innerHTML += `<div class="namespace" ns='${ns.endpoint}'><img src='${ns.image}'></div>`
	})

	Array.from(document.getElementsByClassName('namespace')).forEach(element => {
		console.log(element)
		element.addEventListener('click', e => {
			const nsEndpoint = element.getAttribute('ns')
			console.log(nsEndpoint)

			const clickedNs = nsData.find(row => row.endpoint === nsEndpoint)
			const rooms = clickedNs.rooms

			let roomList = document.querySelector('.room-list')
			roomList.innerHTML = ''
			rooms.forEach(room => {
				roomList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`
			})
		})
	})
})
