// declare variables
$(document).ready(function () {
    var canvas = document.getElementById('canvas'),
        navBar = document.getElementById('navBar'),
        pen = document.getElementById('pen'),
        pencil = document.getElementById('pencil'),
        highlighter = document.getElementById('highlighter'),
        navBarWidth = navBar.offsetWidth,
        isMouseDown = false,
        ctx = canvas.getContext('2d'),
        penType = 0,
        mouse = {
            x: 0,
            y: 0,

            speedX: 0,
            speedY: 0,
            speed: 0,

            oldX: 0,
            oldY: 0,

            update: function () {
                this.speedX = Math.abs(this.x  - this.oldX);
                this.speedY = Math.abs(this.y - this.oldY);
                with (Math) {
                    this.speed += sqrt(pow(this.speedX,2) + pow(this.speedY,2)) / 3
                }
                this.oldX = this.x;
                this.oldY = this.y;
            }
        };
    canvas.width = document.documentElement.clientWidth - navBarWidth;
    canvas.height = window.innerHeight;

//add mouse functions

    canvas.addEventListener('mousedown', function (e) {
        if(e.which === 1 || e.which === 2) {
            //circle
            // ctx.beginPath();
            // ctx.fillStyle = colorValue;
            // ctx.arc(e.clientX - navBarWidth, e.clientY, rangeValue,0,Math.PI * 2);
            // ctx.fill();
            //coordinators change
            ctx.beginPath();
            ctx.moveTo(e.clientX - navBarWidth, e.clientY);
        }
        isMouseDown = true;
    });

    canvas.addEventListener('mouseup', function () {
        isMouseDown = false;
        ctx.beginPath();
    });

//add fix on mouseout

    canvas.addEventListener('mouseout', function () {
        isMouseDown = false;
        ctx.beginPath();
    });

//add painting function on lClick
    //add a pen

    pen.onclick = function () {
      penType = 0;
    };

    //add a pencil

    pencil.onclick = function () {
        penType = 1;
    };

    highlighter.onclick = function () {
        penType = 2;
    };

    function paintingLeft(e) {

        if(isMouseDown && e.which === 1) {

            ctx.strokeStyle = colorLeftValue;
            ctx.lineCap = "round";

            switch (penType) {
                case 0: {
                    ctx.lineWidth = rangeValue * 2;
                }
                break;
                case 1: {
                    canvas.onmousemove = function(e) {
                        mouse.x = e.clientX - navBarWidth;
                        mouse.y = e.clientY;
                    };
                    mouse.update();
                    ctx.lineWidth = (rangeValue / (mouse.speed / 100)) * 2;
                }
                break;
                case 2: {
                    ctx.lineJoin = 'round';
                    ctx.lineCap = "butt";
                    // ctx.globalAlpha = 0.5;
                    ctx.lineWidth = rangeValue * 2;
                    ctx.fillStyle = colorLeftValue;
                    console.log(ctx.strokeStyle);
                }
            }

            //line
            ctx.lineTo(e.clientX - navBarWidth, e.clientY );
            ctx.stroke();
            //circle
            ctx.fillStyle = colorLeftValue;
            ctx.beginPath();
            ctx.arc(e.clientX - navBarWidth, e.clientY, rangeValue,45,90);
            ctx.fill();
            //coordinators change
            ctx.beginPath();
            ctx.moveTo(e.clientX - navBarWidth, e.clientY);
        } else {mouse.speed = 0}
    }

    canvas.addEventListener('mousemove', paintingLeft);

//add display pen weight

    var range = document.querySelector('input[name=range]'),
        penWeight = document.getElementById('penWeight'),
        rangeValue = range.value;

    function weightChange() {
        rangeValue = range.value;
        penWeight.innerHTML = rangeValue;
    }

//add pen color
    var colorRight = document.querySelector('input[name=colorRight]'),
        colorLeft = document.querySelector('input[name=colorLeft]'),
        colorRightValue = colorRight.value,
        colorLeftValue = colorLeft.value;

    function colorChangeLeft() {
        colorLeftValue = colorLeft.value;
    }
    function colorChangeRight() {
        colorRightValue = colorRight.value;
    }

    range.addEventListener('mousemove', weightChange);
    colorLeft.addEventListener('change', colorChangeLeft);
    colorRight.addEventListener('change', colorChangeRight);
});


