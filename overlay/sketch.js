var SubAdd = null
var SettingsUpdate = null
var updateTwitchTokenFunction = null

function onready() {
  import('./db.js')
    .then(module => {
      const { addSubmission, updateSettings, updateTwitchToken } = module;

      SubAdd = addSubmission;
      SettingsUpdate = updateSettings;
      updateTwitchTokenFunction = updateTwitchToken;
    })
    .catch(error => {
      console.error("Error loading module:", error);
      document.getElementById("displayText").innerText = error.stack;
    });
}

document.addEventListener('DOMContentLoaded', onready);
function preload() {
  ding = loadSound('ding.mp3');
}

function reconstruct() {
  console.log("reconstruct")
  particles = [];
  plinkos = [];
  bounds = [];
  setup()
}

// function windowResized() {
//   reconstruct()
// }

function drawBoxes(){
  var textOption = ""
	for (let option in usedOptions) {
    if(option >= usedOptions.length/2)
      option = parseInt(options.length) - parseInt(usedOptions.length) + parseInt(option) 
		var colorIndex = option < 6 ? option : 11 - option
		textOption += /*html*/`<div style="background-color:${colorGradiant[colorIndex]};" >${Number(option) + 1}</div>`
	}
	optionsText.innerHTML = textOption
}

function setup() {
  // console.log(options)
  drawBoxes()
  var cnv = createCanvas(1920 / 2, 1080);
  cnv.id('canvas')
  start = windowHeight * 1 / 3
  colorMode(HSB);
  engine = Engine.create({ enableSleeping: true });
  world = engine.world;
  start = width / 2
  
  frameRate(30)
  world.gravity.y = 1.8;
  spacing = (width / usedOptions.length - 0.8)// * 12 / options.length
  // plinkoRadius = spacing/30;
  particleRadius  = spacing /2 - plinkoRadius*1.5
  var maxHeight = (usedOptions.length +1.3 ) * spacing /heightwidthratio
  for (let j = 2; j <= usedOptions.length+1; j++) {
    for (let i = 0; i < j; i++) {
      var x = (width / 2 - (j - 1) * spacing / 2) + i * spacing;
      var y = 1080 - maxHeight  + (j-1) * spacing /heightwidthratio;
      var p = new Plinko(x, y, plinkoRadius,i,j);
      plinkos.push(p);

      // if(i == 0)
      // {
      //   var i2 = 0
      //   var j2 = j+1;
      //   var x2 = (width / 2 - (j2- 1) * spacing / 2) + i2 * spacing;
      //   var y2 = 1080 - maxHeight  + (j2-1) * spacing /heightwidthratio;
      //   var p2 = new Plinko((x+x2)/2, (y+y2)/2, plinkoRadius,0,0);
      //   plinkos.push(p2);
      // }
      // if(i == j-1)
      // {
      //   var i2 = j
      //   var j2 = j+1;
      //   var x2 = (width / 2 - (j2- 1) * spacing / 2) + i2 * spacing;
      //   var y2 = 1080 - maxHeight  + (j2-1) * spacing /heightwidthratio;
      //   var p2 = new Plinko((x+x2)/2, (y+y2)/2, plinkoRadius,0,0);
      //   plinkos.push(p2);
      // }
    }
  }

  // pityPlinkos = [{j:5,i:2,inc:1},{j:6,i:3,inc:1},{j:7,i:4,inc:1},{j:5,i:2,inc:0},{j:6,i:2,inc:0},{j:7,i:2,inc:0},{j:8,i:5,inc:1},{j:8,i:2,inc:0},{j:9,i:6,inc:1},{j:9,i:2,inc:0} ]
  // for (var pity of pityPlinkos) 
  // { 
  //   var j = pity.j
  //   var i = pity.i
  //   var nextj = j+1;
  //   var  nexti = i+pity.inc;
  //   var x1 = (width / 2 - (j - 1) * spacing / 2) + i * spacing;
  //   var y1 = -40 + j * spacing;
  //   var x2 = (width / 2 - (nextj - 1) * spacing / 2) + nexti * spacing;
  //   var y2 = -40 + nextj * spacing;

  //   var p = new Plinko( x1*3/4 +x2/4, y1*3/4+y2/4, plinkoRadius-0.5);
  //   plinkos.push(p);
  // }
  // b = new Boundary(width / 2, height - 2.5, width, 1);
  // bounds.push(b);

  b = new Boundary(0, height - 2.8 * spacing, 16, 1);
  bounds.push(b); 
  b = new Boundary(0, height - 2.65 * spacing, 35, 1);
  bounds.push(b);

  b = new Boundary(width, height - 2.8 * spacing, 16, 1);
  bounds.push(b);
  b = new Boundary(width, height - 2.65 * spacing, 35, 1);
  bounds.push(b);


  for (let i = 0; i < usedOptions.length + 1; i++) {
    var x = i * width / usedOptions.length;
    var h = (i % usedOptions.length === 0) ? height : boundryHeight;
    var w = 0.1;
    var y = height - h / 2;
    var b = new Boundary(x, y, w, h);
    bounds.push(b);
  }

  // function collision(event) {
  //   var pairs = event.pairs;
  //   for (var i = 0; i < pairs.length; i++) {
  //     var labelA = pairs[i].bodyA.label;
  //     var labelB = pairs[i].bodyB.label;
  //     if (labelA == 'particle' && labelB == 'plinko') {
  //       // ding.play();
  //     }
  //     if (labelA == 'plinko' && labelB == 'particle') {
  //       // ding.play();
  //     }
  //   }
  // }

  // Events.on(engine, 'collisionStart', collision);
}

function newParticle(name, color,goal=6) {
  clearTimeout(timeoutId)
  document.getElementsByTagName('body')[0].style.setProperty("visibility", "visible")
  
  var p = new Particle(start, 0, particleRadius, name, color,goal);
  particles.push({ particle: p, logged: false });
  particlesCounter++
}

function draw() {
  clear()
  Engine.update(engine, 1000 / 30);
  for (let i = 0; i < plinkos.length; i++) {
    plinkos[i].show();
  }
  // for (var i = 0; i < bounds.length; i++) {
  //   bounds[i].show();
  // }
  for (let i = 0; i < particles.length; i++) {
    if (!particles[i].logged) particles[i].particle.show();
    if (particles[i].particle.landed(boundryHeight) && !particles[i].logged) {
      particles[i].logged = true
      step = (width / usedOptions.length)
      index = Math.floor(particles[i].particle.body.position.x / step)
      colorIndex = index < 6 ? index : 11 - index
      // preseeds[index].seeds.push(particles[i].particle.shiftx)
      SubAdd({
        name: particles[i].particle.name,
        color: colorGradiant[colorIndex],
        option: usedOptions[index],
        date: new Date().toLocaleString(),
      })
      removeParticle(i)
      if (particlesCounter === 0) {
        particles = []
        timeoutId = setTimeout(() => {
          document.getElementsByTagName('body')[0].style.setProperty("visibility", "hidden")
        }
          , idleTimer)
      }
    }
  }
}

function removeParticle(i) {
  particles[i].particle.div.remove()
  World.remove(world, particles[i].particle.body);
  particlesCounter--
}


function gaussianRandom(mean = 0, stdev = 1) {
	let u = 1 - Math.random();
	let v = Math.random();
	let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	// Adjust the Gaussian variable with mean and standard deviation
	return z * stdev + mean;
}
  
function boundedGaussianRandom(min, max, mean, stdev) {
	let num;
	do {
		num = gaussianRandom(mean, stdev);
	} while (num < min || num > max);
	return Math.round(num);
}
  
function generateNumber() {
	const min = 1;
	const max = 12;
	const mean = 6;
	const stdev = 2; // Adjust the standard deviation to fit most numbers within [1, 12]

	return boundedGaussianRandom(min, max, mean, stdev);
}
function testGenerator()
{
  var dist = [0,0,0,0,0,0,0,0,0,0,0,0]
  for(let i =0; i<500; i++) {
    var num = generateNumber()
    dist[num-1] = dist[num-1] + 1
  }
  console.log(dist)
}