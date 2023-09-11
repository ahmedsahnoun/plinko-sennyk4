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
		if (data.type == 'subscriber') {
			if (subTypes[data.type].amount > 1)
				return
			if (data.data.gifted && data.activityGroup)
				return
			if (subTypes.subscriber.active) {
				generateBall(data.data.sender || data.data.username)
				console.log("sub")
			}
		}
		else if (data.type == 'cheer' || data.type == 'communityGiftPurchase') {
			amount = data.data.amount
			if (data.type === 'communityGiftPurchase') data.type = "subscriber"
			if (subTypes[data.type].active) {
				if (subTypes[data.type].multiple) {
					for (i = 0; i < Math.floor(amount / subTypes[data.type].amount); i++) {
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

function generateBall(channelName) {
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
				}).catch(() => { queue.push({ name: channelName }) })
		}).catch(() => { queue.push({ name: channelName }) })
}