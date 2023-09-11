import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js'
import { getDatabase, ref, onValue, push as addDB, remove, set } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js'
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js'


var options = []
for (var i = 1; i <= 12; i++) { options.push(`option ${i}`) }

const submissions = document.getElementById("submissions")
const optionFields = document.getElementById("optionFields")
const tokenInput = document.getElementById("token")
const idleInput = document.getElementById("idle")
const intervalInput = document.getElementById("interval")
const saveButton = document.getElementById("saveButton")
var TwitchToken = null
var TwitchClientId = null
var subTypes = null

try {
	const firebaseConfig = JSON.parse(atob(localStorage.getItem("config")))
	const app = initializeApp(firebaseConfig);
	const database = getDatabase(app)
	const auth = getAuth(app)
	signInAnonymously(auth);
	const submissionsDB = ref(database, "submissionsDB")

	function addSubmission(x) {
		addDB(submissionsDB, x)
	}

	function clearSubmissions() {
		remove(ref(database, "submissionsDB"))
		set(ref(database, "deleteAlert"), Math.random())
	}

	document.getElementById("clearButton").onclick = clearSubmissions

	function removeSubmission(id) {
		console.log(id.target.dataset.key)
		remove(ref(database, "submissionsDB/" + id.target.dataset.key))
		set(ref(database, "deleteAlert"), Math.random())
	}

	function updateSettings(data) {
		set(ref(database, "SettingsDB"), data)
	}

	// submission listener
	onValue(submissionsDB, (snap) => {
		submissions.innerHTML = ""
		const snapVal = snap.val()
		for (i in snapVal) {
			submissions.innerHTML = /*html*/`
			<div class="request">
				<h2 style="color:${snapVal[i].color};">${snapVal[i].option}</h1>
				<div>${snapVal[i].name}</div>
				<div  data-key="${i}" class="delete">X</div>
			</div>` + submissions.innerHTML
		}
		for (i of document.getElementsByClassName("delete")) i.onclick = removeSubmission
	})

	// settings listener
	onValue(ref(database, "SettingsDB"), (snap) => {
		const snapVal = snap.val()

		// options
		optionFields.innerHTML = ""
		for (var i = 0; i < snapVal.options.length; i++) {
			optionFields.innerHTML +=/*html*/`
		<div class="inputContainer">
			<div class="title">Option ${i + 1}</div>
			<textarea id="option ${i}">${snapVal.options[i]}</textarea>
		</div>`
		}

		// token, idle, interval
		tokenInput.value = snapVal.token
		idleInput.value = snapVal.idle / 1000
		intervalInput.value = snapVal.interval / 1000
		TwitchToken = snapVal.TwitchToken
		TwitchClientId = snapVal.TwitchClientId

		// subTypes
		subTypes = snapVal.subTypes
		for (var i in subTypes) {
			for (var j in subTypes[i])
				if (j === "active" || j === "multiple") document.getElementById(i + '_' + j).checked = snapVal.subTypes[i][j]
				else document.getElementById(i + '_' + j).value = snapVal.subTypes[i][j]
		}
	})

	saveButton.onclick = () => {

		options = []
		for (var i = 0; i < 12; i++) {
			var current = document.getElementById(`option ${i}`)
			options.push(current.value)
		}

		for (var i in subTypes) {
			for (var j in subTypes[i])
				if (j === "active" || j === "multiple") subTypes[i][j] = document.getElementById(i + '_' + j).checked
				else subTypes[i][j] = Number(document.getElementById(i + '_' + j).value)
		}

		const savedData = {
			token: tokenInput.value,
			idle: idleInput.value * 1000,
			interval: intervalInput.value * 1000,
			options: options,
			subTypes: subTypes,
			TwitchClientId: TwitchClientId,
			TwitchToken: TwitchToken,
		}
		updateSettings(savedData)
	}
}
catch (error) {
	console.log(error)
	document.getElementById("password").style.visibility = "visible"
	document.getElementById("configConfirm").onclick = () => {
		localStorage.setItem("config", document.getElementById("config").value)
		location.reload()
	}
}