/*
Este es un codigo que hace que un murcielago rebote por TODOS los
bordes de la pantalla. Cada tanto dice "boo" y de fondo suena una
ambientacion de Halloween. El fondo es un degradado de morado a negro.
Al mover el mouse, durante 10 segundos salen volando murcielagos como
un sistema de particulas.
*/

let pelota;
let aleteoPelota = 0;

// Sistema de particulas de murcielagos
let murcielagos = [];
let finVentana = 0; // 0 = la ventana de 10 seg todavia no empezo
let ultimoSpawn = 0;
const MAX_MURCIELAGOS = 220;
const DURACION_VENTANA = 10000; // 10 segundos

// Audios
let fondoA;
let fondoB;
let lamento;
let viento;
let oscBoo;
let envBoo;
let proximoBoo;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // HSB: facilita generar morados, violetas y negros.
  colorMode(HSB, 360, 100, 100, 1);

  pelota = {
    x: width / 2,
    y: height / 3,
    r: 45,
    vx: random(-7, 7),
    vy: random(-6, -2)
  };

  // ---- Ambientacion de Halloween ----
  // Drone grave con dos tonos levemente desafinados (produce latido).
  fondoA = new p5.Oscillator('sine');
  fondoA.freq(55);
  fondoA.amp(0.05);
  fondoA.start();

  fondoB = new p5.Oscillator('sine');
  fondoB.freq(55.7);
  fondoB.amp(0.045);
  fondoB.start();

  // Lamento ondulante (se le modula la frecuencia en draw).
  lamento = new p5.Oscillator('triangle');
  lamento.amp(0.03);
  lamento.start();

  // Viento: ruido marron suave.
  viento = new p5.Noise('brown');
  viento.amp(0.015);
  viento.start();

  // ---- "Boo" esporadico ----
  envBoo = new p5.Envelope();
  envBoo.setADSR(0.05, 0.35, 0.2, 0.6);
  envBoo.setRange(0.22, 0);

  oscBoo = new p5.Oscillator('sine');
  oscBoo.amp(envBoo);
  oscBoo.start();

  proximoBoo = 1500;
}

function draw() {
  dibujarFondo();

  // Ambiente: el lamento sube y baja lentamente.
  lamento.freq(map(sin(frameCount * 0.01), -1, 1, 220, 400));

  // Cada tanto, "boo".
  if (millis() > proximoBoo) {
    decirBoo();
    proximoBoo = millis() + random(3000, 7000);
  }

  // Si el cursor esta encima del murcielago, se detiene.
  let cursorEncima = dist(mouseX, mouseY, pelota.x, pelota.y) < pelota.r;

  if (!cursorEncima) {
    pelota.x += pelota.vx;
    pelota.y += pelota.vy;
    pelota.vy += 0.6; // gravedad

    // Limita la velocidad para que no se vuelva incontrolable.
    pelota.vx = constrain(pelota.vx, -24, 24);
    pelota.vy = constrain(pelota.vy, -26, 26);

    rebotarBordes();
  }

  aleteoPelota += 0.35;
  dibujarMurcielago(pelota.x, pelota.y, pelota.r);

  actualizarMurcielagos();
}

// ---- Fondo: degradado de morado a negro ----
function dibujarFondo() {
  let g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, '#3c096c');    // morado
  g.addColorStop(0.55, '#17032b'); // morado muy oscuro
  g.addColorStop(1, '#000000');    // negro
  drawingContext.fillStyle = g;
  drawingContext.fillRect(0, 0, width, height);
}

function rebotarBordes() {
  // En cada rebote la energia cambia al azar (a veces mucho,
  // a veces poco) y se suma un empujon, para que pique mas.
  let energia = random(0.95, 1.2);
  let empujon = random(-3, 3);

  if (pelota.y > height - pelota.r) {
    pelota.y = height - pelota.r;
    pelota.vy *= -energia;
    // Evita que el murcielago se quede quietecito en el piso.
    if (abs(pelota.vy) < 6) pelota.vy = -random(10, 17);
    pelota.vx += empujon;
  } else if (pelota.y < pelota.r) {
    pelota.y = pelota.r;
    pelota.vy *= -energia;
    pelota.vx += empujon;
  }

  if (pelota.x > width - pelota.r) {
    pelota.x = width - pelota.r;
    pelota.vx *= -energia;
  } else if (pelota.x < pelota.r) {
    pelota.x = pelota.r;
    pelota.vx *= -energia;
  }
}

// ---- Murcielago principal ----
function dibujarMurcielago(x, y, r) {
  push();
  translate(x, y);
  noStroke();

  // Resplandor violeta
  fill(275, 85, 100, 0.28);
  ellipse(0, 0, r * 3.4, r * 2.6);

  // Aleteo
  let flap = 0.85 + 0.15 * abs(sin(aleteoPelota));
  scale(flap, 1);

  // Alas (negro)
  fill(0, 0, 5);
  beginShape();
  vertex(-r * 0.2, -r * 0.1);
  vertex(-r * 1.6, -r * 0.9);
  vertex(-r * 1.2, -r * 0.1);
  vertex(-r * 1.7, r * 0.35);
  vertex(-r * 0.95, r * 0.15);
  vertex(-r * 0.9, r * 0.5);
  vertex(-r * 0.35, r * 0.2);
  endShape(CLOSE);

  beginShape();
  vertex(r * 0.2, -r * 0.1);
  vertex(r * 1.6, -r * 0.9);
  vertex(r * 1.2, -r * 0.1);
  vertex(r * 1.7, r * 0.35);
  vertex(r * 0.95, r * 0.15);
  vertex(r * 0.9, r * 0.5);
  vertex(r * 0.35, r * 0.2);
  endShape(CLOSE);

  // Cuerpo y cabeza
  ellipse(0, r * 0.1, r * 0.9, r * 1.15);
  ellipse(0, -r * 0.45, r * 0.8, r * 0.7);

  // Orejas
  triangle(-r * 0.34, -r * 0.65, -r * 0.1, -r * 0.6, -r * 0.28, -r * 1.05);
  triangle(r * 0.34, -r * 0.65, r * 0.1, -r * 0.6, r * 0.28, -r * 1.05);

  // Ojos violeta
  fill(275, 90, 100);
  circle(-r * 0.17, -r * 0.45, r * 0.16);
  circle(r * 0.17, -r * 0.45, r * 0.16);

  pop();
}

// ---- Particulas de murcielagos ----
function actualizarMurcielagos() {
  for (let i = murcielagos.length - 1; i >= 0; i--) {
    let m = murcielagos[i];
    m.x += m.vx;
    m.y += m.vy;
    m.vx *= 0.99;
    m.vy = m.vy * 0.99 + 0.05; // deriva con una leve caida
    m.rot = atan2(m.vy, m.vx);
    m.aleteo += 0.35;
    m.vida -= m.decaimiento;

    if (m.vida <= 0) {
      murcielagos.splice(i, 1);
    } else {
      dibujarMurcielagoParticula(m);
    }
  }
}

function spawnMurcielago(x, y) {
  let ang = random(TWO_PI);
  let vel = random(2, 7);
  murcielagos.push({
    x: x,
    y: y,
    vx: cos(ang) * vel,
    vy: sin(ang) * vel - random(0, 2), // tienden a volar hacia arriba
    r: random(7, 16),
    rot: ang,
    vida: 255,
    decaimiento: random(2, 4.5),
    aleteo: random(TWO_PI)
  });
}

function dibujarMurcielagoParticula(m) {
  let a = m.vida / 255;
  push();
  translate(m.x, m.y);
  rotate(m.rot + HALF_PI);
  let flap = 0.82 + 0.18 * abs(sin(m.aleteo)); // aleteo
  scale(flap, 1);
  noStroke();

  fill(275, 90, 20, a); // violeta oscuro
  beginShape();
  vertex(-m.r * 0.2, -m.r * 0.1);
  vertex(-m.r * 1.6, -m.r * 0.9);
  vertex(-m.r * 1.2, -m.r * 0.1);
  vertex(-m.r * 1.7, m.r * 0.35);
  vertex(-m.r * 0.95, m.r * 0.15);
  vertex(-m.r * 0.9, m.r * 0.5);
  vertex(-m.r * 0.35, m.r * 0.2);
  endShape(CLOSE);

  beginShape();
  vertex(m.r * 0.2, -m.r * 0.1);
  vertex(m.r * 1.6, -m.r * 0.9);
  vertex(m.r * 1.2, -m.r * 0.1);
  vertex(m.r * 1.7, m.r * 0.35);
  vertex(m.r * 0.95, m.r * 0.15);
  vertex(m.r * 0.9, m.r * 0.5);
  vertex(m.r * 0.35, m.r * 0.2);
  endShape(CLOSE);

  ellipse(0, m.r * 0.1, m.r * 0.9, m.r * 1.15);
  ellipse(0, -m.r * 0.45, m.r * 0.8, m.r * 0.7);
  triangle(-m.r * 0.34, -m.r * 0.65, -m.r * 0.1, -m.r * 0.6, -m.r * 0.28, -m.r * 1.05);
  triangle(m.r * 0.34, -m.r * 0.65, m.r * 0.1, -m.r * 0.6, m.r * 0.28, -m.r * 1.05);

  fill(275, 90, 100, a); // ojos violeta claro
  circle(-m.r * 0.17, -m.r * 0.45, m.r * 0.16);
  circle(m.r * 0.17, -m.r * 0.45, m.r * 0.16);

  pop();
}

// ---- "Boo" esporadico ----
function decirBoo() {
  let base = random(150, 220);
  oscBoo.freq(base * 1.6, 0.05);
  oscBoo.freq(base, 0.7);
  envBoo.play();
}

// Al mover el mouse, durante 10 segundos salen murcielagos volando.
function mouseMoved() {
  if (finVentana === 0) finVentana = millis() + DURACION_VENTANA;
  if (millis() >= finVentana) return;
  if (millis() - ultimoSpawn < 25) return;
  ultimoSpawn = millis();

  let n = floor(random(1, 3));
  for (let i = 0; i < n; i++) {
    if (murcielagos.length < MAX_MURCIELAGOS) spawnMurcielago(mouseX, mouseY);
  }
}

// El navegador necesita un gesto del usuario para habilitar el audio.
function mousePressed() {
  userStartAudio();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
