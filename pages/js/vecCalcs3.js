var myPoint;
var dotProductText;
var moveA, moveB, moveC, moveTarget;
var A,B,C,D;
var start;

function setup(){
    createCanvas(800,400);
    A = new Point(150,150);
    B = new Point(300,300);
    target = new Point(100,300);
    C = new Particle(300,150,target);
    var btn = createButton('Start')
    btn.position(150, 65);
    btn.mousePressed(start);
    
};

function draw(){
    stroke(1)
    background(50);
    fill(255);
    A.display();
    B.display();
    target.display();
    stroke(255)
    line(A.position.x,A.position.y,B.position.x,B.position.y)
    stroke(255,100,100)
    line(A.position.x,A.position.y,C.position.x,C.position.y)
    var projection = calcProjection(A.position,B.position,C.position)
    var q = closestPoint(A.position,B.position,projection)
    if(detectCollision(q,C) == true){
	Particle.collide(A,B)
	fill(0,255,0);
    }
    else{
	fill(255,0,0);
    }
    C.display(target)
    ellipse(q.x,q.y,5,5)

    stroke(100,255,100)
    strokeWeight(3)
    C.update()
    
};

/*Particle.prototype.collide = function(A,B){
    var lineVelocity = calcProjection(
*/
function start(){
    C.velocity = p5.Vector.sub(target.position,C.position).normalize();
}
var Point = function(x,y){
    this.position = createVector(x,y);
    this.r = 3;
}

Point.prototype.display = function(){
    fill(255);
    ellipse(this.position.x,this.position.y,this.r*2,this.r*2);
}

var Particle = function(x,y,target){
    this.position = createVector(x,y);
    this.r = 10;
    this.velocity = createVector(0,0);
}

Particle.prototype.update = function(target){

    this.position.add(this.velocity)
}

Particle.prototype.display = function(){
    ellipse(this.position.x,this.position.y,this.r*2,this.r*2)
}

function calcProjection(APos,BPos,CPos){
    var vectorAB = p5.Vector.sub(BPos,APos).normalize()
    var vectorAC = p5.Vector.sub(CPos,APos)
    var projection = p5.Vector.mult(vectorAB,(p5.Vector.dot(vectorAB,vectorAC)))
    writeLabels(vectorAB,vectorAC,projection)
//    var projected = p5.Vector.add(APos,projection)
    return projection
}

//Calculate the closest point to the particle that lies on line segment AB
function closestPoint(APos,BPos,projection){
    var rightMost;
    var leftMost;
    var upperMost;
    var lowerMost;
    var inLine = false;
    var vectorAB = p5.Vector.sub(BPos,APos);
    var q = p5.Vector.add(APos,projection);

    if(APos.x < BPos.x){
	rightMost = BPos;
	leftMost = APos;
    }
    else if(APos.x > BPos.x){
	rightMost = APos;
	leftMost = BPos;
    }
    else{
	inLine = true;
	if(APos.y < BPos.y){
	    upperMost = APos;
	    lowerMost = BPos;
	}
	else{
	    upperMost = BPos;
	    lowerMost = APos;
	}
    }
    if(inLine == false){
	if(q.x < leftMost.x){
	    q = leftMost
	}
	if(q.x > rightMost.x){
	    q = rightMost
	}
    }
    else{
	if(q.y < upperMost.y){
	    q = upperMost;
	}
	else if(q.y > lowerMost.y){
	    q = lowerMost;
	}
    }
    return q
}

//Calculate if a collision occurs
function detectCollision(q,p){
    var collision;
    var shortestDist = p5.Vector.sub(p.position,q)
    if((p.r * p.r)>(p5.Vector.dot(shortestDist,shortestDist))){
	collision = true;
    }
    else{
	collision = false;
    }
    return collision;
}
    


function writeLabels(AB,AC,projection){
    fill(255)
    stroke(255)
    text('A: ' + A.position.x + ',' + A.position.y,500,50)
    text('B: ' + B.position.x + ',' + B.position.y,500,70)
    text('C: ' + C.position.x + ',' + C.position.y,500,90)
    text('vectorAB: ' + AB.x.toFixed(3) + ',' + AB.y.toFixed(3),500,110)
    text('vectorAC: ' + AC.x.toFixed(3) + ',' + AC.y.toFixed(3),500,130)
    text('projection: ' + projection.x.toFixed(3) + ',' + projection.y.toFixed(3),500,150)
    text(moveA,500,160)
}

function mouseDragged() {
    if(moveA == true){
	A.position.x = mouseX;
	A.position.y = mouseY;
    }
    else if(moveB == true){
	B.position.x = mouseX;
	B.position.y = mouseY;
     }
     else if(moveC == true){
	C.position.x = mouseX;
	C.position.y = mouseY;
     }
    else if(moveTarget == true){
	target.position.x = mouseX;
	target.position.y = mouseY;
    }
    return false;
}

function mousePressed(){
    if(mouseX > (A.position.x -A.r) && mouseX < (A.position.x + A.r) && mouseY < (A.position.y +A.r) && mouseY > (A.position.y - A.r)){
	moveA = true;
    }
    else if(mouseX > (B.position.x -B.r) && mouseX < (B.position.x + B.r) && mouseY < (B.position.y +B.r) && mouseY > (B.position.y - B.r)){
	moveB = true;
    }
    else if(mouseX > (C.position.x -C.r) && mouseX < (C.position.x + C.r) && mouseY < (C.position.y +C.r) && mouseY > (C.position.y - C.r)){
	moveC = true;
    }
    else if(mouseX > (target.position.x -target.r) && mouseX < (target.position.x + target.r) && mouseY < (target.position.y +target.r) && mouseY > (target.position.y - target.r)){
	moveTarget = true;
    }
}

function mouseReleased(){
    moveA = false;
    moveB = false;
    moveC = false;
    moveTarget = false;
}