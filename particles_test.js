//Initializing the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

class Particle {
    static color = "rgba(255, 0, 0, 0.5)";
    constructor(x, y, radius)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = (Math.random() * 2 - 1) * 0.1;
        this.vy = (Math.random() * 2 - 1) * 0.1;
    }

    update(){
        this.x += this.vx;
        this.y += this.vy;
    }

    display(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = Particle.color;
        ctx.fill();
    }
}

class Spring {
    constructor(p1, p2, k, restLength, damping)
    {
        this.p1 = p1;
        this.p2 = p2;
        this.k = k; //spring constant
        this.restLength = restLength;
        this.damping = damping;
    }

    update(){
        let dx = this.p2.x - this.p1.x;
        let dy = this.p2.y - this.p1.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let force = this.k * (dist - this.restLength);
        let fx = (dx / dist) * force;
        let fy = (dy / dist) * force;
        
        // Implement damping and apply forces to particles here
        this.p1.vx += fx * this.damping;
        this.p1.vy += fy * this.damping;
        this.p2.vx -= fx * this.damping;
        this.p2.vy -= fy * this.damping;
    }
}

class AngleConstraint {
    constructor(p1, p2, p3, targetAngle, stiffness)
    {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.targetAngle = targetAngle; // in radians
        this.stiffness = stiffness;
    }

    update(){
        // Calculate current angle
        let v1x = this.p1.x - this.p2.x;
        let v1y = this.p1.y - this.p2.y;
        let v2x = this.p3.x - this.p2.x;
        let v2y = this.p3.y - this.p2.y;
        let angle1 = Math.atan2(v1y, v1x);
        let angle2 = Math.atan2(v2y, v2x);
        let currentAngle = angle2 - angle1;
        if (currentAngle < -Math.PI) currentAngle += 2 * Math.PI;
        if (currentAngle > Math.PI) currentAngle -= 2 * Math.PI;
        let angleDiff = currentAngle - this.targetAngle;
        let correction = angleDiff * this.stiffness;
    
        // Apply corrections (simple approach)
        this.p1.vx -= correction * (v1x / Math.hypot(v1x, v1y));
        this.p1.vy -= correction * (v1y / Math.hypot(v1x, v1y));
        this.p3.vx += correction * (v2x / Math.hypot(v2x, v2y));
        this.p3.vy += correction * (v2y / Math.hypot(v2x, v2y));
    }
}

class ParticleSystem {
    constructor(nParticles, bndry, k=0.1, damping=0.9, bendStiffness=0.01){
        this.particles = [];
        this.springs = [];
        this.angleConstraints = [];
        this.nParticles = nParticles;
        this.bndry = bndry;

        this.baseRad = bndry.rad * Math.sin(Math.PI / nParticles);

        this.k = k;
        this.damping = damping;
        this.bendStiffness = bendStiffness;
        this.restLength = 2 * this.baseRad;

        // Initialize particles, springs, and angle constraints here
        for (let i = 0; i < nParticles; i++) {

            // Arrange particles in a circle
            let angle = (i / nParticles) * Math.PI * 2;
            let p = new Particle(
                bndry.midX + bndry.rad * Math.cos(angle),
                bndry.midY + bndry.rad * Math.sin(angle),
                this.baseRad
            );
            this.particles.push(p);

            // Connect particles with springs
            if (i > 0) {
                let s = new Spring(this.particles[i - 1], p, this.k, this.restLength, this.damping);
                this.springs.push(s);
            }

            // Add angle constraints
            if (i > 1) {
                let ac = new AngleConstraint(
                    this.particles[i - 2],
                    this.particles[i - 1],
                    p,
                    (2 * Math.PI) / nParticles,
                    this.bendStiffness
                );
                this.angleConstraints.push(ac);
            }
        }
        // Connect last and first particle
        let s = new Spring(this.particles[nParticles - 1], this.particles[0], this.k, this.restLength, this.damping);
        this.springs.push(s);
        let ac = new AngleConstraint(
            this.particles[nParticles - 2],
            this.particles[nParticles - 1],
            this.particles[0],
            (2 * Math.PI) / nParticles,
            this.bendStiffness
        );
        this.angleConstraints.push(ac);
        let ac2 = new AngleConstraint(
            this.particles[nParticles - 1],
            this.particles[0],
            this.particles[1],
            (2 * Math.PI) / nParticles,
            this.bendStiffness
        );
        this.angleConstraints.push(ac2);
    }

    update(){
        for (let s of this.springs) {
            s.update();
        }
        for (let ac of this.angleConstraints) {
            ac.update();
        }
        for (let p of this.particles) {
            p.update();
            // Boundary check
            let dx = p.x - bndry.midX;
            let dy = p.y - bndry.midY;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist + p.radius > bndry.rad) {
                let angle = Math.atan2(dy, dx);
                p.x = bndry.midX + (bndry.rad - p.radius) * Math.cos(angle);
                p.y = bndry.midY + (bndry.rad - p.radius) * Math.sin(angle);
                p.vx *= -0.5;
                p.vy *= -0.5;
            }
        }
    }

    display(){
        for (let p of this.particles) {
            p.display();
        }
        for (let s of this.springs) {
            ctx.beginPath();
            ctx.moveTo(s.p1.x, s.p1.y);
            ctx.lineTo(s.p2.x, s.p2.y);
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    }
}

// Circular boundary
let bndry = {
    midX: canvas.width / 2,
    midY: canvas.height / 2,
    rad: 0.9 *canvas.width / 2
}

var nParticles = 50;

// Initialize particle system
pSystem = new ParticleSystem(nParticles, bndry, 0.1, 0.9, 0.01);
console.log(pSystem);


function draw()
{
    pSystem.update();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and display particle system
    pSystem.display();

    // Debug: Draw boundary
    ctx.beginPath();
    ctx.arc(bndry.midX, bndry.midY, bndry.rad, 0, Math.PI * 2);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.closePath();
}

setInterval(draw, 30);