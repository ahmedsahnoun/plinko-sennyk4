function Particle(x, y, r, name, hue) {
  this.hue = random(360);
  var options = {
    restitution: 0.3,
    friction: 0,
    density: 0.8
  }
  x += random(-4, 4);
  this.body = Bodies.circle(x, y, r, options);
  this.body.label = "particle";
  this.r = r;
  this.name = name;
  this.hue = hue || "#999999";
  this.body.collisionFilter.category = 2
  this.body.collisionFilter.mask = 1
  World.add(world, this.body);
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
  text(this.name, pos.x, pos.y - 50);
  pop();
}