let title
let passwordInput;
let entropyBar;
let particleSystem = [];
let crackTimeText = "";
let passwordStrength = 0;
let backgroundColor;
let shakeAmount = 0;
let showComic = true;
let comicImg;
let comicHoverText = "To anyone who understands information theory and security and is in an infuriating argument with someone who does not (possibly involving mixed case), I sincerely apologize.";

// Password analysis variables
let charSets = {
  lowercase: 26,
  uppercase: 26,
  numbers: 10,
  symbols: 32
};

function preload() {
  // Load the XKCD comic image
  comicImg = loadImage('password_strength.png');
  // comicImg = loadImage('https://imgs.xkcd.com/comics/password_strength.png');
}

function setup() {
  createCanvas(800, 600);
  
  // Create input field & title
  passwordInput = createInput('');
  title = createP('Password Strength Visualizer');
  
  backgroundColor = color(20, 20, 30);
  
  // Initialize some particles
  for (let i = 0; i < 50; i++) {
    particleSystem.push(new SecurityParticle(random(width), random(height)));
  }
}

function draw() {
  background(backgroundColor);
  
  if (showComic) {
    title.hide();
    passwordInput.hide();
    drawComicOverlay();
    return;
  } else {
  
    // Display Input
    passwordInput.show();
    passwordInput.position(50, 50);
    passwordInput.size(300, 30);
    passwordInput.input(analyzePassword);

    // Display title
    fill(255);
    title.show();
    title.position(50, 5);
    title.style('font-size', '24px');
    title.style('font-weight', 'bold');
    title.style('color', '#00FF00');

    // Apply screen shake for weak passwords
    if (shakeAmount > 0) {
      translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount));
      shakeAmount *= 0.95;
    }
  }
  
  // Draw entropy bar
  drawEntropyBar();
  
  // Update and display particles
  updateParticles();
  
  // Display crack time and advice
  displayPasswordInfo();
  
  // Draw visual metaphors
  drawPasswordMetaphors();
}

function analyzePassword() {
  let password = passwordInput.value();
  
  if (password.length === 0) {
    passwordStrength = 0;
    crackTimeText = "Enter a password to see its strength";
    backgroundColor = color(20, 20, 30);
    return;
  }
  
  // Calculate character set size
  let charSetSize = 0;
  if (/[a-z]/.test(password)) charSetSize += charSets.lowercase;
  if (/[A-Z]/.test(password)) charSetSize += charSets.uppercase;
  if (/[0-9]/.test(password)) charSetSize += charSets.numbers;
  if (/[^a-zA-Z0-9]/.test(password)) charSetSize += charSets.symbols;
  
  // Calculate entropy (bits)
  let entropy = password.length * Math.log2(charSetSize);
  passwordStrength = map(entropy, 0, 100, 0, 1);
  passwordStrength = constrain(passwordStrength, 0, 1);
  
  // Estimate crack time
  let combinations = Math.pow(charSetSize, password.length);
  let crackTime = combinations / (2 * 1000000000); // Assume 1 billion guesses/sec
  
  // Format crack time
  if (crackTime < 1) {
    crackTimeText = "Instantly crackable!";
    backgroundColor = color(100, 20, 20);
    shakeAmount = 5;
  } else if (crackTime < 3600) {
    crackTimeText = `${Math.round(crackTime)} seconds to crack`;
    backgroundColor = color(80, 40, 20);
    shakeAmount = 3;
  } else if (crackTime < 86400) {
    crackTimeText = `${Math.round(crackTime/3600)} hours to crack`;
    backgroundColor = color(60, 60, 20);
    shakeAmount = 1;
  } else if (crackTime < 31536000) {
    crackTimeText = `${Math.round(crackTime/86400)} days to crack`;
    backgroundColor = color(40, 60, 40);
  } else {
    crackTimeText = `${Math.round(crackTime/31536000)} years to crack`;
    backgroundColor = color(20, 60, 20);
  }
  
  // Update particle system based on strength
  adjustParticles();
}

function drawEntropyBar() {
  // Entropy bar background
  fill(50);
  rect(50, 120, 300, 30);
  
  // Entropy bar fill
  let barColor = lerpColor(color(255, 0, 0), color(0, 255, 0), passwordStrength);
  fill(barColor);
  rect(50, 120, 300 * passwordStrength, 30);
  
  // Entropy bar label
  fill(255);
  textAlign(LEFT);
  text("Password Strength", 50, 115);
  text(`${Math.round(passwordStrength * 100)}%`, 360, 140);
}

function updateParticles() {
  for (let particle of particleSystem) {
    particle.update();
    particle.display();
  }
}

function adjustParticles() {
  // Adjust particle behavior based on password strength
  for (let particle of particleSystem) {
    particle.strength = passwordStrength;
    if (passwordStrength < 0.3) {
      particle.vulnerable = true;
    } else {
      particle.vulnerable = false;
    }
  }
}

function displayPasswordInfo() {
  fill(255);
  textAlign(LEFT);
  textSize(16);
  text(crackTimeText, 50, 200);
  
  // Display tips
  textSize(12);
  text("Tips for stronger passwords:", 50, 240);
  text("• Use 4+ random words (correct horse battery staple)", 50, 260);
  text("• Mix uppercase, lowercase, numbers, and symbols", 50, 280);
  text("• Avoid single dictionary words to avoid rainbow tables", 50, 300 );
  text("• Avoid including personal information", 50, 320);
  text("• Length matters more than complexity", 50, 340);
}

function drawPasswordMetaphors() {
  // Draw a lock that gets stronger with better passwords
  push();
  translate(500, 200);
  
  // Lock body
  let lockColor = lerpColor(color(255, 100, 100), color(100, 255, 100), passwordStrength);
  fill(lockColor);
  rect(-30, -20, 60, 40, 5);
  
  // Lock shackle
  noFill();
  stroke(lockColor);
  strokeWeight(5);
  arc(0, -20, 40, 40, PI, TWO_PI);
  
  // Keyhole
  fill(0);
  circle(0, -5, 8);
  rect(-2, -5, 4, 10);
  
  pop();
  
  // Draw security shields that multiply with strength
  let shieldCount = Math.floor(passwordStrength * 5) + 1;
  for (let i = 0; i < shieldCount; i++) {
    push();
    translate(550 + i * 15, 300);
    fill(100, 150, 255, 150);
    beginShape();
    vertex(0, -15);
    vertex(10, -5);
    vertex(10, 10);
    vertex(0, 20);
    vertex(-10, 10);
    vertex(-10, -5);
    endShape(CLOSE);
    pop();
  }
}

function drawClickInstruction() {
  push();
  fill(255, 255, 255, 100);
  textAlign(RIGHT);
  textSize(12);
  text("Click to view original XKCD comic", width - 20, height - 20);
  pop();
}

function drawComicOverlay() {
  // Dark overlay background
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);
  
  // Center the comic image
  if (comicImg) {
    let imgWidth = comicImg.width;
    let imgHeight = comicImg.height;
    
    // Scale image to fit screen while maintaining aspect ratio
    let scale = min(width * 0.8 / imgWidth, (height * 0.7) / imgHeight);
    let scaledWidth = imgWidth * scale;
    let scaledHeight = imgHeight * scale;
    
    let x = (width - scaledWidth) / 2;
    let y = (height - scaledHeight) / 2 - 30; // Move up to make room for hover text
    
    // White background for comic
    fill(255);
    rect(x - 10, y - 10, scaledWidth + 20, scaledHeight + 20);
    
    // Draw the comic
    image(comicImg, x, y, scaledWidth, scaledHeight);
    
    // Display hover text below the comic
    fill(255);
    textAlign(CENTER);
    textSize(12);
    let textY = y + scaledHeight + 40;
    
    // Word wrap the hover text
    let words = comicHoverText.split(' ');
    let line = '';
    let lineHeight = 16;
    
    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + ' ';
      let testWidth = textWidth(testLine);
      
      if (testWidth > scaledWidth && i > 0) {
        text(line, width/2, textY);
        line = words[i] + ' ';
        textY += lineHeight;
      } else {
        line = testLine;
      }
    }
    text(line, width/2, textY);
    
  } else {
    // Fallback text if image fails to load
    fill(255);
    textAlign(CENTER);
    textSize(16);
    text("XKCD Comic #936: Password Strength", width/2, height/2 - 20);
    text("Image loading failed - visit https://xkcd.com/936/", width/2, height/2 + 20);
  }
  
  // Close instruction
  fill(255);
  textAlign(CENTER);
  textSize(14);
  text("Click anywhere to close", width/2, height - 30);
}

function doubleClicked() {
  showComic = !showComic;
}

class SecurityParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.size = random(2, 6);
    this.strength = 0;
    this.vulnerable = false;
    this.alpha = 255;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
    
    // Vulnerable particles move erratically
    if (this.vulnerable) {
      this.vx += random(-0.5, 0.5);
      this.vy += random(-0.5, 0.5);
      this.alpha = 100 + 50 * sin(millis() * 0.01);
    } else {
      this.alpha = 255;
    }
    
    // Constrain velocity
    this.vx = constrain(this.vx, -3, 3);
    this.vy = constrain(this.vy, -3, 3);
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    if (this.vulnerable) {
      fill(255, 0, 0, this.alpha);
    } else {
      fill(0, 255, 0, this.alpha);
    }
    
    noStroke();
    circle(0, 0, this.size);
    
    // Draw connection lines for strong passwords
    if (this.strength > 0.5) {
      stroke(0, 255, 0, 50);
      for (let other of particleSystem) {
        let d = dist(this.x, this.y, other.x, other.y);
        if (d < 50 && other !== this) {
          line(0, 0, other.x - this.x, other.y - this.y);
        }
      }
    }
    
    pop();
  }
}