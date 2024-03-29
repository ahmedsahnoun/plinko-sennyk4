var socket = null
var gifted = {}
function subscription() {
	socket = io('https://realtime.streamelements.com', {
		transports: ['websocket']
	});

	socket.on('connect', () => {
		console.log('Successfully connected to the websocket')
		socket.emit('authenticate', { method: 'jwt', token: token })
	})

	// socket.on('unauthorized', () => {
	// 	console.log("shit")
	// })

	socket.on('event', (data) => {
		amount = data.data.amount
		if (data.type == 'subscriber') {
			if (data.data.tier === "3000" || data.data.tier === "2000")
				data.type += data.data.tier
			if (!subTypes[data.type].active)
				return
			if (subTypes[data.type].amount === 1) {
				generateBall(data.data.username)
				return
			}
			if (subTypes[data.type].amount <= 0)
				return
			if (data.activityGroup) {
				if (!(data.activityGroup in gifted)) {
					gifted[data.activityGroup] = {
						counter: 1, timeOut: setTimeout(
							() => delete gifted[data.activityGroup]
							, 60000)
					}
				}
				else {
					clearTimeout(gifted[data.activityGroup].timeOut)
					gifted[data.activityGroup].timeOut = setTimeout(
						() => delete gifted[data.activityGroup]
						, 60000)
					gifted[data.activityGroup].counter++
				}
				if (gifted[data.activityGroup].counter % subTypes[data.type].amount === 0) {
					generateBall(data.data.sender)
				}
			}
		}
		else if (data.type == 'cheer' || data.type == 'tip') {
			if (subTypes[data.type].active) {
				if (subTypes[data.type].multiple) {
					if (subTypes[data.type].amount <= 0)
						return
					for (let i = 0; i < Math.floor(amount / subTypes[data.type].amount); i++) {
						generateBall(data.data.username)
					}
				}
				else if (amount >= subTypes[data.type].amount) {
					generateBall(data.data.username)
				}
			}
		}
	});
}

function generateBall(channelName, tries = 0) {
	if (tries > 5) return
	headers = {
		'Client-ID': TwitchClientId,
		'Authorization': `Bearer ${TwitchToken}`,
		'Content-Type': 'application/json',
	};
	apiUrl = `https://api.twitch.tv/helix/users?login=${channelName}`;
	fetch(apiUrl, { headers })
		.then(response => {
			if (response.status === 401) {
				throw new Error(401);
			}
			return response.json();
		})
		.then(message => {
			const channelId = message.data[0].id;
			fetch(`https://api.twitch.tv/helix/chat/color?user_id=${channelId}`, {
				headers: {
					'Authorization': `Bearer ${TwitchToken}`,
					'Client-Id': TwitchClientId
				}
			}).then(response => response.json())
				.then(response => {
					queue.push({ name: response.data[0].user_name, color: response.data[0].color })
				}).catch(async () => {
					await updateTwitchTokenFunction()
					generateBall(channelName, tries + 1)
				})
		}).catch(async () => {
			await updateTwitchTokenFunction()
			generateBall(channelName, tries + 1)
		})
}

function getGifter(channel) {
	headers = {
		'Authorization': `Bearer ${token}`,
		'Content-Type': 'application/json',
	};
	apiUrl = `https://api.streamelements.com/kappa/v2/sessions/${channel}`;
	fetch(apiUrl, { headers })
		.then(response => response.json())
		.then(response => {
			console.log(response)
		})
}