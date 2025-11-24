class Particle {
    static color = "rgba(255, 0, 0, 0.5)";
    constructor(x, y, radius, mass = 1, dragCoeff = 0.1, initNoise = 0.01)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.mass = mass;
        this.dragCoeff = dragCoeff;
        
        this.vx = (Math.random() * 2 - 1) * initNoise;
        this.vy = (Math.random() * 2 - 1) * initNoise;

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
        ctxLogo.beginPath();
        ctxLogo.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctxLogo.fillStyle = Particle.color;
        ctxLogo.fill();
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
                // bndry.midX + bndry.rad * Math.cos(angle) - (i == 0 ? this.bndry.rad*0.125 : 0),
                bndry.midX + bndry.rad * Math.cos(angle) - Math.max(Math.cos(angle), 0.) * this.bndry.rad*0.125,
                bndry.midY + bndry.rad * Math.sin(angle),
                this.baseRad,
                1,
                0.1,
                this.bndry.rad * 0.001
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
        ctxLogo.beginPath();
        ctxLogo.lineWidth = 5;
        ctxLogo.lineCap = "round";
        ctxLogo.strokeStyle = "black";
        ctxLogo.moveTo(this.particles[0].x, this.particles[0].y);
        for (let i = 0; i < this.nParticles; i++){
            // ctxLogo.lineWidth = 0.5 * (this.particles[i].radius + this.particles[(i + 1) % this.nParticles].radius);
            var xc = 0.5 * (this.particles[i].x + this.particles[(i + 1) % this.nParticles].x);
            var yc = 0.5 * (this.particles[i].y + this.particles[(i + 1) % this.nParticles].y);
            ctxLogo.quadraticCurveTo(this.particles[i].x, this.particles[i].y, xc, yc);
            // ctxLogo.stroke();
        }
        
        ctxLogo.closePath();
        ctxLogo.stroke();
        // for (let s of this.springs) {
        //     ctxLogo.beginPath();
        //     ctxLogo.lineWidth = 1;
        //     ctxLogo.lineCap = "round";
        //     ctxLogo.moveTo(s.p1.x, s.p1.y);
        //     ctxLogo.lineTo(s.p2.x, s.p2.y);
        //     ctxLogo.strokeStyle = "black";
        //     ctxLogo.stroke();
        // }
        // for (let ac of this.angleConstraints) {
        //     ctxLogo.beginPath();
        //     ctxLogo.moveTo(ac.p1.x, ac.p1.y);
        //     ctxLogo.lineTo(ac.p3.x, ac.p3.y);
        //     ctxLogo.strokeStyle = "red";
        //     ctxLogo.stroke();
        // }
    }
}


var nParticles = 120;
var frameCt = 0;
var baseSmoothing = 0.008;

// Initialize particle system
pSystem = new ParticleSystem(nParticles, bndry, 1.0, 0.9, 0.00, 8., baseSmoothing);

logo.onload = () => {
    console.log(canvasLogo.height);
    ctxLogo.drawImage(logo, 0, 0, canvasLogo.width, canvasLogo.height);
    drawGenLogo1();
}

function shiftedTanh(startVal, endVal, t, t_offset = 10.)
{
    amp = endVal - startVal;
    return startVal + (Math.tanh(t - t_offset) * 0.5 + 0.5) * amp;
}

function drawGenLogo1()
{
    // Grow particle radii
    let maxRadAdd = shiftedTanh(1.0, 3.0, frameCt * 0.005, 2.5);
    // let maxRadAdd = shiftedTanh(0., 1., frameCt * 0.025, 2.5);
    // maxRadAdd = (1.0 - Math.cos(maxRadAdd));
    for (let i = 0; i < nParticles; i++) {
        let scaleGrad = Math.cos(2 * Math.PI * i / (nParticles-1)) * 0.5 + 0.5;
        // scaleGrad = 1.0 - Math.cos(Math.PI * scaleGrad);
        scaleGrad *= maxRadAdd;
        scaleGrad += 1.0;
        // let scaleGrad = 1.0 + maxRadAdd * (Math.cos(2 * Math.PI * i / (nParticles-1)) * 0.5 + 0.5);
        pSystem.particles[i].radius = pSystem.baseRad * scaleGrad;
        if (i > 0) {
            pSystem.springs[i-1].restLength = pSystem.particles[i-1].radius + pSystem.particles[i].radius;
        }
    }
    pSystem.springs[nParticles-1].restLength = pSystem.particles[nParticles-2].radius + pSystem.particles[nParticles-1].radius;

    // Modulate bending stiffness
    let maxBendScale = shiftedTanh(1., 4., frameCt * 0.025, 2.5);
    for (let ac in pSystem.angleConstraints) {
        ac.stiffness = pSystem.bendStiffness * maxBendScale;
    }

    // Modulate smoothing
    let maxSmoothScale = shiftedTanh(1., 10., frameCt * 0.025, 2.5);;
    pSystem.smoothing = maxSmoothScale * baseSmoothing;

    // Update particle system
    pSystem.update(0.18);

    // Clear canvasLogo
    ctxLogo.clearRect(0, 0, canvasLogo.width, canvasLogo.height);

    // ctxLogo.setTransform(
    //     canvasLogo.clientWidth / canvasLogo.width,
    //     0,
    //     0,
    //     canvasLogo.clientHeight / canvasLogo.height,
    //     0,
    //     0
    // );

    ctxLogo.drawImage(logo, 0, 0, canvasLogo.width, canvasLogo.height);
    // console.log(canvasLogo.height);
    ctxLogo.clearRect(bndry.midX-50, bndry.midY-50, 100, 100);

    // Update and display particle system
    pSystem.display();

    // Debug: Draw boundary
    // ctxLogo.beginPath();
    // ctxLogo.arc(bndry.midX, bndry.midY, bndry.rad, 0, Math.PI * 2);
    // ctxLogo.strokeStyle = "blue";
    // ctxLogo.stroke();
    // ctxLogo.closePath();

    // Update frame counter
    frameCt++;
}

genLogoInterval = setInterval(drawGenLogo1, 1);