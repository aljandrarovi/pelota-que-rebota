//alert("HOLA GENTE"); 
/*
Este es un codigo 
que hace que una 
pelota rebote en 
la pantalla.
*/
let posY = 150;
let velY= 0;


function setup() {
    createCanvas(windowWidth, windowHeight);
}
function draw() {
    background(0);
    fill(500, 100, 100);
    noStroke();
  circle(width/2, posY, 50);
  posY += velY;
  velY += 0.5;
  console.log(posY); 
  if(posY > height -25){
    velY *= -0.9;
  } 
}