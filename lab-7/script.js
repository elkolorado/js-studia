// new canvas class

class Canvas {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.distance = 100;
        this.dots = [];
        document.body.appendChild(this.canvas);
        this.dotsControl();
        this.distanceControl();
        this.gravityControl();
        this.createDots(50);
        this.canvas.addEventListener('click', (event) => this.handleClick(event));

        this.mouseX = 0;
        this.mouseY = 0;

        // Gravity
        this.gravityForce = 2;
        this.gravityRadius = 100;

        this.gain = 0.1;
        
        this.canvas.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });

        
    }




    drawGravityTooltip() {
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, this.gravityRadius, 0, Math.PI * 2, false);
        this.ctx.strokeStyle = 'green';
        //fill style for gravity tooltip to be radial opacity gradient basing on force

        let gradient = this.ctx.createRadialGradient(this.mouseX, this.mouseY, 0, this.mouseX, this.mouseY, this.gravityRadius);
        gradient.addColorStop(0, `rgba(0, 255, 0, ${this.gravityForce / 10})`);
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        
        this.ctx.stroke();
    }

    setDimensions(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    setStyles(styles) {
        Object.assign(this.canvas.style, styles);
    }

    setContextStyles(styles) {
        Object.assign(this.ctx, styles);
    }

    drawDot(dot) {
        if(dot.radius <= 0) {
            this.removeDot(dot);
            return;
        }
        this.ctx.beginPath();
        this.ctx.arc(dot.x + dot.radius, dot.y + dot.radius, dot.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = dot.color;
        this.ctx.fill();
    }

    updateCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.dots.forEach(dot => {
            dot.move();
            this.drawDot(dot);
        });

        this.applyGravity(this.mouseX, this.mouseY);
        this.checkDistance();
        this.drawGravityTooltip();

        requestAnimationFrame(() => this.updateCanvas());
    }

    checkDistance() {
        const dots = this.dots;
        for (let index = 0; index < dots.length; index++) {
            const dot = dots[index];
            for (let i = index + 1; i < dots.length; i++) {
                const otherDot = dots[i];
                const dotDistance = Math.sqrt((dot.x - otherDot.x) ** 2 + (dot.y - otherDot.y) ** 2);

                // Draw line if distance is 50px
                if (dotDistance <= this.distance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(dot.x + dot.radius, dot.y + dot.radius);
                    this.ctx.lineTo(otherDot.x + otherDot.radius, otherDot.y + otherDot.radius);
                    this.ctx.strokeStyle = 'blue';
                    this.ctx.stroke();
                    // the dot with larger radius graduatly reduces the other dot's radius
                    if (dot.radius > otherDot.radius) {
                        otherDot.radius -= this.gain;
                        dot.radius += this.gain;
                    } else {
                        dot.radius -= this.gain;
                        otherDot.radius += this.gain;
                    }

                }

            }
        }

    }

    // distance control input
    distanceControl() {
        let distance = document.createElement('input');
        distance.type = 'number';
        distance.min = 0;
        distance.max = Math.min(this.canvas.width, this.canvas.height);
        distance.value = this.distance;
        distance.addEventListener('input', () => {
            this.distance = distance.value;
        });
        document.body.appendChild(distance);
    }

    dotsControl() {
        let dots = document.createElement('input');
        dots.type = 'number';
        dots.min = 0;
        dots.max = 1000;
        dots.value = 50;
        dots.addEventListener('input', () => {
            const amount = dots.value;
            const currentAmount = this.dots.length;
            if (amount > currentAmount) {
                for (let i = currentAmount; i < amount; i++) {
                    this.addNewDot();
                }
            } else if (amount < currentAmount) {
                this.dots.splice(amount);
            }
        });
        document.body.appendChild(dots);
    }

    createDots(amount) {
        this.dots = [];
        for (let i = 0; i < amount; i++) {
            this.addNewDot();
        }
    }

    addNewDot() {
        this.dots.push(new Dot(
            Math.random() * this.canvas.width,
            Math.random() * this.canvas.height,
            5,
            //random color for each dot
            `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
        ));
    }

    removeDot(dot) {
        this.dots = this.dots.filter(d => d !== dot);

        //add two new dots
        // this.addNewDot();
        // this.addNewDot();
    }

    handleClick(event) {
        const clickX = event.clientX - this.canvas.offsetLeft;
        const clickY = event.clientY - this.canvas.offsetTop;
        const clickedDot = this.dots.find(dot => {
            const dotX = dot.x + dot.radius;
            const dotY = dot.y + dot.radius;
            const distance = Math.sqrt((clickX - dotX) ** 2 + (clickY - dotY) ** 2);
            return distance <= dot.radius;
        });
        if (clickedDot) {
            this.removeDot(clickedDot);
            // this.updateCanvas();
        }
    }

    applyGravity(cursorX, cursorY) {
        console.log(cursorX, this.canvas.width, cursorY, this.canvas.height)
        //if cursor is not on canvas, return
        if (cursorX < 0 || cursorX > this.canvas.width || cursorY < 0 || cursorY > this.canvas.height) {
            return;
        }
        const gravityRadius = this.gravityRadius;
        const gravityForce = this.gravityForce;

        this.dots.forEach(dot => {
            const distance = Math.sqrt((cursorX - dot.x) ** 2 + (cursorY - dot.y) ** 2);
            if (distance <= gravityRadius) {
                const directionX = (cursorX - dot.x) / distance;
                const directionY = (cursorY - dot.y) / distance;
                dot.x += directionX * gravityForce;
                dot.y += directionY * gravityForce;
            }
        });

        // this.updateCanvas();
    }

    gravityControl() {
        let gravityForce = document.createElement('input');
        gravityForce.type = 'number';
        gravityForce.min = 0;
        gravityForce.max = 3;
        gravityForce.value = this.gravityForce;
        gravityForce.addEventListener('input', () => {
            this.gravityForce = gravityForce.value;
        });
        document.body.appendChild(gravityForce);
    
    }
    

}

// dot class

class Dot {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 25 + 5;
        this.color = color;
        this.seed = Math.random() * Math.PI * 2;
        this.newtons = 0 ;
        this.velocity = 0;
        this.mass = 1;
    }

    move() {
        let speed = 1 * this.radius / 100; // Adjust the speed as needed
        let directionX = Math.cos(this.seed);
        let directionY = Math.sin(this.seed);
        let velocityX = speed * directionX;
        let velocityY = speed * directionY;
        this.x += velocityX;
        this.y += velocityY;

        this.velocity = Math.sqrt(velocityX ** 2 + velocityY ** 2);
        this.mass = this.radius;
        this.newtons = this.x * this.velocity + this.y * this.mass;
        console.log(this.newtons);

        // Bounce off the edges of the canvas, making sure the x,y coordinates are html element coordinates and not canvas coordinates
        if (this.x < 0 || this.x > canvas.canvas.width) {
            this.seed = Math.random() * Math.PI * 2;
        }
        if (this.y < 0 || this.y > canvas.canvas.height) {
            this.seed = Math.random() * Math.PI * 2;
        }
    }
}

// draw canvas and dot

const canvas = new Canvas();
canvas.setDimensions(800, 600);
canvas.setStyles({
    border: '1px solid black'
});
canvas.setContextStyles({
    fillStyle: 'red'
});



let dots = [];
for (let i = 0; i < canvas.dots; i++) {
    dots.push(new Dot(
        Math.random() * canvas.canvas.width,
        Math.random() * canvas.canvas.height,
        5,
        'red'
    ));
}

canvas.updateCanvas(dots)
