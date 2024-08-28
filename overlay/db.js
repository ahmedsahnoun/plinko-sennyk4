document.getElementById("displayText").innerText="TEST db.js";	
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

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;
  
	// If you don't care about the order of the elements inside
	// the array, you should sort both arrays here.
	// Please note that calling sort on an array will modify that array.
	// you might want to clone your array first.
  
	for (var i = 0; i < a.length; ++i) {
	  if (a[i] !== b[i]) return false;
	}
	return true;
  }

async function updateTwitchToken() {
	const nameToken = "w7lwaxc73n49y6etcp2w3o4uipbvcudiqse6zngiybmkstawl9"
	const rawRefreshTokenData = await fetch('https://twitchtokengenerator.com/api/refresh/' + nameToken)
	const RefreshTokenData = await rawRefreshTokenData.json()
	set(ref(database, "SettingsDB/TwitchToken"), RefreshTokenData.token)
}

// settings listener
onValue(ref(database, "SettingsDB"), (snap) => {
	const snapVal = snap.val()
	pity = (typeof snapVal.pityBoard !== 'undefined') ? snapVal.pityBoard : false;
	odds = (typeof snapVal.odds !== 'undefined') ? snapVal.odds : [3,15,37,68,80,97,97,80,68,37,15,3];
	imgLink = (typeof snapVal.img !== 'undefined') ? snapVal.img : "plinko.gif";
	// queue
	clearInterval(queueLauncher)
	queueLauncher = setInterval(() => {
		if (queue.length) {
			const i = queue.shift()
			var goal = generateNumber()
			if(pity)
				goal = -1
			newParticle(i.name, i.color,goal)
		}
	}, snapVal.interval)

	// idle
	idleTimer = snapVal.idle

	// options
	options = snapVal.options
	var newUsedOptions = []
    if (pity)
        newUsedOptions = options.slice(0, 4).concat(options.slice(-4))
    else 
	newUsedOptions = options

	gaussian = []
	for (let i = 0; i < odds.length; i++){
		var num = odds[i]
		for(let j=0; j < num; j++)
			gaussian.push(i+1)
	}
	//subTypes
	subTypes = snapVal.subTypes

	//token
	token = snapVal.token
	TwitchToken = snapVal.TwitchToken
	TwitchClientId = snapVal.TwitchClientId
	streamer= "Sennyk4"
	streamer = snapVal.name
	if (socket) socket.close()
	if (snapVal.OnOff) subscription()

	document.getElementById("displayText").innerText=streamer
	if(!arraysEqual(newUsedOptions,usedOptions) )
	{
		usedOptions=newUsedOptions
		reconstruct() 
	}
})

//Manual listener
onValue(ref(database, "Manual"), (snap) => {
	const snapVal = snap.val()
	if (snapVal) {
		generateBall(streamer)
		set(ref(database, "Manual"), false)
	}
})


// function gaussianRandom(mean = 0, stdev = 1) {
// 	let u = 1 - Math.random();
// 	let v = Math.random();
// 	let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
// 	// Adjust the Gaussian variable with mean and standard deviation
// 	return z * stdev + mean;
// }
  
// function boundedGaussianRandom(min, max, mean, stdev) {
// 	let num;
// 	do {
// 		num = gaussianRandom(mean, stdev);
// 	} while (num < min || num > max);
// 	return Math.round(num);
// }
  
// function generateNumber() {
// 	const min = 1;
// 	const max = 12;
// 	const mean = 6;
// 	const stdev = 2; // Adjust the standard deviation to fit most numbers within [1, 12]

// 	return boundedGaussianRandom(min, max, mean, stdev);
// }

function generateNumber() {
	return gaussian[(Math.floor(Math.random() * gaussian.length))]
}

export { addSubmission, removeSubmission, updateSettings, updateTwitchToken,generateNumber }