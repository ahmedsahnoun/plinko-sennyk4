const subscription = (token, url) => {
	if (url) ws = new WebSocket(url);
	else ws = new WebSocket('wss://eventsub.wss.twitch.tv/ws');

	ws.addEventListener('open', (event) => {
		console.log('WebSocket connected');

		ws.addEventListener('message', (event) => {
			message = JSON.parse(event.data)
			type = message.metadata.message_type
			clientId = "o8psoh7xmn5zflmbj5g41vb7o3w8kb"
			channelName = 'ziedyt';

			if (type === "session_welcome") {

				sessionId = message.payload.session.id;

				headers = {
					'Client-ID': clientId,
					'Authorization': `Bearer ${token}`,
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
					.then(data => {
						const channelId = data.data[0].id;
						const body = {
							type: 'channel.ban',
							version: '1',
							condition: {
								broadcaster_user_id: channelId,
							},
							transport: {
								method: 'websocket',
								session_id: sessionId,
							},
						};

						fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
							method: 'POST',
							headers,
							body: JSON.stringify(body),
						})
							.then(response => response.json())
							.then(responseData => {
								// console.log(responseData);
							})
							.catch(error => {
								console.error('Error creating subscription:', error);
							});
					})
					.catch(error => {
						console.log("check your token")
						console.error('Error fetching user data:', error);
					});
			}

			if (type === "notification") {
				console.log(message.payload)
				fetch(`https://api.twitch.tv/helix/chat/color?user_id=${message.payload.event.user_id}`, {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Client-Id': clientId
					}
				}).then(response => response.json())
					.then(response => {
						queue.push({ name: response.data[0].user_name, color: response.data[0].color })
					})
			}

			if (type === "session_reconnect") {
				reconnect_url = JSON.parse(event.data).payload.session.reconnect_url
				ws.close()
				subscription(token, reconnect_url)
			}
		});
	});

	ws.addEventListener('error', (event) => {
		console.error('WebSocket error:', event);
	});
}