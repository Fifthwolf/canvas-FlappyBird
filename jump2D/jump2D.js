var data = {
  image: null,
  system: {
    time: {
      previous: 0,
      delta: 0
    },
    cxt: null,
    scale: 1,
    top: 0,
    width: 640,
    height: 480

  },
  click: {
    down: 0,
    up: 0,
  },
  element: {
    monkey: null,
    groove: null,
    roof: null
  },
}

window.onload = function() {
  suitScreen();
  imageLoaded();
}

function imageLoaded() {
  var image = new Image();
  image.src = 'jump2D.png';
  image.onload = function() {
    loading.style.display = 'none';
    _setCanvasProperty();
    data.system.cxt = canvas.getContext('2d');
    data.image = image;
    data.system.time.previous = Date.now();
    game();
    gameloop();
  }

  function _setCanvasProperty() {
    canvas.width = 640;
    canvas.height = 480;
  }
}

function game() {
  init();
}

function init() {
  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  var ele = data.element;
  ele.monkey = new Monkey();
  ele.monkey.init();
  ele.groove = new powerGroove();
  ele.roof = new Roof();
  ele.roof.init();
}

function gameloop() {
  var time = data.system.time;
  requestAnimationFrame(gameloop);
  var now = Date.now();
  time.delta = now - time.previous;
  time.previous = now;
  if (time.delta > 30) {
    time.delta = 30;
  }
  drawImage();
}

function drawImage() {
  var cxt = data.system.cxt,
    ele = data.element;
  drawBackground(cxt);
  ele.monkey.draw(cxt);
  ele.groove.draw(cxt);
  ele.roof.draw(cxt);
}

function drawBackground(cxt) {
  cxt.drawImage(data.image, 0, 0, 640, 480, 0, 0, 640, 480);
}

function Monkey() {
  this.x;
  this.y;
  this.vx;
  this.vy;
  this.gravity = 1;
  this.state;
  this.position = [
    [660, 0],
    [660, 120]
  ];

  this.init = function() {
    this.x = 100;
    this.y = 430;
    this.state = 0;
  }
  this.jumpStart = function(initial) {
    initial = Math.min(initial, 15);
    this.vy = -initial;
    this.vx = initial;
    this.state = 1;
  }
  this.jump = function() {
    this.x += this.vx;
    this.y = this.y + this.vy;
    this.vy = this.vy + this.gravity;
    if (this.y > 430) {
      this.y = 430;
      this.state = 0;
      landing();
    }
  }
  this.draw = function(cxt) {
    if (this.state == 1) {
      this.jump();
    }
    cxt.save();
    cxt.translate(this.x, this.y); //坐标原点位于猴子正中下方
    cxt.drawImage(data.image, this.position[this.state][0], this.position[this.state][1], 100, 100, -50, -100, 100, 100);
    cxt.restore();
  }
}

function Roof() {
  this.roof = [];

  this.init = function() {
    this.roof.push({
      width: 100,
      center: 500,
      type: 0
    });
  }
  this.create = function() {
    this.roof.push({
      width: 100,
      center: 500,
      type: 0
    });
  }
  this.draw = function(cxt) {
    cxt.save();
    for (var i = 0, len = this.roof.length; i < len; i++) {
      cxt.beginPath();
      cxt.fillStyle = '#00f';
      cxt.rect(this.roof[i].center - this.roof[i].width / 2, 427, this.roof[i].width, 53);
      cxt.fill();
    }
    cxt.restore();
  }
}

function powerGroove() {
  this.value = 0;
  this.max = 100;
  this.state = 0; //0静止，1增加，2减少

  this.add = function() {
    this.state = 1;

  }
  this.reduce = function() {
    this.state = 2;

  }
  this.stop = function() {
    this.state = 0;
  }
  this.change = function() {
    if (this.state == 1) {
      this.value += 6;
      if (this.value > this.max) {
        this.stop();
        this.value = this.max;
      }
    }
    if (this.state == 2) {
      this.value -= 15;
      if (this.value < 0) {
        this.stop();
        this.value = 0;
      }
    }
  }
  this.draw = function(cxt) {
    this.change();
    cxt.save();
    cxt.beginPath();
    cxt.font = "20px Verdana";
    cxt.textAlign = "right";
    cxt.fillStyle = '#f00';
    cxt.fillText("POW", 490, 37);
    cxt.rect(500, 20, this.value, 20);
    cxt.fill();
    cxt.beginPath();
    cxt.strokeStyle = '#000';
    cxt.rect(500, 20, 100, 20);
    cxt.stroke();
    cxt.restore();
  }
}

function landing() {
  var ele = data.element;
  var correct = 10;
  var monkeyX = ele.monkey.x,
    roofCenter = ele.roof.roof[ele.roof.roof.length - 1].center,
    roofWidth = ele.roof.roof[ele.roof.roof.length - 1].width;
  console.log(monkeyX);
  console.log(roofCenter);
  if (monkeyX > roofCenter - roofWidth - correct / 2 && monkeyX < roofCenter + roofWidth / 2 + correct) {
    console.log('win');
  } else {
    console.log('fail');
  }
}

function onMouseDown() {
  data.click.down = new Date();
  data.element.groove.add();
}

function onMouseUp() {
  data.click.up = new Date();
  data.element.groove.reduce();
  var time = data.click.up - data.click.down;
  data.element.monkey.jumpStart(time / 20);
}