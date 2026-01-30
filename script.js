const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let speed = 6;
let baseSpeed = 6;
let score = 0;
let gameOver = false;

const roadLeft = canvas.width * 0.25;
const roadRight = canvas.width * 0.75;

const player = { x: canvas.width/2-30, y: canvas.height-160, w:60, h:110 };

let enemies = [];

function spawnEnemy(){
  let laneX = roadLeft + Math.random()*(roadRight-roadLeft-60);
  enemies.push({x:laneX, y:-120, w:60, h:110, counted:false});
}
setInterval(spawnEnemy, 1000);

function drawNature(){
  ctx.fillStyle="#1e90ff";
  ctx.fillRect(0,0,roadLeft,canvas.height);

  ctx.fillStyle="#228B22";
  for(let i=0;i<canvas.height;i+=80){
    ctx.fillRect(roadLeft-25,i,20,40);
  }
}

function drawRoad(){
  ctx.fillStyle="#444";
  ctx.fillRect(roadLeft,0,roadRight-roadLeft,canvas.height);

  ctx.strokeStyle="white";
  ctx.lineWidth=4;
  ctx.setLineDash([25,20]);
  ctx.beginPath();
  ctx.moveTo((roadLeft+roadRight)/2,0);
  ctx.lineTo((roadLeft+roadRight)/2,canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawCar(car,color,name=false){
  ctx.fillStyle="rgba(0,0,0,0.3)"; // shadow
  ctx.fillRect(car.x+5,car.y+10,car.w,car.h);

  ctx.fillStyle=color;
  ctx.fillRect(car.x,car.y,car.w,car.h);

  if(name){
    ctx.fillStyle="white";
    ctx.font="14px Arial";
    ctx.fillText("Jayan Kritik",car.x-5,car.y+car.h+15);
  }
}

function collide(a,b){
  return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;
}

function update(){
  if(gameOver) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawNature();
  drawRoad();
  drawCar(player,"black",true);

  enemies.forEach((e,i)=>{
    e.y+=speed;
    drawCar(e,"red");

    if(!e.counted && e.y>player.y+player.h){
      score++;
      document.getElementById("score").innerText=score;
      e.counted=true;
    }

    if(collide(player,e)) endGame();
    if(e.y>canvas.height) enemies.splice(i,1);
  });

  speed += 0.0005; // difficulty increase
  requestAnimationFrame(update);
}

function endGame(){
  gameOver=true;
  document.getElementById("gameOverScreen").style.display="flex";
  document.getElementById("finalScore").innerText=score;
}

function restartGame(){
  score=0;
  speed=baseSpeed;
  enemies=[];
  gameOver=false;
  document.getElementById("score").innerText=0;
  document.getElementById("gameOverScreen").style.display="none";
  update();
}

// CONTROLS
document.getElementById("left").ontouchstart=()=> player.x-=40;
document.getElementById("right").ontouchstart=()=> player.x+=40;
document.getElementById("speed").ontouchstart=()=> speed+=2;
document.getElementById("brake").ontouchstart=()=> speed=Math.max(4,speed-2);
document.getElementById("nitro").ontouchstart=()=> speed+=5;

update();
