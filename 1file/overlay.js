async function loadPageFromURL(url) {
	try {
		// Fetch the content of the URL
		const response = await fetch(url, {
			mode: 'cors', // Handle CORS
		});

		// Check if the response status is OK (200)
		if (response.status === 200) {
			// Read the response text as HTML
			const htmlContent = await response.text();

			// Create a new DOM element to hold the fetched content
			const div = document.createElement('div');
			div.innerHTML = htmlContent;

			// Replace the current document's body with the fetched content
			document.body.innerHTML = div.innerHTML;

			// Optionally, you can update the document title
			document.title = div.querySelector('title').textContent;

			// Return true to indicate success
			return true;
		} else {
			console.error('Failed to load the page. Response status:', response.status);
			return false;
		}
	} catch (error) {
		console.error('Error:', error);
		return false;
	}
}

// Example usage:
const targetURL = 'https://ahmedsahnoun.github.io/plinko/overlay/overlay.html?key=eyJhcGlLZXkiOiJBSXphU3lCeGRTWmREUml3MnNPUE0wVGJfeEpIcGMwMi1MMTNfXzgiLCJhdXRoRG9tYWluIjoicGxpbmtvLXR3aXRjaC5maXJlYmFzZWFwcC5jb20iLCJkYXRhYmFzZVVSTCI6Imh0dHBzOi8vcGxpbmtvLXR3aXRjaC1kZWZhdWx0LXJ0ZGIuZmlyZWJhc2Vpby5jb20vIiwicHJvamVjdElkIjoicGxpbmtvLXR3aXRjaCIsInN0b3JhZ2VCdWNrZXQiOiJwbGlua28tdHdpdGNoLmFwcHNwb3QuY29tIiwibWVzc2FnaW5nU2VuZGVySWQiOiI5MzU0MjY4MDY4NzUiLCJhcHBJZCI6IjE6OTM1NDI2ODA2ODc1OndlYjo1M2VmMDc1YmE1OGU0MzBhZmY5YjdlIn0='; // Replace with your desired URL
loadPageFromURL(targetURL)
	.then((success) => {
		if (success) {
			console.log('Page loaded successfully.');
		} else {
			console.log('Failed to load the page.');
		}
	});
