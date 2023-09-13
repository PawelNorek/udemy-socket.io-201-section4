// const userName = prompt('What is your user name')
// const password = prompt('What is your user password')

const userName = 'Fornol'
const password = 'x'

const clientOptions = {
	query: {},
	auth: {
		userName,
		password,
	},
}

const socket = io('http://192.168.1.191:3001', clientOptions)

const nameSpaceSockets = []

const listeners = {
	nsChange: [],
	messageToRoom: [],
}

let selectedNsId = 0
document.querySelector('#message-form').addEventListener('submit', e => {
	e.preventDefault()
	const newMessage = document.querySelector('#user-message').value
	console.log(newMessage, selectedNsId)
	nameSpaceSockets[selectedNsId].emit('newMessageToRoom', {
		newMessage,
		date: Date.now(),
		avatar: 'https://via.placeholder.com/30',
		userName,
		selectedNsId,
	})
	document.querySelector('#user-message').value = ''
})

const addListeners = nsId => {
	console.log('add listeners function')
	if (!listeners.nsChange[nsId]) {
		nameSpaceSockets[nsId].on('nsChange', data => {
			console.log('Namespace changed')
			console.log(data)
		})
		listeners.nsChange[nsId] = true
	}
	if (!listeners.messageToRoom[nsId]) {
		nameSpaceSockets[nsId].on('messageToRoom', messageObj => {
			console.log(messageObj)
			document.querySelector('#messages').innerHTML += buildMessageHtml(messageObj)
		})
		listeners.messageToRoom[nsId] = true
	}
}

socket.on('connect', () => {
	console.log('Connected')
	socket.emit('clientConnect')
})

socket.on('nsList', nsData => {
	const lastNs = localStorage.getItem('lastNs')
	const nameSpacesDiv = document.querySelector('.namespaces')
	nameSpacesDiv.innerHTML = ''
	nsData.forEach(ns => {
		nameSpacesDiv.innerHTML += `<div class="namespace" ns='${ns.endpoint}'><img src='${ns.image}'></div>`

		if (!nameSpaceSockets[ns.id]) {
			nameSpaceSockets[ns.id] = io(`http://192.168.1.191:3001${ns.endpoint}`)
		}
		console.log('add listeners')
		addListeners(ns.id)
	})

	Array.from(document.getElementsByClassName('namespace')).forEach(element => {
		element.addEventListener('click', e => {
			joinNs(element, nsData)
		})
	})

	joinNs(
		lastNs ? document.querySelector('[ns="' + lastNs + '"]') : document.getElementsByClassName('namespace')[0],
		nsData
	)

	console.log('listeners: ', listeners)
})
