window.onload = function() {

// add variables

    var canvasJS = document.getElementById('canvas'),
        navBar = document.getElementById('navBar'),
        buttons = document.getElementsByClassName('button'),
        selectable = document.getElementsByClassName('selectable'),
        toggleable = document.getElementsByClassName('toggleable'),
        textToggle = document.getElementsByClassName('textToggle'),
        color = document.querySelector('input[name=color]'),
        shadowColor = document.querySelector('input[name=shadowColor]'),
        range = document.querySelector('input[name=range]'),
        shadowRange = document.querySelector('input[name=shadowWeight]'),
        shadowRangeHTML = document.getElementById('shadowWeight'),
        shadowOffset = document.querySelector('input[name=shadowOffset]'),
        shadowOffsetHTML = document.getElementById('shadowOffset'),
        penWeight = document.getElementById('penWeight'),
        fontFamily = document.getElementById('fontFamily'),
        textWeight = document.getElementById('textWeight'),
        navBarWidth = navBar.offsetWidth,
        arrDelObjects = [],
        fill = false,
        moveMod = false,
        bold = false,
        italic = false;

// add canvas settings

    canvasJS.width = window.innerWidth - navBarWidth;
    canvasJS.height = window.innerHeight;

// add fabric variables

    var canvas = new fabric.Canvas('canvas', {isDrawingMode: true});

    canvas.hoverCursor = 'default';

//add function for canvas settings

    function freeBrush() {
        canvas.freeDrawingBrush.color = color.value;
        canvas.freeDrawingBrush.width = parseInt(range.value, 10) || 5;
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: parseInt(shadowRange.value, 10) || 0,
            offsetX: parseInt(shadowOffset.value, 10) || 0,
            offsetY: parseInt(shadowOffset.value, 10) || 0,
            affectStroke: true,
            color: shadowColor.value,
        });
    }
    freeBrush();

// add vline brush

    var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function () {

        var patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = 5;
        var ctx = patternCanvas.getContext('2d');

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.lineTo(10, 5);
        ctx.closePath();
        ctx.stroke();

        return patternCanvas;
    };

//add function on add shadow

    function shadow(type) {
        type.setShadow({
            blur: parseInt(shadowRange.value, 10) || 0,
            color: shadowColor.value,
            offsetX: parseInt(shadowOffset.value, 10) || 0,
            offsetY: parseInt(shadowOffset.value, 10) || 0,
        });
    }

//add function on moveMode

    function moveModeF() {
        if (!moveMod) {
            unselect();
            canvas.selection = false;
        }
    }

//add function for unselectable

    function unselect() {
        if (canvas.getObjects().length !== 0) {
            for (let item of canvas.getObjects()) {
                item.set('selectable', false);
            }
        }
    }

//add clear all select function

function clearSelect() {
    for (let item of buttons) {
        item.classList.remove('selected');
    }
}

//add cleaning function of arrDelObjects on mouse up

    canvas.on('mouse:up', function () {
        arrDelObjects = [];
    });

//add fill on objects

    canvas.on('mouse:down', function (e) {
        if(fill) {
            if(e.target !== null) {
                e.target.set({
                    fill: color.value,
                })
            } else {
                canvas.backgroundColor = color.value;
            }
            canvas.renderAll()
        }
    });


//add toggle on buttons

    for (let item of textToggle) {
        item.addEventListener('click', toggleableFunctionText)
    }

    function toggleableFunctionText() {
        if(canvas.getActiveObject().type === 'textbox') {
            this.classList.toggle('selected');
        }
    }

    for (let item of toggleable) {
        item.addEventListener('click', toggleableFunction)
    }

    function toggleableFunction() {
        this.classList.toggle('selected');
    }

//add select on buttons

    for (let item of selectable) {
        item.addEventListener('click', selectableFunction)
    }

    function selectableFunction() {
        moveMod = false;
        clearSelect();
        this.classList.add('selected');
        for (let item of selectable) {
            if (this.classList.contains('selected')) {
                item.classList.remove('selected');
                this.classList.add('selected');
            }
        }
    }

// add types of brushes

    for (let item of buttons) {
        item.addEventListener('click', changeButton)
    }

    function changeButton() {
        canvas.isDrawingMode = true;
        fill = false;
        switch (this.value) {
            case "0": {
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            }
            break;
            case "1": {
                canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
            }
            break;
            case "2": {
                canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
            }
            break;
            case "3": {
                canvas.freeDrawingBrush = new fabric.PatternBrush(canvas);
            }
            break;
            case "4": {
                canvas.freeDrawingBrush = vLinePatternBrush;
            }
            break;
            case "undo": {
                if (moveMod) {
                    canvas.isDrawingMode = false;
                }
                if (canvas.getObjects().length !== 0) {
                    arrDelObjects.push(canvas.item(canvas.getObjects().length - 1));
                    canvas.remove(canvas.item(canvas.getObjects().length - 1));
                }
            }
            break;
            case "redo": {
                if (moveMod) {
                    canvas.isDrawingMode = false;
                }
                if (arrDelObjects.length !== 0) {
                    canvas.add(arrDelObjects[arrDelObjects.length - 1]);
                    arrDelObjects.pop();
                }
            }
            break;
            case "circle": {
                clearSelect();
                moveModeF();
                canvas.isDrawingMode = false;
                let circle = new fabric.Circle({
                    radius: 60,
                    fill: 'rgba(255,255,255, 0)',
                    left: 40,
                    top: 40,
                    stroke: color.value,
                    strokeWidth: +range.value,
                });
                shadow(circle);
                canvas.add(circle).setActiveObject(circle);
            }
            break;
            case "line": {
                clearSelect();
                moveModeF();
                canvas.isDrawingMode = false;
                let coords = ([50, 50, 200, 50]);
                let line = new fabric.Line(coords, {
                    stroke: color.value,
                    strokeWidth: +range.value,
                });
                shadow(line);
                canvas.add(line).setActiveObject(line);
            }
            break;
            case "square": {
                clearSelect();
                moveModeF();
                canvas.isDrawingMode = false;
                let square = new fabric.Rect({
                    width: 60,
                    height: 60,
                    fill: 'rgba(255,255,255, 0)',
                    left: 50,
                    top: 50,
                    stroke: color.value,
                    strokeWidth: +range.value,
                });
                shadow(square);
                canvas.add(square).setActiveObject(square);
            }
            break;
            case "triangle": {
                clearSelect();
                moveModeF();
                canvas.isDrawingMode = false;
                let triangle = new fabric.Triangle({
                    width: 60,
                    height: 60,
                    fill: 'rgba(255,255,255, 0)',
                    left: 50,
                    top: 50,
                    stroke: color.value,
                    strokeWidth: +range.value,
                });
                shadow(triangle);
                canvas.add(triangle).setActiveObject(triangle);
            }
            break;
            case "fill": {
                moveModeF();
                fill = true;
                canvas.isDrawingMode = false;
            }
            break;
            case "clear": {
                clearSelect();
                for (let item of buttons) {
                    if(item.value === '0') {
                        item.classList.add('selected');
                    }
                }
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                canvas.clear();
            }
            break;
            case "moveMod": {
                moveMod = !moveMod;
                if (moveMod) {
                    canvas.isDrawingMode = false;
                    if (canvas.getObjects().length !== 0) {
                        for (let item of canvas.getObjects()) {
                            item.set('selectable', true);
                        }
                    }
                }  else {
                    unselect();
                    canvas.isDrawingMode = true;
                }
            }
            break;
            case "text": {
                clearSelect();
                moveModeF();
                canvas.isDrawingMode = false;
                let textBox = new fabric.Textbox('Твой текст', {
                    left: 50,
                    top: 50,
                    width: 150,
                    fontSize: +textWeight.value
                });
                canvas.add(textBox).setActiveObject(textBox);
            }
            break;
            case "bold": {
                if(canvas.getActiveObject().type === 'textbox') {
                    moveModeF();
                    canvas.isDrawingMode = false;
                    bold = !bold;
                    if (!bold) {
                        lastObj('fontWeight', 'normal');
                    } else {
                        lastObj('fontWeight', 'bold');
                    }
                }
            }
            break;
            case "italic": {
                if(canvas.getActiveObject().type === 'textbox') {
                    moveModeF();
                    canvas.isDrawingMode = false;
                    italic = !italic;
                    if (!italic) {
                        lastObj('fontStyle', 'normal');
                    } else {
                        lastObj('fontStyle', 'italic');
                    }
                }
            }
            break;
        }
        freeBrush();
    }

//add active object settings

    function lastShadow() {
        if (!!canvas.getActiveObject()) {
            canvas.getActiveObject().setShadow({
                blur: parseInt(shadowRange.value, 10) || 0,
                color: shadowColor.value,
                offsetX: parseInt(shadowOffset.value, 10) || 0,
                offsetY: parseInt(shadowOffset.value, 10) || 0,
            });
            canvas.renderAll()
        }
    }

    function lastObj(item, value) {
        if (!!canvas.getActiveObject()) {
            if (canvas.getActiveObject().type === 'textbox') {
                canvas.getActiveObject().set(`${item}`, value);
                canvas.getActiveObject().set('strokeWidth', 0);
            } else {
                canvas.getActiveObject().set(`${item}`, value);
            }
            canvas.renderAll()
        }
    }

//add  pen weight

    range.onmousemove = function () {
        rangeAnim (this);
        canvas.freeDrawingBrush.width = parseInt(range.value, 10) || 5;
        penWeight.value = range.value;
        lastObj('strokeWidth', +range.value);
    };

    function keyUpRange(item, lastItem) {
        lastItem.value = item.value;
        let val = item.value,
            maxVal = lastItem.getAttribute('max');
        val = (val * 100) / maxVal;
        lastItem.style.background = '-webkit-linear-gradient(left, blue 0%, blue ' + val + '%, #82c5ff ' + val + '%, #82c5ff 100%)'
    }

    penWeight.onkeyup = function () {
        keyUpRange(this, range);
        canvas.freeDrawingBrush.width = parseInt(range.value, 10) || 5;
    };

//add pen color

    color.onchange =  function () {
        canvas.freeDrawingBrush.color = color.value;
        lastObj('stroke', color.value);
    };

//add shadow settings

    shadowColor.onchange =  function () {
        canvas.freeDrawingBrush.shadow.color = shadowColor.value;
        lastShadow();
    };


    shadowOffset.onmousemove =  function () {
        rangeAnim (this);
        canvas.freeDrawingBrush.shadow.offsetX = parseInt(shadowOffset.value, 10) || 0;
        canvas.freeDrawingBrush.shadow.offsetY = parseInt(shadowOffset.value, 10) || 0;
        shadowOffsetHTML.value = shadowOffset.value;
        lastShadow();
    };

    shadowOffsetHTML.onkeyup = function () {
        keyUpRange(this, shadowOffset);
        canvas.freeDrawingBrush.shadow.offsetX = parseInt(shadowOffset.value, 10) || 0;
        canvas.freeDrawingBrush.shadow.offsetY = parseInt(shadowOffset.value, 10) || 0;
    };

    shadowRange.onmousemove =  function () {
        rangeAnim (this);
        canvas.freeDrawingBrush.shadow.blur = parseInt(shadowRange.value, 10) || 0;
        shadowRangeHTML.value = shadowRange.value;
        lastShadow();
    };

    shadowRangeHTML.onkeyup = function () {
        keyUpRange(this, shadowRange);
        canvas.freeDrawingBrush.shadow.offsetX = parseInt(shadowRange.value, 10) || 0;
        canvas.freeDrawingBrush.shadow.offsetY = parseInt(shadowRange.value, 10) || 0;
    };

//add text settings

    textWeight.onchange = function () {
        lastObj('fontSize', +textWeight.value);
    };

    fontFamily.onchange = function () {
        lastObj('fontFamily', fontFamily.value);
    };

// add arrow animation on select

    function rotateArrow(item) {
        if (item.previousSibling.previousSibling.style.transform === ''){
            item.previousSibling.previousSibling.style.transform = 'rotate(180deg)'
        } else {
            item.previousSibling.previousSibling.style.transform = ''
        }
    }

    fontFamily.onclick = function () {
        rotateArrow(this);
    };

    fontFamily.onblur = function () {
        this.previousSibling.previousSibling.style.transform = ''
    };

    textWeight.onblur = function () {
        this.previousSibling.previousSibling.style.transform = ''
    };

    textWeight.onclick = function () {
        rotateArrow(this);
    };
    
//add animation for range
    shadowRange.style.background = '-webkit-linear-gradient(left, blue 0%, blue 0%, #82c5ff 0%, #82c5ff 100%)';
    shadowOffset.style.background = '-webkit-linear-gradient(left, blue 0%, blue 0%, #82c5ff 0%, #82c5ff 100%)';

    function rangeAnim (item) {
        let val = item.value,
            maxVal = item.getAttribute('max');
        val = (val * 100) / maxVal;
        item.style.background = '-webkit-linear-gradient(left, blue 0%, blue ' + val + '%, #82c5ff ' + val + '%, #82c5ff 100%)'
    }
};