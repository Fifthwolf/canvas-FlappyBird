var data = {
  image: null,
  system: {
    time: {
      previous: 0,
      delta: 0
    },
    mobile: null,
    cxt: null,
    scale: 1,
    top: 0,
    width: 400,
    height: 600
  },
  element: {

  },
}

window.onload = function() {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    data.system.mobile = true;
  } else {
    data.system.mobile = false;
  }
  suitScreen();
  imageLoaded();
}

function imageLoaded() {
  var image = new Image();
  image.src = 'monkeyJump.png';
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
    canvas.width = 400;
    canvas.height = 600;
  }
}

function game() {
  init();
}

function init() {
  var ele = data.element;
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
}

function StartText() {
  this.x = 320;
  this.y = 240;
  this.testAlpha = 1;
  this.picState = 1; //0下降，1上升
  this.textState = 0; //0减弱，1增强
  this.position = [420, 490];

  this.testAlpahChange = function() {
    if (this.textState) {
      this.testAlpha += data.system.time.delta * 0.005;
      if (this.testAlpha > 1) {
        this.textState = 0;
      }
    } else {
      this.testAlpha -= data.system.time.delta * 0.001;
      if (this.testAlpha < 0) {
        this.textState = 1;
      }
    }
  }
  this.startPicFloat = function() {
    if (this.picState) {
      this.y += data.system.time.delta * 0.02;
      if (this.y > 260) {
        this.picState = 0;
      }
    } else {
      this.y -= data.system.time.delta * 0.02;
      if (this.y < 220) {
        this.picState = 1;
      }
    }
  }
  this.draw = function(cxt) {
    this.testAlpahChange();
    this.startPicFloat();
    cxt.save();
    cxt.translate(this.x, this.y);
    cxt.drawImage(data.image, this.position[0], this.position[1], 500, 377, -250, -189, 500, 377);
    cxt.restore();

    cxt.save();
    cxt.beginPath();
    cxt.font = "20px Microsoft YaHei";
    cxt.textAlign = "left";
    cxt.fillStyle = 'rgba(255, 255, 255,' + this.testAlpha + ')';
    cxt.shadowColor = '#000';
    cxt.shadowOffsetX = 1;
    cxt.shadowOffsetY = 1;
    cxt.shadowBlur = 1;
    cxt.fillText("点击以开始游戏", 50, 350);
    cxt.restore();
  }
}

function Aircraft() {
  this.x;
  this.y;
  this.health;

  this.init = function() {}
  this.draw = function(cxt) {

  }
}

function drawBackground(cxt) {

}