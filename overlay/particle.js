function Particle(x, y, r, name, hue,goal=-1) {
  this.hue = random(360);
  // r  = r + Math.random() 
  var options = {
    restitution: 0.3,
    friction: 0,
    density: 0.8
  }
  this.startX = start
  this.shiftx =  random(-4, 4) + Math.random()*1.5 - Math.random()*1.5
  this.shiftx = this.shiftx*10000/10000
  this.goal = goal
  if(goal>=1)
  {
    var seeds = preseeds[goal-1].seeds
    this.shiftx = seeds[ Math.floor(Math.random() * seeds.length) ]
  }
  x += this.shiftx
  // x +=-2.2

  this.body = Bodies.circle(x, y, r, options);
  this.body.label = "particle";
  this.r = r;
  this.name = name;
  this.hue = hue || "#999999";
  this.body.collisionFilter.category = 2
  this.body.collisionFilter.mask = 1
  this.row = -1
  // this.img = loadImage("plink.gif")
  World.add(world, this.body);

  // for gif
  this.div = createDiv();
  this.div.position(x - 0.9 * r, y - 0.9 * r);
  this.div.style('z-index', '2')
  var img = createImg(imgLink)
  img.size(1.8 * r, 1.8 * r)
  img.parent(this.div);
}

Particle.prototype.isOffScreen = function () {
  var x = this.body.position.x;
  var y = this.body.position.y;
  return (x < -50 || x > width + 50 || y > height);
}

Particle.prototype.landed = function (h) {
  var x = this.body.position.x;
  var y = this.body.position.y;
  return (y > height - h)
}

Particle.prototype.show = function () {
  var pos = this.body.position;

  // for gif
  this.div.position(pos.x - 0.9 * this.r, pos.y - 0.9 * this.r - 70)

  fill(this.hue);
  noStroke();

  push();
  translate(pos.x, pos.y);
  ellipse(0, 0, this.r * 2);
  pop();

  push();
  textStyle(BOLD)
  textSize(25);
  textAlign(CENTER, CENTER);
  fill(255);
  textFont("sans-serif")
  stroke(0)
  strokeWeight(5)
  text(this.name, pos.x, pos.y - 1.5*  this.r );
  pop();
}
