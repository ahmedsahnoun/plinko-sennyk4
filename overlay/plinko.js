function Plinko(x, y, r,i=-1,j=-1) {
  var options = {
    restitution: 1,
    friction: 0,
    isStatic: true
  }
  this.x = x
  this.y = y
  this.i=i
  this.j=j
  this.body = Bodies.circle(x, y, r, options);
  this.body.label = "plinko";
  this.r = r;
  World.add(world, this.body);
}

Plinko.prototype.show = function () {
  noStroke();
  fill(127);
  var pos = this.body.position;
  push();
  translate(pos.x, pos.y);
  ellipse(0, 0, this.r * 2);
  pop();
}