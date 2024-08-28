import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js'
import { getDatabase, ref, onValue, push as addDB, remove, set } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js'
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js'

var redeemedSubs = [0,0,0,0,0,0,0,0,0,0,0,0]
var options = []
for (let i = 1; i <= 12; i++) { options.push(`option ${i}`) }

const submissions = document.getElementById("submissions")
const optionFields = document.getElementById("optionFields")
const tokenInput = document.getElementById("token")
const idleInput = document.getElementById("idle")
const intervalInput = document.getElementById("interval")
const saveButton = document.getElementById("saveButton")
const OnOff = document.getElementById("OnOff")
const pityBoard =  document.getElementById("pityBoard")
const summedEntries = document.getElementById("Summary");
var TwitchToken = null
var TwitchClientId = null
var subTypes = null
var streamer = ""
var snapValSub = null
var odds = [3,15,37,68,80,97,97,80,68,37,15,3];
function checkToken(token) {
	const options = {
		method: 'GET',
		headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
	};

	fetch('https://api.streamelements.com/kappa/v2/users/current', options)
		.then(res => {
			if (res.status !== 200)
				document.getElementById("token").classList.add("invalidToken")
			else
				document.getElementById("token").classList.remove("invalidToken")
		})
}

try {
	const firebaseConfig = JSON.parse(atob(localStorage.getItem("config")))
	const app = initializeApp(firebaseConfig);
	const database = getDatabase(app)
	const auth = getAuth(app)
	signInAnonymously(auth);
	const submissionsDB = ref(database, "submissionsDB")

	function ManualSubmission() {
		set(ref(database, "Manual"), true)
	}

	function clearSubmissions() {
		remove(ref(database, "submissionsDB"))
	}

	document.getElementById("Manual").onclick = ManualSubmission

	document.getElementById("clearButton").onclick = clearSubmissions

	function removeSubmission(id) {
		console.log(id.target.dataset.key)
		remove(ref(database, "submissionsDB/" + id.target.dataset.key))
	}

	function removeSubmissionGroup(optionName) {
		// const ids =[]
		for (let i in snapValSub){
			if (snapValSub[i].option == optionName.target.dataset.key){
				delete snapValSub[i];

			}
		}
		set(submissionsDB, snapValSub)
	}

	function updateSettings(data) {
		set(ref(database, "SettingsDB"), data)
	}

	// submission listener
	onValue(submissionsDB, (snap) => {
		submissions.innerHTML = ""
		summedEntries.innerHTML = ""
		snapValSub = snap.val()
		const summary = {};
		// redeemedSubs = [0,0,0,0,0,0,0,0,0,0,0,0]
		for (let i in snapValSub) {
			// redeemedSubs[ parseInt(snapValSub[i].option) ] = redeemedSubs[ parseInt(snapValSub[i].option) ]  + 1
			submissions.innerHTML = /*html*/`
			<div class="request">
				<h2 style="color:${snapValSub[i].color};">${snapValSub[i].option}</h1>
				<div>${snapValSub[i].name}</div>
				<div class="date">${snapValSub[i].date ?? ""}</div>
				<div  data-key="${i}" class="delete">X</div>
			</div>` + submissions.innerHTML

			// Summed Entries Tab
			if (!summary[snapValSub[i].option]) {
				summary[snapValSub[i].option] = 1;
			} else {
				summary[snapValSub[i].option] += 1;
			}
		}

		for (let option in summary) {
			summedEntries.innerHTML += /*html*/`
			<div class="request">
				<h2>${option}</h2>
				<div>Count: ${summary[option]}</div>
				<div  data-key="${option}" class="massdelete">X</div>
			</div>`;
		}

		for (let i of document.getElementsByClassName("delete")) i.onclick = removeSubmission
		for (let i of document.getElementsByClassName("massdelete")) i.onclick = removeSubmissionGroup
	})

	// settings listener
	onValue(ref(database, "SettingsDB"), (snap) => {
		const snapVal = snap.val()
		odds = (typeof snapVal.odds !== 'undefined') ? snapVal.odds : [3,15,37,68,80,97,97,80,68,37,15,3]
		if (odds.length<12)
			odds =  [3,15,37,68,80,97,97,80,68,37,15,3]
		// options
		optionFields.innerHTML = ""
		for (let i = 0; i < snapVal.options.length; i++) {
			optionFields.innerHTML +=/*html*/`
		<div class="inputContainer">
			<div class="titleWithInput">
				<div class="title">Option ${i + 1}. Odds: </div>
				<input class="odds" id="odds ${i}" type="number" min="1" max="200" step="1" value=${odds[i]} >
			</div>
			<textarea id="option ${i}">${snapVal.options[i]}</textarea>
		</div>`
		}

		// token, idle, interval
		tokenInput.value = snapVal.token
		idleInput.value = snapVal.idle / 1000
		intervalInput.value = snapVal.interval / 1000
		TwitchToken = snapVal.TwitchToken
		TwitchClientId = snapVal.TwitchClientId
		OnOff.checked = snapVal.OnOff
		pityBoard.checked  = snapVal.pityBoard
		streamer = snapVal.name

		// subTypes
		subTypes = snapVal.subTypes
		for (let i in subTypes) {
			for (let j in subTypes[i])
				if (j === "active" || j === "multiple") document.getElementById(i + '_' + j).checked = snapVal.subTypes[i][j]
				else document.getElementById(i + '_' + j).value = snapVal.subTypes[i][j]
		}

		checkToken(snapVal.token)
	})

	// turn on and off
	OnOff.onchange = () => set(ref(database, "SettingsDB/OnOff"), OnOff.checked)
	pityBoard.onchange = () => set(ref(database, "SettingsDB/pityBoard"), pityBoard.checked)

	// save all parameters
	saveButton.onclick = () => {

		options = []
		for (let i = 0; i < 12; i++) {
			var current = document.getElementById(`option ${i}`)
			var chance = document.getElementById(`odds ${i}`)
			options.push(current.value)
			odds[i] = chance.value
		}

		for (let i in subTypes) {
			for (let j in subTypes[i])
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
			OnOff: OnOff.checked,
			pityBoard: pityBoard.checked,
			name: streamer,
			odds: odds
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

