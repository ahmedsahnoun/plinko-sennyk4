
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

function addSubmission(x) {
	addDB(submissionsDB, x)
}

function removeSubmission(id) {
	remove(ref(database, "submissionsDB/" + id))
}

function updateSettings(data) {
	set(ref(database, "SettingsDB"), data)
}

// settings listener
onValue(ref(database, "SettingsDB"), (snap) => {
	const snapVal = snap.val()

	// queue
	clearInterval(queueLauncher)
	queueLauncher = setInterval(() => {
		if (queue.length) {
			const i = queue.shift()
			newParticle(i.name, i.color)
		}
	}, snapVal.interval)

	// idle
	idleTimer = snapVal.idle

	// options
	options = snapVal.options

	//subTypes
	subTypes = snapVal.subTypes

	//token
	token = snapVal.token
	TwitchToken = snapVal.TwitchToken
	TwitchClientId = snapVal.TwitchClientId
	if (socket) socket.close()
	if (snapVal.OnOff) subscription()

})

//Manual listener
onValue(ref(database, "Manual"), (snap) => {
	const snapVal = snap.val()
	if (snapVal) {
		generateBall("SennyK4")
		set(ref(database, "Manual"), false)
	}
})

export { addSubmission, removeSubmission, updateSettings }