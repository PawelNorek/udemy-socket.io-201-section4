// const userName = prompt('What is your user name')
// const password = prompt('What is your user password')

const userName = 'Fornol'
const password = 'x'

const socket = io('http://192.168.1.191:3001')

const nameSpaceSockets = []
const listeners = {
	nsChange: [],
}

const addListeners = nsId => {
	if (listeners.nsChange[nsId]) {
		nameSpaceSockets[nsId].on('nsChange', data => {
			console.log('Namespace changed')
			console.log(data)
		})
		listeners.nsChange[nsId] = true
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

		addListeners[ns.id]
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
})
