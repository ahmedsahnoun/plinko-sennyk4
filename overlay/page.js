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



setTimeout(() => isElementLoaded("canvas").then(() => {
	var textOption = ""
	for (let option in options) {
		var colorIndex = option < 6 ? option : 11 - option
		textOption += /*html*/`<div style="background-color:${colorGradiant[colorIndex]};" >${Number(option) + 1}</div>`
	}
	optionsText.innerHTML = textOption
	reconstruct()
})

	, 2000)

