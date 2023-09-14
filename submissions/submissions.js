
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js'
import { getDatabase, ref, onValue, push as addDB, remove, set } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js'
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js'

const urlParams = new URLSearchParams(window.location.search);
const firebaseConfig = JSON.parse(atob(urlParams.get("key")))

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth(app)
signInAnonymously(auth);

const submissionsDB = ref(database, "submissionsDB")

var visibilityTimer = 0
var currentTimeout = null
function makeVisible(time) {
	clearTimeout(currentTimeout)
	document.getElementsByTagName('body')[0].style.setProperty("visibility", "visible")
	if (time > 0) currentTimeout = setTimeout(() => document.getElementsByTagName('body')[0].style.setProperty("visibility", "hidden"), time)
}
makeVisible(0)

// settings listener
var subTypes = null
onValue(ref(database, "SettingsDB"), (snap) => {
	const snapVal = snap.val()

	// idle
	visibilityTimer = snapVal.idle

	//subTypes
	subTypes = snapVal.subTypes

	//token
	token = snapVal.token
	if (socket) socket.close()
	subscription()
})

// submission listener
const submissions = document.getElementById("submissions")
function readSubmissions() {
	onValue(submissionsDB, (snap) => {
		makeVisible(visibilityTimer)

		submissions.innerHTML = ""
		const subVals = snap.val()
		var counter = 0
		for (var i of Object.values(subVals).slice(-5)) {
			if (counter === 5) return
			submissions.innerHTML = /*html*/`
			<div class="request">
			<h2 style="color:${i.color};">${i.option}</h1>
			<div>${i.name}</div>
			</div>` + submissions.innerHTML
			counter++
		}
	})
}
readSubmissions()

var token = null
var socket = null
function subscription() {
	socket = io('https://realtime.streamelements.com', {
		transports: ['websocket']
	});

	socket.on('connect', () => {
		console.log('Successfully connected to the websocket')
		socket.emit('authenticate', { method: 'jwt', token: token })
	})

	socket.on('event', (data) => {
		if (["subscriber", "cheer", "communityGiftPurchase"].includes(data.type)) {
			amount = data.data.amount
			if (data.type === 'communityGiftPurchase') data.type = "subscriber"
			if (subTypes[data.type].active && amount >= subTypes[data.type].amount)
				makeVisible(0)
		}
	})
}

export { makeVisible }