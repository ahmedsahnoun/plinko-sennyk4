
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
	submissions.innerHTML = /*html*/`
		<div data-key="${i}" class="request">
		<h2 style="color:${x.color};">${x.option}</h1>
		<div>${x.name}</div>
		</div>` + submissions.innerHTML
}

function removeSubmission(id) {
	remove(ref(database, "submissionsDB/" + id))
}

function updateSettings(data) {
	set(ref(database, "SettingsDB"), data)
}

// submission listener
onValue(submissionsDB, (snap) => {
	submissions.innerHTML = ""
	const subVals = snap.val()
	for (i in subVals) {
		submissions.innerHTML = /*html*/`
			<div data-key="${i}" class="request">
			<h2 style="color:${subVals[i].color};">${subVals[i].option}</h1>
			<div>${subVals[i].name}</div>
			</div>` + submissions.innerHTML
	}
}, {
	onlyOnce: true
})


// settings listener
onValue(ref(database, "SettingsDB"), (snap) => {
	const snapVal = snap.val()

	// queue
	clearInterval(queueLauncher)
	queueLauncher = setInterval(() => {
		if (queue.length) {
			i = queue.shift()
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
	subscription()

})

export { addSubmission, removeSubmission, updateSettings }