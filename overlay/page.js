queueLauncher = null
idleLauncher = null


setTimeout(() => document.getElementsByTagName('body')[0].style.setProperty("visibility", "hidden")
	, 5000)

const isElementLoaded = async selector => {
	while (document.querySelector(selector) === null) {
		await new Promise(resolve => requestAnimationFrame(resolve))
	}
	return document.querySelector(selector);
};

isElementLoaded("canvas").then(() => {

	reconstruct()
})

