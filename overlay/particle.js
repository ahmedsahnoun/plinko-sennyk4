function Particle(x, y, r, name, hue,goal) {
  this.hue = random(360);
  // r  = r + Math.random() 
  var options = {
    restitution: 0.3,
    friction: 0,
    density: 0.8
  }
  this.startX = start
  // this.shiftx =  random(-4, 4) + Math.random()*1.5 - Math.random()*1.5
  // this.shiftx = this.shiftx.toFixed(5)
  var seeds = preseeds[goal-1].seeds
  this.shiftx = seeds[ Math.floor(Math.random() * seeds.length) ]
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
  var img = createImg("plinko.gif")
  img.size(1.8 * r, 1.8 * r)
  img.parent(this.div);
  // this.magnets = []
  // this.manageMagnets = this.manageMagnets.bind(this);
  // this.removeMagnets = this.removeMagnets.bind(this);

  // this.findGuidePlinkos  = this.findGuidePlinkos.bind(this);
  // setTimeout(this.manageMagnets,1000)
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

  // // for image
  // push();
  // translate(pos.x, pos.y);
  // imageMode(CENTER);
  // image(this.img, 0, 0, this.r * 2, this.r * 2); // Draw the image
  // pop();

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
  // for (let i = 0; i < this.magnets.length; i++) {
  //   this.magnets[i].show();
  //   console.log("showing guide plinko")
  // } 
  // var dist = this.distanceNextRow()

  // if(dist< this.r/2 && this.r/4 < dist)
  //   this.manageMagnets()
  // if(this.magnets.length>0)
  //   if(this.magnets[0].y<=pos.y)
  //     this.magnets = []
}

// Particle.prototype.manageMagnets = function()
// {
//   this.magnets = []    
//   if( Math.abs(this.startX - this.body.position.x)>this.r/2 )
//   {
//     // var pos = this.body.position;
//     // pos.x = pos.x + 1
//     // if( this.body.position.x < this.startX )
//     //   pos.x = pos.x -1;
//     // pos.y = pos.y + 1;
//     // this.body.position = pos

//     this.findGuidePlinkos(true, 0.4 )
//     for (let i = 0; i < this.magnets; i++) {
//       this.magnets[i].show();
//     }  
//     setTimeout(this.removeMagnets,200)
//   }
// }

// Particle.prototype.removeMagnets = function()
// {
//   this.magnets = []
// }

// Particle.prototype.distanceNextRow = function()
// {
//   var y = this.body.position.y;
//   let belowPlinkos = plinkos.filter(p => p.y > y);

//   var miny = 2080
//   for (let pl = 0; pl < belowPlinkos.length; pl++) 
//     if(belowPlinkos[pl].y<miny)
//         miny = belowPlinkos[pl].y

//   if(miny<2080)
//     return miny - y

//   return 1000
// }

// Particle.prototype.findGuidePlinkos = function ( center = false , odds = 0.1) 
// {
//   var x = this.body.position.x;
//   var y = this.body.position.y;
//   var right= x < this.startX

//   let belowPlinkos = plinkos.filter(p => p.y > y);

//   var miny = 1080
//   for (let pl = 0; pl < belowPlinkos.length; pl++) 
//     if(belowPlinkos[pl].y<miny)
//         miny = belowPlinkos[pl].y

//   let nextRowPlinkos = belowPlinkos.filter(p => p.y == miny)

//   if(nextRowPlinkos.length==0)
//     return

//   let nextRowIndex = nextRowPlinkos[0].j

//   if(nextRowIndex > this.row)
//     this.row = nextRowIndex
//   else
//   {
//     this.magnets = []
//     return
//   }
    
//   console.log(this.row)
//   console.log(nextRowIndex)
//   // Sort the plinkos in the next row by their x coordinate
//   nextRowPlinkos.sort((a, b) => a.x - b.x);

//   // Find the two plinkos that bracket the given x coordinate
//   let leftPlinko = null;
//   let rightPlinko = null;
//   let plinko = null;
//   for (let i = 0; i < nextRowPlinkos.length; i++) {
//     if (nextRowPlinkos[i].x < x) {
//       leftPlinko = nextRowPlinkos[i];
//     } else if (nextRowPlinkos[i].x > x && !rightPlinko) {
//       rightPlinko = nextRowPlinkos[i];
//     }
//     if (leftPlinko && rightPlinko) {
//       break;
//     }
//   }



//   plinko = leftPlinko
//   if(right)
//     plinko = rightPlinko
  
//   if(center)
//   {
//     plinko = rightPlinko
//     if(right)
//       plinko = leftPlinko
//   }

//   if(plinko!=null)
//     if( plinko.j < usedOptions.length+1)
//       {
//       var i = plinko.i
//       var j = plinko.j + 1
//       if(!right)
//         i = i +1
      
//       if(center)
//       {
//         i = plinko.i
//         if(right)
//           i = i +1
//       }


//       var plinko2 = null
//       for (let pl = 0; pl < plinkos.length; pl++) 
//         if(plinkos[pl].i == i && plinkos[pl].j == j )
//           {
//             plinko2 = plinkos[pl]
//             break
//           }
//       if(plinko2==null)
//         return

//       var x1 = plinko.x
//       var y1 = plinko.y

//       var x2 = plinko2.x
//       var y2 =  plinko2.y
    
//       var x =  (3*x1/4+ x2/4)
//       var y = (3*y1/4+ y2/4) 
//       if(Math.random() > odds )
//       {
//         x=0
//         y=1080
//       }
//       var p = new Plinko( x, y, 0.1);
//       this.magnets.push(p)
//       console.log(x)
//       console.log(y)
//       console.log(this.magnets.length)
//     }

// }
