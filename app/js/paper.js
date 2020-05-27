window.onload = function() {
    paper.install(window);
    paper.setup('canvas');
    var canvas = document.getElementById('canvas'),
        navBar = document.getElementById('navBar'),
        pen = document.getElementById('pen'),
        pencil = document.getElementById('pencil'),
        highlighter = document.getElementById('highlighter'),
        navBarWidth = navBar.offsetWidth,
        isMouseDown = false,
        tool = new Tool(),
        path,
        penType = 0;

    tool.minDistance = 10;
    tool.maxDistance = 45;

    tool.onMouseDown = function(e) {
        path = new Path();
        path.add(e.point);
    };

    // tool.onMouseUp = function() {
    //     path.simplify();
    // };

    //add fix on mouseout

    tool.onMouseDrag = function (e) {
        switch (penType) {
            case 0: {
                path.strokeColor = colorValue;
                path.strokeWidth = rangeValue;
                path.smooth();
                path.strokeCap = 'round';
                path.strokeJoin = 'round';
                path.add(e.point);
            }
                break;
            case 1: {

                path.fillColor = colorValue;

                let step = e.delta;
                step.x = Math.abs(step.x / 100 + Math.sqrt((rangeValue * rangeValue)/2));
                step.y = step.y / 100 + Math.sqrt((rangeValue * rangeValue)/2);
                step.angle = step.angle / 2;
                step.angle += 90;

                let top = e.middlePoint;
                let bottom = e.middlePoint;

                top.x = top.x + step.x;
                top.y = top.y + step.y;
                top.angle = top.angle + step.angle / 300;

                bottom.x = bottom.x - step.x;
                bottom.y = bottom.y - step.y;
                bottom.angle = bottom.angle - step.angle / 300;

                console.log('step.y====> ' + step.y);
                console.log(' step.x ===>' + step.x);

                path.add(bottom);
                path.insert(0, top);
                path.closed = true;
                path.smooth();


                tool.onMouseUp = function (event) {
                    path.add(event.point);
                    path.closed = true;
                    path.smooth();
                }
            }
                break;
            case 2: {

            }
        }
    };

    //add types of pens

    pen.onclick = function () {
        penType = 0;
    };

    pencil.onclick = function () {
        penType = 1;
    };

    highlighter.onclick = function () {
        penType = 2;
    };

    //add display pen weight

    var range = document.querySelector('input[name=range]'),
        penWeight = document.getElementById('penWeight'),
        rangeValue = range.value;

    function weightChange() {
        rangeValue = range.value;
        penWeight.innerHTML = rangeValue;
    }

//add pen color
    var color = document.querySelector('input[name=color]'),
        colorValue = color.value;

    function colorChange() {
        colorValue = color.value;
    }

    range.addEventListener('mousemove', weightChange);
    color.addEventListener('change', colorChange);
};
