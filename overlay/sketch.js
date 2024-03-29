var SubAdd = null
var SettingsUpdate = null
var updateTwitchTokenFunction = null

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const module = await import('./db.js');
    const { addSubmission, updateSettings, updateTwitchToken } = module;

    SubAdd = addSubmission
    SettingsUpdate = updateSettings
    updateTwitchTokenFunction = updateTwitchToken

  } catch (error) {
    console.error("Error loading module:", error);
  }
});

function preload() {
  ding = loadSound('ding.mp3');
}

function reconstruct() {
  particles = [];
  plinkos = [];
  bounds = [];
  setup()
}

// function windowResized() {
//   reconstruct()
// }

function setup() {
  var cnv = createCanvas(1920 / 2, 1080);
  cnv.id('canvas')
  start = windowHeight * 1 / 3
  colorMode(HSB);
  engine = Engine.create({ enableSleeping: true });
  world = engine.world;
  start = width / 2

  frameRate(30)
  world.gravity.y = 1.8;
  spacing = width / 12 - 0.8

  for (let j = 3; j <= rows; j++) {
    for (let i = 0; i < j; i++) {
      var x = (width / 2 - (j - 1) * spacing / 2) + i * spacing;
      var y = -40 + j * spacing;
      var p = new Plinko(x, y, plinkoRadius);
      plinkos.push(p);
    }
  }

  b = new Boundary(width / 2, height - 2.5, width, 1);
  bounds.push(b);

  b = new Boundary(0, height - 2.8 * spacing, 16, 1);
  bounds.push(b); 1
  b = new Boundary(0, height - 2.65 * spacing, 35, 1);
  bounds.push(b);

  b = new Boundary(width, height - 2.8 * spacing, 16, 1);
  bounds.push(b);
  b = new Boundary(width, height - 2.65 * spacing, 35, 1);
  bounds.push(b);


  for (let i = 0; i < options.length + 1; i++) {
    var x = i * width / options.length;
    var h = (i % options.length === 0) ? height : boundryHeight;
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

function newParticle(name, color) {
  clearTimeout(timeoutId)
  document.getElementsByTagName('body')[0].style.setProperty("visibility", "visible")
  var p = new Particle(start, 0, particleRadius, name, color);
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
      step = (width / options.length)
      index = Math.floor(particles[i].particle.body.position.x / step)
      colorIndex = index < 6 ? index : 11 - index
      SubAdd({ name: particles[i].particle.name, color: colorGradiant[colorIndex], option: options[index] })
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