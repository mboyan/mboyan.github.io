//Initializing the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

class Particle {
    static color = "rgba(255, 0, 0, 0.5)";
    static initNoise = 0.01;
    constructor(x, y, radius, mass = 1, dragCoeff = 0.1)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.mass = mass;
        this.dragCoeff = dragCoeff;
        
        this.vx = (Math.random() * 2 - 1) * Particle.initNoise;
        this.vy = (Math.random() * 2 - 1) * Particle.initNoise;

        this.fx = 0; // force accumulator
        this.fy = 0;
    }

    applyForce(fx, fy) {
        this.fx += fx;
        this.fy += fy;
    }

    update(dt = 1){
        this.applyForce(-this.dragCoeff * this.vx, -this.dragCoeff * this.vy);

        // Compute acceleration
        let ax = this.fx / this.mass;
        let ay = this.fy / this.mass;

        // Integrate velocity
        this.vx += ax * dt;
        this.vy += ay * dt;

        // Integrate position
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Reset forces
        this.fx = 0;
        this.fy = 0;
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
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 1e-9) return; // guard against degenerate geometry

        let nx = dx / dist;
        let ny = dy / dist;

        // spring magnitude (positive when stretched)
        let springMag = this.k * (dist - this.restLength);

        // relative velocity along axis
        let dvx = this.p2.vx - this.p1.vx;
        let dvy = this.p2.vy - this.p1.vy;
        let relVel = dvx * nx + dvy * ny;

        // damping magnitude (positive if p2 is moving away from p1)
        let dampMag = this.damping * relVel;

        // net scalar force along axis
        let fMag = springMag + dampMag;

        // vector components
        let fx = fMag * nx;
        let fy = fMag * ny;

        this.p1.applyForce(fx, fy);
        this.p2.applyForce(-fx, -fy);
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

    update(dt = 1){
        // vectors from center (p2) to p1 and p3
        let v1x = this.p1.x - this.p2.x;
        let v1y = this.p1.y - this.p2.y;
        let v2x = this.p3.x - this.p2.x;
        let v2y = this.p3.y - this.p2.y;

        let len1 = Math.hypot(v1x, v1y);
        let len2 = Math.hypot(v2x, v2y);
        if (len1 < 1e-6 || len2 < 1e-6) return; // guard against degenerate geometry

        // let angle1 = Math.atan2(v1y, v1x);
        // let angle2 = Math.atan2(v2y, v2x);
        // let currentAngle = angle2 - angle1;
        // if (currentAngle < -Math.PI) currentAngle += 2 * Math.PI;
        // if (currentAngle > Math.PI) currentAngle -= 2 * Math.PI;

        // let angleDiff = currentAngle - this.targetAngle;
        // // wrap to [-pi, pi]
        // if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        // if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

        // // convert angle correction to forces along the perpendicular directions
        // // small factor to avoid very strong impulses; stiffness is usually small
        // let correction = angleDiff * this.stiffness;

        // // unit vectors
        // let n1x = v1x / len1, n1y = v1y / len1;
        // let n2x = v2x / len2, n2y = v2y / len2;

        // // Apply forces roughly proportional to correction and particle distance.
        // // These are simple heuristic forces that produce a torque-like effect.
        // // Scale by 1/dt so effect is stable across time steps.
        // let forceScale = correction / Math.max(dt, 1e-6);

        // // apply opposite-sign forces to p1 and p3; p2 gets reaction (equal + opposite)
        // // scale by small factor so it doesn't blow up
        // let f1x = -forceScale * n1y * 0.5; // perpendicular to n1 (rotate by -90°)
        // let f1y =  forceScale * n1x * 0.5;
        // let f3x =  forceScale * n2y * 0.5;  // perpendicular to n2 (rotate by +90°)
        // let f3y = -forceScale * n2x * 0.5;

        // // Apply forces (p2 gets reaction)
        // this.p1.applyForce(f1x, f1y);
        // this.p3.applyForce(f3x, f3y);
        // this.p2.applyForce(-(f1x + f3x), -(f1y + f3y));
        
        let n1x = v1x / len1, n1y = v1y / len1;
        let n2x = v2x / len2, n2y = v2y / len2;

        // signed angle difference
        let dot = n1x*n2x + n1y*n2y;
        let cross = n1x*n2y - n1y*n2x;
        let currentAngle = Math.atan2(cross, dot);
        let angleDiff = currentAngle - this.targetAngle;

        // torque magnitude
        let torque = -this.stiffness * angleDiff;

        // distribute torque into forces at p1, p3
        let f1x = torque * (-n1y);
        let f1y = torque * ( n1x);
        let f3x = torque * ( n2y);
        let f3y = torque * (-n2x);

        this.p1.applyForce(f1x, f1y);
        this.p3.applyForce(f3x, f3y);
        this.p2.applyForce(-(f1x+f3x), -(f1y+f3y));
    }
}

class ParticleSystem {
    
    constructor(nParticles, bndry, k=0.1, damping=0.9, bendStiffness=0.01, colStrength=0.1, smoothing=0.1){
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

        this.colStrength = colStrength;

        this.smoothing = smoothing;

        // Initialize particles, springs, and angle constraints here
        for (let i = 0; i < nParticles; i++) {

            // Arrange particles in a circle
            let angle = (i / nParticles) * Math.PI * 2;
            let p = new Particle(
                bndry.midX + bndry.rad * Math.cos(angle) - (i == 0 ? this.bndry.rad*0.125 : 0),
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
                    0.,//(2 * Math.PI) / nParticles,
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

    update(dt = 1){
        // Update springs
        for (let s of this.springs) s.update(dt);

        // Update angle constraints (still velocity-based for now)
        for (let ac of this.angleConstraints) ac.update(dt);

        // Collisions -> also forces
        for (let i = 0; i < this.nParticles; i++) {
            for (let j = i + 1; j < this.nParticles; j++) {
                let pi = this.particles[i];
                let pj = this.particles[j];

                let dx = pi.x - pj.x;
                let dy = pi.y - pj.y;
                let dist = Math.sqrt(dx * dx + dy * dy) || 1e-6;
                let overlap = pi.radius + pj.radius - dist;

                if (overlap > 0) {
                    let strength = this.colStrength * overlap * Math.tanh(overlap * 10.0);
                    let fx = strength * dx / dist;
                    let fy = strength * dy / dist;
                    pi.applyForce(fx, fy);
                    pj.applyForce(-fx, -fy);
                }
            }
        }

        // Integrate particle motion
        for (let p of this.particles) {
            p.update(dt);

            // Boundary check
            let dx = p.x - this.bndry.midX;
            let dy = p.y - this.bndry.midY;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist + p.radius > this.bndry.rad) {
                let angle = Math.atan2(dy, dx);
                p.x = this.bndry.midX + (this.bndry.rad - p.radius) * Math.cos(angle);
                p.y = this.bndry.midY + (this.bndry.rad - p.radius) * Math.sin(angle);

                // Reflect velocity (with loss)
                p.vx *= -0.5;
                p.vy *= -0.5;
            }
        }

        // Laplacian smoothing
        for (let i = 0; i < this.nParticles; i++) {
            let prevP = this.particles[(this.nParticles + i - 1) % this.nParticles];
            let nextP = this.particles[(i + 1) % this.nParticles];
            this.particles[i].x += this.smoothing * (0.5*(prevP.x + nextP.x) - this.particles[i].x)
            this.particles[i].y += this.smoothing * (0.5*(prevP.y + nextP.y) - this.particles[i].y)
        }
    }

    display(){
        // for (let p of this.particles) {
        //     p.display();
        // }
        for (let s of this.springs) {
            ctx.beginPath();
            ctx.lineWidth = 15;
            ctx.lineCap = "round";
            ctx.moveTo(s.p1.x, s.p1.y);
            ctx.lineTo(s.p2.x, s.p2.y);
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
        // for (let ac of this.angleConstraints) {
        //     ctx.beginPath();
        //     ctx.moveTo(ac.p1.x, ac.p1.y);
        //     ctx.lineTo(ac.p3.x, ac.p3.y);
        //     ctx.strokeStyle = "red";
        //     ctx.stroke();
        // }
    }
}

// Circular boundary
let bndry = {
    midX: canvas.width / 2,
    midY: canvas.height / 2,
    rad: 0.9 *canvas.width / 2
}

var nParticles = 100;
var frameCt = 0;
var baseSmoothing = 0.001;

// Initialize particle system
pSystem = new ParticleSystem(nParticles, bndry, 1., 0.9, 0.001, 8., baseSmoothing);

function shiftedTanh(startVal, endVal, t, t_offset = 10.)
{
    amp = endVal - startVal;
    return startVal + (Math.tanh(t - t_offset) * 0.5 + 0.5) * amp;
}

function draw()
{
    // Grow particle radii
    maxRadScale = shiftedTanh(1., 3., frameCt * 0.025, 2.5);
    for (let i = 0; i < nParticles; i++) {
        let scaleGrad = 1.0 + (maxRadScale - 1.0) * (Math.cos(2 * Math.PI * i / (nParticles-1)) * 0.5 + 0.5);
        pSystem.particles[i].radius = pSystem.baseRad * scaleGrad;
        if (i > 0) {
            pSystem.springs[i-1].restLength = pSystem.particles[i-1].radius + pSystem.particles[i].radius;
        }
    }
    pSystem.springs[nParticles-1].restLength = pSystem.particles[nParticles-2].radius + pSystem.particles[nParticles-1].radius;

    // Modulate bending stiffness
    maxBendScale = shiftedTanh(1., 4., frameCt * 0.025, 2.5);
    for (let ac in pSystem.angleConstraints) {
        ac.stiffness = pSystem.bendStiffness * maxBendScale;
    }

    // Modulate smoothing
    maxSmoothScale = shiftedTanh(1., 5., frameCt * 0.025, 5);;
    pSystem.smoothing = maxSmoothScale * baseSmoothing;

    // Update particle system
    pSystem.update(0.2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and display particle system
    pSystem.display();

    // Debug: Draw boundary
    // ctx.beginPath();
    // ctx.arc(bndry.midX, bndry.midY, bndry.rad, 0, Math.PI * 2);
    // ctx.strokeStyle = "blue";
    // ctx.stroke();
    // ctx.closePath();

    // Update frame counter
    frameCt++;
}

setInterval(draw, 30);