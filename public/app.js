(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ref$, id, log, sin, cos, tau, limit, floor, clampZero, easeOut, FrameDriver, Output, Room, Marker, Hero, options, roomHeight, tileSize, β, flightRange, roomPos, roomDim, roomBoundsX, roomBoundsY, output, markers, res$, i$, i, rooms, hero, heroMarker, frameDriver, drawShadow, drawFrame;
ref$ = require('std'), id = ref$.id, log = ref$.log, sin = ref$.sin, cos = ref$.cos, tau = ref$.tau, limit = ref$.limit, floor = ref$.floor, clampZero = ref$.clampZero, easeOut = ref$.easeOut;
FrameDriver = require('./frame-driver').FrameDriver;
Output = require('./output').Output;
Room = require('./room').Room;
Marker = require('./marker').Marker;
Hero = require('./hero').Hero;
options = {
  cameraFollow: true,
  automatic: true,
  liftOff: 2,
  threshold: 0.33
};
roomHeight = 3;
tileSize = β = 25;
flightRange = 13;
roomPos = [2, 14];
roomDim = [15, 9, roomHeight];
roomBoundsX = limit(1 + roomPos[0], roomPos[0] + roomDim[0] - 2);
roomBoundsY = limit(1 + roomPos[1], roomPos[1] + roomDim[1] - 1);
output = new Output((roomPos[0] * 2 + roomDim[0]) * β, window.innerHeight, β);
res$ = [];
for (i$ = 0; i$ <= 4; ++i$) {
  i = i$;
  res$.push(new Marker('white', i * 100 + 100, i !== 4 ? options.threshold : void 8));
}
markers = res$;
res$ = [];
for (i$ = 0; i$ <= 4; ++i$) {
  i = i$;
  res$.push(new Room([roomPos[0], roomDim[1], i], roomDim, β));
}
rooms = res$;
hero = new Hero([roomPos[0] + floor(roomDim[0] / 2), roomPos[1] + floor(roomDim[1] / 2), 0], [β, β * 2]);
heroMarker = new Marker('red', 400, 0);
frameDriver = new FrameDriver(function(Δt, time){
  hero.z = flightRange / 2 + flightRange / 2 * sin(time / 2000);
  return drawFrame();
});
drawShadow = function(ctx, x, y, α){
  output.ctx.beginPath();
  output.ctx.fillStyle = 'black';
  output.ctx.arc(x, y, β / 3, 0, tau);
  output.ctx.globalAlpha = 0.2 * α;
  output.ctx.fill();
  return output.ctx.globalAlpha = 1;
};
drawFrame = function(Δt, time, frame){
  var glide, cameraCenteringOffset, i$, ref$, len$, room, x, y, z, w, h, d, α, v, roomX, roomY, roomZ, roomA, heroX, heroY, heroZ, shadowX, shadowY, flightZ, shadowA;
  glide = options.cameraFollow ? hero.z * β : 0;
  cameraCenteringOffset = β * (options.cameraFollow ? 10 : 0);
  hero.set(400 - hero.z / roomHeight * 100 + 100);
  heroMarker.set(400 - hero.z / roomHeight * 100 + 100);
  output.draw(β, glide);
  for (i$ = 0, len$ = (ref$ = rooms).length; i$ < len$; ++i$) {
    room = ref$[i$];
    x = room.x, y = room.y, z = room.z, w = room.w, h = room.h, d = room.d;
    if (hero.z / d <= z - options.threshold) {
      α = 0;
    } else if (hero.z / d <= z) {
      α = 2 + (-1 / options.threshold) * (z + options.threshold - hero.z / d);
      v = easeOut(α, 0, 1, 1);
    } else {
      v = 1;
      α = 1;
    }
    roomX = x * β;
    roomY = y * β + (d - 1) * β - cameraCenteringOffset;
    roomZ = z * d * β + (1 - v) * β * options.liftOff;
    roomA = α;
    room.blitTo(output, roomX, glide + roomY - roomZ, roomA);
  }
  heroX = hero.x * β;
  heroY = hero.y * β - β - cameraCenteringOffset;
  heroZ = hero.z * β;
  hero - (α = 1);
  shadowX = (hero.x + 0.5) * β;
  shadowY = (hero.y + 0.5) * β - cameraCenteringOffset;
  flightZ = floor(hero.z / 3) * β * roomHeight * -1 + glide;
  shadowA = 1 - hero.z % roomHeight / roomHeight;
  drawShadow(output.ctx, shadowX, shadowY + flightZ, shadowA);
  return hero.blitTo(output, heroX, glide + heroY - heroZ - 0.6 * β, hero - α);
};
document.addEventListener('mousemove', function(arg$){
  var pageY;
  pageY = arg$.pageY;
  if (!options.automatic) {
    frameDriver.stop();
    hero.z = limit(0, flightRange, roomHeight * 4 - (pageY - 100) / 400 * roomHeight * 4);
    return drawFrame();
  }
});
document.addEventListener('keydown', function(arg$){
  var which;
  which = arg$.which;
  switch (which) {
  case 37:
    hero.x = roomBoundsX(hero.x - 1);
    break;
  case 38:
    hero.y = roomBoundsY(hero.y - 1);
    break;
  case 39:
    hero.x = roomBoundsX(hero.x + 1);
    break;
  case 40:
    hero.y = roomBoundsY(hero.y + 1);
    break;
  }
  return drawFrame();
});
document.getElementById('follow').addEventListener('change', function(){
  return options.cameraFollow = this.checked;
});
document.getElementById('auto').addEventListener('change', function(){
  if (!this.checked) {
    frameDriver.stop();
  } else {
    frameDriver.start();
  }
  return options.automatic = this.checked;
});
document.getElementById('threshold').addEventListener('mousemove', function(){
  var i$, ref$, len$, i, marker, results$ = [];
  options.threshold = this.value / 100;
  document.getElementById('tt').innerText = this.value / 100;
  for (i$ = 0, len$ = (ref$ = markers).length; i$ < len$; ++i$) {
    i = i$;
    marker = ref$[i$];
    if (i !== 4) {
      results$.push(marker.setShadow(options.threshold));
    }
  }
  return results$;
});
document.getElementById('lift-off').addEventListener('mousemove', function(){
  options.liftOff = this.value / 100;
  return document.getElementById('lo').innerText = this.value / 100 === 1
    ? "1 tile"
    : this.value / 100 + " tiles";
});
window.addEventListener('resize', function(){
  output.sizeTo((roomPos[0] * 2 + roomDim[0]) * β, window.innerHeight);
  output.redraw(β);
  return drawFrame();
});
output.appendTo(document.body);
output.canvas.style.marginLeft = '100px';
document.getElementById('controls').style.marginLeft = (100 + output.w) + "px";
document.getElementById('controls').style.display = 'block';
document.getElementById('center').style.width = (100 + output.w + 250) + "px";
frameDriver.start();
},{"./frame-driver":2,"./hero":3,"./marker":4,"./output":5,"./room":6,"std":7}],2:[function(require,module,exports){
var ref$, id, log, raf, FrameDriver, out$ = typeof exports != 'undefined' && exports || this;
ref$ = require('std'), id = ref$.id, log = ref$.log, raf = ref$.raf;
out$.FrameDriver = FrameDriver = (function(){
  FrameDriver.displayName = 'FrameDriver';
  var prototype = FrameDriver.prototype, constructor = FrameDriver;
  function FrameDriver(onFrame){
    this.onFrame = onFrame;
    this.frame = bind$(this, 'frame', prototype);
    log("FrameDriver::new");
    this.state = {
      zero: 0,
      time: 0,
      frame: 0,
      running: false
    };
  }
  prototype.frame = function(){
    var now, Δt;
    now = Date.now() - this.state.zero;
    Δt = now - this.state.time;
    this.state.time = now;
    this.state.frame = this.state.frame + 1;
    this.onFrame(Δt, this.state.time, this.state.frame);
    if (this.state.running) {
      return raf(this.frame);
    }
  };
  prototype.start = function(){
    if (this.state.running === true) {
      return;
    }
    log("FrameDriver::Start - starting");
    this.state.zero = Date.now();
    this.state.time = 0;
    this.state.running = true;
    return this.frame();
  };
  prototype.stop = function(){
    if (this.state.running === false) {
      return;
    }
    log("FrameDriver::Stop - stopping");
    return this.state.running = false;
  };
  return FrameDriver;
}());
function bind$(obj, key, target){
  return function(){ return (target || obj)[key].apply(obj, arguments) };
}
},{"std":7}],3:[function(require,module,exports){
var ref$, id, log, el, pi, tau, floor, Hero, out$ = typeof exports != 'undefined' && exports || this;
ref$ = require('std'), id = ref$.id, log = ref$.log, el = ref$.el, pi = ref$.pi, tau = ref$.tau, floor = ref$.floor;
out$.Hero = Hero = (function(){
  Hero.displayName = 'Hero';
  var prototype = Hero.prototype, constructor = Hero;
  function Hero(pos, dim){
    var w, h;
    this.x = pos[0], this.y = pos[1], this.z = pos[2];
    w = dim[0], h = dim[1];
    log("new Hero:", pos);
    this.canvas = el('canvas');
    this.w = this.canvas.width = w * 2;
    this.h = this.canvas.height = h * 2;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = (100 / 2 - w / 2) + "px";
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.draw();
    document.body.appendChild(this.canvas);
  }
  prototype.set = function(value){
    return this.canvas.style.top = (value - this.h / 2) + "px";
  };
  prototype.appendTo = function(host){
    return host.appendChild(this.canvas);
  };
  prototype.blitTo = function(target, x, y, α){
    target.ctx.globalAlpha = α;
    target.ctx.drawImage(this.canvas, x, y, this.canvas.width / 2, this.canvas.height / 2);
    return target.ctx.globalAlpha = 1;
  };
  prototype.drawCape = function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = '#00e';
    this.ctx.moveTo(this.w / 2, this.h / 4);
    this.ctx.lineTo(this.w, this.h * 3 / 4);
    this.ctx.lineTo(0, this.h * 3 / 4);
    this.ctx.lineTo(this.w / 2, this.h / 4);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.fillStyle = '#00b';
    this.ctx.moveTo(this.w / 2, this.h * 2 / 5);
    this.ctx.lineTo(this.w, this.h * 3 / 4);
    this.ctx.lineTo(0, this.h * 3 / 4);
    this.ctx.lineTo(this.w / 2, this.h * 2 / 5);
    return this.ctx.fill();
  };
  prototype.drawTorso = function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = 'grey';
    this.ctx.moveTo(this.w * 1 / 2, this.h * 2 / 5);
    this.ctx.lineTo(this.w * 3 / 4, this.h * 3 / 4);
    this.ctx.lineTo(this.w * 1 / 2, this.h * 4 / 4);
    this.ctx.lineTo(this.w * 1 / 4, this.h * 3 / 4);
    this.ctx.lineTo(this.w * 1 / 2, this.h * 2 / 5);
    return this.ctx.fill();
  };
  prototype.drawFace = function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = '#852';
    this.ctx.arc(this.w / 2, this.h / 4, this.w / 4, 0, tau);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.fillStyle = '#fca';
    this.ctx.arc(this.w / 2, this.h / 4 + this.w / 20, this.h / 10, 0, tau);
    return this.ctx.fill();
  };
  prototype.draw = function(α){
    this.drawCape();
    this.drawTorso();
    return this.drawFace();
  };
  return Hero;
}());
},{"std":7}],4:[function(require,module,exports){
var ref$, id, log, el, floor, Marker, out$ = typeof exports != 'undefined' && exports || this;
ref$ = require('std'), id = ref$.id, log = ref$.log, el = ref$.el, floor = ref$.floor;
out$.Marker = Marker = (function(){
  Marker.displayName = 'Marker';
  var prototype = Marker.prototype, constructor = Marker;
  function Marker(col, pos, shadow){
    pos == null && (pos = 0);
    shadow == null && (shadow = 0);
    this.dom = el('div');
    import$(this.dom.style, {
      background: col,
      height: '1px',
      width: '100px',
      position: 'absolute',
      left: 0
    });
    this.appendTo(document.body);
    this.set(pos);
    if (shadow) {
      this.setShadow(shadow);
    }
  }
  prototype.appendTo = function(host){
    return host.appendChild(this.dom);
  };
  prototype.set = function(value){
    return this.dom.style.top = floor(value) + 'px';
  };
  prototype.setShadow = function(value){
    return this.dom.style.borderBottom = floor(value * 100) + "px solid #444";
  };
  return Marker;
}());
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
},{"std":7}],5:[function(require,module,exports){
var ref$, id, log, el, floor, Blitter, Output, out$ = typeof exports != 'undefined' && exports || this;
ref$ = require('std'), id = ref$.id, log = ref$.log, el = ref$.el, floor = ref$.floor;
Blitter = (function(){
  Blitter.displayName = 'Blitter';
  var prototype = Blitter.prototype, constructor = Blitter;
  function Blitter(w, h){
    this.canvas = el('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sizeTo(w, h);
  }
  prototype.clear = function(){
    return this.ctx.clearRect(0, 0, this.w, this.h);
  };
  prototype.sizeTo = function(w, h){
    this.w = this.canvas.width = w;
    return this.h = this.canvas.height = h;
  };
  prototype.appendTo = function(host){
    return host.appendChild(this.canvas);
  };
  prototype.blitTo = function(target, x, y, α){
    α == null && (α = 1);
    target.ctx.globalAlpha = α;
    target.ctx.drawImage(this.canvas, x, y, this.w, this.h);
    return target.ctx.globalAlpha = 1;
  };
  return Blitter;
}());
out$.Output = Output = (function(superclass){
  var prototype = extend$((import$(Output, superclass).displayName = 'Output', Output), superclass).prototype, constructor = Output;
  function Output(w, h, β){
    this.grid = new Blitter(w, h);
    this.ground = new Blitter(w, h);
    Output.superclass.apply(this, arguments);
    this.redraw(β);
  }
  prototype.drawGround = function(β){
    var i$, to$, i, results$ = [];
    for (i$ = 0, to$ = this.h; β < 0 ? i$ >= to$ : i$ <= to$; i$ += β) {
      i = i$;
      this.ground.ctx.fillStyle = "rgb(" + floor(90 - i / this.h * 60) + ", " + floor(160 - i / this.h * 30) + ", 50)";
      results$.push(this.ground.ctx.fillRect(0, i, this.w, this.h - i));
    }
    return results$;
  };
  prototype.drawGrid = function(β){
    var i$, to$, x, y;
    this.grid.globalAlpha = 0.1;
    this.grid.ctx.strokeStyle = "rgba(255,255,255,0.1)";
    this.grid.ctx.beginPath();
    for (i$ = 0, to$ = this.w; β < 0 ? i$ >= to$ : i$ <= to$; i$ += β) {
      x = i$;
      this.grid.ctx.moveTo(0.5 + x, 0);
      this.grid.ctx.lineTo(0.5 + x, this.h);
    }
    for (i$ = 0, to$ = this.h; β < 0 ? i$ >= to$ : i$ <= to$; i$ += β) {
      y = i$;
      this.grid.ctx.moveTo(0.5, 0.5 + y);
      this.grid.ctx.lineTo(this.w, 0.5 + y);
    }
    return this.grid.ctx.stroke();
  };
  prototype.redraw = function(β){
    this.drawGround(β);
    return this.drawGrid(β);
  };
  prototype.draw = function(β, glide){
    glide == null && (glide = 0);
    this.ground.blitTo(this, 0, 0);
    return this.grid.blitTo(this, 0, glide % β);
  };
  prototype.sizeTo = function(w, h){
    superclass.prototype.sizeTo.call(this, w, h);
    this.grid.sizeTo(w, h);
    return this.ground.sizeTo(w, h);
  };
  return Output;
}(Blitter));
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
},{"std":7}],6:[function(require,module,exports){
var ref$, id, log, el, floor, Room, out$ = typeof exports != 'undefined' && exports || this;
ref$ = require('std'), id = ref$.id, log = ref$.log, el = ref$.el, floor = ref$.floor;
out$.Room = Room = (function(){
  Room.displayName = 'Room';
  var prototype = Room.prototype, constructor = Room;
  function Room(pos, dim, β){
    this.x = pos[0], this.y = pos[1], this.z = pos[2];
    this.w = dim[0], this.h = dim[1], this.d = dim[2];
    this.β = β != null ? β : 50;
    this.canvas = el('canvas');
    this.canvas.style.background = 'red';
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.β * this.w;
    this.canvas.height = this.β * (this.h + this.d);
    this.generate(dim);
    this.draw();
  }
  prototype.spit = function(){
    var y, row;
    return log(function(it){
      return it.join("\n");
    }((function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = this.tiles).length; i$ < len$; ++i$) {
        y = i$;
        row = ref$[i$];
        results$.push(row.join('|'));
      }
      return results$;
    }.call(this))));
  };
  prototype.generate = function(arg$){
    var w, h, d, y, x;
    w = arg$[0], h = arg$[1], d = arg$[2];
    return this.tiles = (function(){
      var i$, to$, lresult$, j$, to1$, results$ = [];
      for (i$ = 0, to$ = h; i$ < to$; ++i$) {
        y = i$;
        lresult$ = [];
        for (j$ = 0, to1$ = w; j$ < to1$; ++j$) {
          x = j$;
          if (y === 0 || x === 0 || x === w - 1) {
            lresult$.push(1);
          } else {
            lresult$.push(0);
          }
        }
        results$.push(lresult$);
      }
      return results$;
    }());
  };
  prototype.drawBlock = function(x, y, z){
    this.ctx.fillStyle = '#888';
    this.ctx.fillRect(x * this.β, (this.d + y - 1) * this.β - 1 - z * this.β, this.β, this.β * 2);
    this.ctx.fillStyle = '#aaa';
    this.ctx.fillRect(x * this.β, (this.d + y - 0) * this.β - 1 - z * this.β, this.β - 1, this.β - 1);
    this.ctx.fillStyle = '#eee';
    return this.ctx.fillRect(x * this.β, (this.d + y - 1) * this.β - 1 - z * this.β, this.β - 1, this.β - 1);
  };
  prototype.draw = function(z, v){
    var i$, to$, lresult$, j$, ref$, len$, y, row, lresult1$, k$, len1$, x, wall, results$ = [];
    z == null && (z = 0);
    v == null && (v = 50 + 10 * this.z);
    this.ctx.fillStyle = "rgb(" + v + ", " + v + ", " + v + ")";
    this.ctx.fillRect(0, this.β * this.d, this.canvas.width, this.canvas.height - this.β * this.d);
    for (i$ = 0, to$ = this.d; i$ < to$; ++i$) {
      z = i$;
      lresult$ = [];
      for (j$ = 0, len$ = (ref$ = this.tiles).length; j$ < len$; ++j$) {
        y = j$;
        row = ref$[j$];
        lresult1$ = [];
        for (k$ = 0, len1$ = row.length; k$ < len1$; ++k$) {
          x = k$;
          wall = row[k$];
          if (wall) {
            lresult1$.push(this.drawBlock(x, y, z));
          }
        }
        lresult$.push(lresult1$);
      }
      results$.push(lresult$);
    }
    return results$;
  };
  prototype.blitTo = function(target, x, y, α){
    α == null && (α = 1);
    target.ctx.globalAlpha = α;
    target.ctx.drawImage(this.canvas, x, y, this.canvas.width, this.canvas.height);
    return target.ctx.globalAlpha = 1;
  };
  return Room;
}());
},{"std":7}],7:[function(require,module,exports){
var id, log, flip, sin, cos, pi, tau, delay, floor, random, rand, randomFrom, addV2, filter, el, clampZero, easeOut, wrap, limit, raf, that, out$ = typeof exports != 'undefined' && exports || this;
out$.id = id = function(it){
  return it;
};
out$.log = log = function(){
  console.log.apply(console, arguments);
  return arguments[0];
};
out$.flip = flip = function(λ){
  return function(a, b){
    return λ(b, a);
  };
};
out$.sin = sin = Math.sin;
out$.cos = cos = Math.cos;
out$.pi = pi = Math.PI;
out$.tau = tau = pi * 2;
out$.delay = delay = flip(setTimeout);
out$.floor = floor = Math.floor;
out$.random = random = Math.random;
out$.rand = rand = function(min, max){
  return min + floor(random() * (max - min));
};
out$.randomFrom = randomFrom = function(list){
  return list[rand(0, list.length - 1)];
};
out$.addV2 = addV2 = function(a, b){
  return [a[0] + b[0], a[1] + b[1]];
};
out$.filter = filter = curry$(function(λ, list){
  var i$, len$, x, results$ = [];
  for (i$ = 0, len$ = list.length; i$ < len$; ++i$) {
    x = list[i$];
    if (λ(x)) {
      results$.push(x);
    }
  }
  return results$;
});
out$.el = el = bind$(document, 'createElement');
out$.clampZero = clampZero = function(it){
  if (it < 0) {
    return 0;
  } else {
    return it;
  }
};
out$.easeOut = easeOut = function(t, b, c, d){
  return -c * (t /= d) * (t - 2) + b;
};
out$.wrap = wrap = curry$(function(min, max, n){
  if (n > max) {
    return min;
  } else if (n < min) {
    return max;
  } else {
    return n;
  }
});
out$.limit = limit = curry$(function(min, max, n){
  if (n > max) {
    return max;
  } else if (n < min) {
    return min;
  } else {
    return n;
  }
});
out$.raf = raf = (that = window.requestAnimationFrame) != null
  ? that
  : (that = window.webkitRequestAnimationFrame) != null
    ? that
    : (that = window.mozRequestAnimationFrame) != null
      ? that
      : function(λ){
        return setTimeout(λ, 1000 / 60);
      };
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}
function bind$(obj, key, target){
  return function(){ return (target || obj)[key].apply(obj, arguments) };
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9pbmRleC5scyIsIi9Vc2Vycy9sYWttZWVyL1Byb2plY3RzL2hhbmRtYWRlLXotZWZmZWN0L3NyYy9mcmFtZS1kcml2ZXIubHMiLCIvVXNlcnMvbGFrbWVlci9Qcm9qZWN0cy9oYW5kbWFkZS16LWVmZmVjdC9zcmMvaGVyby5scyIsIi9Vc2Vycy9sYWttZWVyL1Byb2plY3RzL2hhbmRtYWRlLXotZWZmZWN0L3NyYy9tYXJrZXIubHMiLCIvVXNlcnMvbGFrbWVlci9Qcm9qZWN0cy9oYW5kbWFkZS16LWVmZmVjdC9zcmMvb3V0cHV0LmxzIiwiL1VzZXJzL2xha21lZXIvUHJvamVjdHMvaGFuZG1hZGUtei1lZmZlY3Qvc3JjL3Jvb20ubHMiLCIvVXNlcnMvbGFrbWVlci9Qcm9qZWN0cy9oYW5kbWFkZS16LWVmZmVjdC9zcmMvc3RkL2luZGV4LmxzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmVmJCwgaWQsIGxvZywgc2luLCBjb3MsIHRhdSwgbGltaXQsIGZsb29yLCBjbGFtcFplcm8sIGVhc2VPdXQsIEZyYW1lRHJpdmVyLCBPdXRwdXQsIFJvb20sIE1hcmtlciwgSGVybywgb3B0aW9ucywgcm9vbUhlaWdodCwgdGlsZVNpemUsIM6yLCBmbGlnaHRSYW5nZSwgcm9vbVBvcywgcm9vbURpbSwgcm9vbUJvdW5kc1gsIHJvb21Cb3VuZHNZLCBvdXRwdXQsIG1hcmtlcnMsIHJlcyQsIGkkLCBpLCByb29tcywgaGVybywgaGVyb01hcmtlciwgZnJhbWVEcml2ZXIsIGRyYXdTaGFkb3csIGRyYXdGcmFtZTtcbnJlZiQgPSByZXF1aXJlKCdzdGQnKSwgaWQgPSByZWYkLmlkLCBsb2cgPSByZWYkLmxvZywgc2luID0gcmVmJC5zaW4sIGNvcyA9IHJlZiQuY29zLCB0YXUgPSByZWYkLnRhdSwgbGltaXQgPSByZWYkLmxpbWl0LCBmbG9vciA9IHJlZiQuZmxvb3IsIGNsYW1wWmVybyA9IHJlZiQuY2xhbXBaZXJvLCBlYXNlT3V0ID0gcmVmJC5lYXNlT3V0O1xuRnJhbWVEcml2ZXIgPSByZXF1aXJlKCcuL2ZyYW1lLWRyaXZlcicpLkZyYW1lRHJpdmVyO1xuT3V0cHV0ID0gcmVxdWlyZSgnLi9vdXRwdXQnKS5PdXRwdXQ7XG5Sb29tID0gcmVxdWlyZSgnLi9yb29tJykuUm9vbTtcbk1hcmtlciA9IHJlcXVpcmUoJy4vbWFya2VyJykuTWFya2VyO1xuSGVybyA9IHJlcXVpcmUoJy4vaGVybycpLkhlcm87XG5vcHRpb25zID0ge1xuICBjYW1lcmFGb2xsb3c6IHRydWUsXG4gIGF1dG9tYXRpYzogdHJ1ZSxcbiAgbGlmdE9mZjogMixcbiAgdGhyZXNob2xkOiAwLjMzXG59O1xucm9vbUhlaWdodCA9IDM7XG50aWxlU2l6ZSA9IM6yID0gMjU7XG5mbGlnaHRSYW5nZSA9IDEzO1xucm9vbVBvcyA9IFsyLCAxNF07XG5yb29tRGltID0gWzE1LCA5LCByb29tSGVpZ2h0XTtcbnJvb21Cb3VuZHNYID0gbGltaXQoMSArIHJvb21Qb3NbMF0sIHJvb21Qb3NbMF0gKyByb29tRGltWzBdIC0gMik7XG5yb29tQm91bmRzWSA9IGxpbWl0KDEgKyByb29tUG9zWzFdLCByb29tUG9zWzFdICsgcm9vbURpbVsxXSAtIDEpO1xub3V0cHV0ID0gbmV3IE91dHB1dCgocm9vbVBvc1swXSAqIDIgKyByb29tRGltWzBdKSAqIM6yLCB3aW5kb3cuaW5uZXJIZWlnaHQsIM6yKTtcbnJlcyQgPSBbXTtcbmZvciAoaSQgPSAwOyBpJCA8PSA0OyArK2kkKSB7XG4gIGkgPSBpJDtcbiAgcmVzJC5wdXNoKG5ldyBNYXJrZXIoJ3doaXRlJywgaSAqIDEwMCArIDEwMCwgaSAhPT0gNCA/IG9wdGlvbnMudGhyZXNob2xkIDogdm9pZCA4KSk7XG59XG5tYXJrZXJzID0gcmVzJDtcbnJlcyQgPSBbXTtcbmZvciAoaSQgPSAwOyBpJCA8PSA0OyArK2kkKSB7XG4gIGkgPSBpJDtcbiAgcmVzJC5wdXNoKG5ldyBSb29tKFtyb29tUG9zWzBdLCByb29tRGltWzFdLCBpXSwgcm9vbURpbSwgzrIpKTtcbn1cbnJvb21zID0gcmVzJDtcbmhlcm8gPSBuZXcgSGVybyhbcm9vbVBvc1swXSArIGZsb29yKHJvb21EaW1bMF0gLyAyKSwgcm9vbVBvc1sxXSArIGZsb29yKHJvb21EaW1bMV0gLyAyKSwgMF0sIFvOsiwgzrIgKiAyXSk7XG5oZXJvTWFya2VyID0gbmV3IE1hcmtlcigncmVkJywgNDAwLCAwKTtcbmZyYW1lRHJpdmVyID0gbmV3IEZyYW1lRHJpdmVyKGZ1bmN0aW9uKM6UdCwgdGltZSl7XG4gIGhlcm8ueiA9IGZsaWdodFJhbmdlIC8gMiArIGZsaWdodFJhbmdlIC8gMiAqIHNpbih0aW1lIC8gMjAwMCk7XG4gIHJldHVybiBkcmF3RnJhbWUoKTtcbn0pO1xuZHJhd1NoYWRvdyA9IGZ1bmN0aW9uKGN0eCwgeCwgeSwgzrEpe1xuICBvdXRwdXQuY3R4LmJlZ2luUGF0aCgpO1xuICBvdXRwdXQuY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gIG91dHB1dC5jdHguYXJjKHgsIHksIM6yIC8gMywgMCwgdGF1KTtcbiAgb3V0cHV0LmN0eC5nbG9iYWxBbHBoYSA9IDAuMiAqIM6xO1xuICBvdXRwdXQuY3R4LmZpbGwoKTtcbiAgcmV0dXJuIG91dHB1dC5jdHguZ2xvYmFsQWxwaGEgPSAxO1xufTtcbmRyYXdGcmFtZSA9IGZ1bmN0aW9uKM6UdCwgdGltZSwgZnJhbWUpe1xuICB2YXIgZ2xpZGUsIGNhbWVyYUNlbnRlcmluZ09mZnNldCwgaSQsIHJlZiQsIGxlbiQsIHJvb20sIHgsIHksIHosIHcsIGgsIGQsIM6xLCB2LCByb29tWCwgcm9vbVksIHJvb21aLCByb29tQSwgaGVyb1gsIGhlcm9ZLCBoZXJvWiwgc2hhZG93WCwgc2hhZG93WSwgZmxpZ2h0Wiwgc2hhZG93QTtcbiAgZ2xpZGUgPSBvcHRpb25zLmNhbWVyYUZvbGxvdyA/IGhlcm8ueiAqIM6yIDogMDtcbiAgY2FtZXJhQ2VudGVyaW5nT2Zmc2V0ID0gzrIgKiAob3B0aW9ucy5jYW1lcmFGb2xsb3cgPyAxMCA6IDApO1xuICBoZXJvLnNldCg0MDAgLSBoZXJvLnogLyByb29tSGVpZ2h0ICogMTAwICsgMTAwKTtcbiAgaGVyb01hcmtlci5zZXQoNDAwIC0gaGVyby56IC8gcm9vbUhlaWdodCAqIDEwMCArIDEwMCk7XG4gIG91dHB1dC5kcmF3KM6yLCBnbGlkZSk7XG4gIGZvciAoaSQgPSAwLCBsZW4kID0gKHJlZiQgPSByb29tcykubGVuZ3RoOyBpJCA8IGxlbiQ7ICsraSQpIHtcbiAgICByb29tID0gcmVmJFtpJF07XG4gICAgeCA9IHJvb20ueCwgeSA9IHJvb20ueSwgeiA9IHJvb20ueiwgdyA9IHJvb20udywgaCA9IHJvb20uaCwgZCA9IHJvb20uZDtcbiAgICBpZiAoaGVyby56IC8gZCA8PSB6IC0gb3B0aW9ucy50aHJlc2hvbGQpIHtcbiAgICAgIM6xID0gMDtcbiAgICB9IGVsc2UgaWYgKGhlcm8ueiAvIGQgPD0geikge1xuICAgICAgzrEgPSAyICsgKC0xIC8gb3B0aW9ucy50aHJlc2hvbGQpICogKHogKyBvcHRpb25zLnRocmVzaG9sZCAtIGhlcm8ueiAvIGQpO1xuICAgICAgdiA9IGVhc2VPdXQozrEsIDAsIDEsIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2ID0gMTtcbiAgICAgIM6xID0gMTtcbiAgICB9XG4gICAgcm9vbVggPSB4ICogzrI7XG4gICAgcm9vbVkgPSB5ICogzrIgKyAoZCAtIDEpICogzrIgLSBjYW1lcmFDZW50ZXJpbmdPZmZzZXQ7XG4gICAgcm9vbVogPSB6ICogZCAqIM6yICsgKDEgLSB2KSAqIM6yICogb3B0aW9ucy5saWZ0T2ZmO1xuICAgIHJvb21BID0gzrE7XG4gICAgcm9vbS5ibGl0VG8ob3V0cHV0LCByb29tWCwgZ2xpZGUgKyByb29tWSAtIHJvb21aLCByb29tQSk7XG4gIH1cbiAgaGVyb1ggPSBoZXJvLnggKiDOsjtcbiAgaGVyb1kgPSBoZXJvLnkgKiDOsiAtIM6yIC0gY2FtZXJhQ2VudGVyaW5nT2Zmc2V0O1xuICBoZXJvWiA9IGhlcm8ueiAqIM6yO1xuICBoZXJvIC0gKM6xID0gMSk7XG4gIHNoYWRvd1ggPSAoaGVyby54ICsgMC41KSAqIM6yO1xuICBzaGFkb3dZID0gKGhlcm8ueSArIDAuNSkgKiDOsiAtIGNhbWVyYUNlbnRlcmluZ09mZnNldDtcbiAgZmxpZ2h0WiA9IGZsb29yKGhlcm8ueiAvIDMpICogzrIgKiByb29tSGVpZ2h0ICogLTEgKyBnbGlkZTtcbiAgc2hhZG93QSA9IDEgLSBoZXJvLnogJSByb29tSGVpZ2h0IC8gcm9vbUhlaWdodDtcbiAgZHJhd1NoYWRvdyhvdXRwdXQuY3R4LCBzaGFkb3dYLCBzaGFkb3dZICsgZmxpZ2h0Wiwgc2hhZG93QSk7XG4gIHJldHVybiBoZXJvLmJsaXRUbyhvdXRwdXQsIGhlcm9YLCBnbGlkZSArIGhlcm9ZIC0gaGVyb1ogLSAwLjYgKiDOsiwgaGVybyAtIM6xKTtcbn07XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihhcmckKXtcbiAgdmFyIHBhZ2VZO1xuICBwYWdlWSA9IGFyZyQucGFnZVk7XG4gIGlmICghb3B0aW9ucy5hdXRvbWF0aWMpIHtcbiAgICBmcmFtZURyaXZlci5zdG9wKCk7XG4gICAgaGVyby56ID0gbGltaXQoMCwgZmxpZ2h0UmFuZ2UsIHJvb21IZWlnaHQgKiA0IC0gKHBhZ2VZIC0gMTAwKSAvIDQwMCAqIHJvb21IZWlnaHQgKiA0KTtcbiAgICByZXR1cm4gZHJhd0ZyYW1lKCk7XG4gIH1cbn0pO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGFyZyQpe1xuICB2YXIgd2hpY2g7XG4gIHdoaWNoID0gYXJnJC53aGljaDtcbiAgc3dpdGNoICh3aGljaCkge1xuICBjYXNlIDM3OlxuICAgIGhlcm8ueCA9IHJvb21Cb3VuZHNYKGhlcm8ueCAtIDEpO1xuICAgIGJyZWFrO1xuICBjYXNlIDM4OlxuICAgIGhlcm8ueSA9IHJvb21Cb3VuZHNZKGhlcm8ueSAtIDEpO1xuICAgIGJyZWFrO1xuICBjYXNlIDM5OlxuICAgIGhlcm8ueCA9IHJvb21Cb3VuZHNYKGhlcm8ueCArIDEpO1xuICAgIGJyZWFrO1xuICBjYXNlIDQwOlxuICAgIGhlcm8ueSA9IHJvb21Cb3VuZHNZKGhlcm8ueSArIDEpO1xuICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiBkcmF3RnJhbWUoKTtcbn0pO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZvbGxvdycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG4gIHJldHVybiBvcHRpb25zLmNhbWVyYUZvbGxvdyA9IHRoaXMuY2hlY2tlZDtcbn0pO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dG8nKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICBpZiAoIXRoaXMuY2hlY2tlZCkge1xuICAgIGZyYW1lRHJpdmVyLnN0b3AoKTtcbiAgfSBlbHNlIHtcbiAgICBmcmFtZURyaXZlci5zdGFydCgpO1xuICB9XG4gIHJldHVybiBvcHRpb25zLmF1dG9tYXRpYyA9IHRoaXMuY2hlY2tlZDtcbn0pO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RocmVzaG9sZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uKCl7XG4gIHZhciBpJCwgcmVmJCwgbGVuJCwgaSwgbWFya2VyLCByZXN1bHRzJCA9IFtdO1xuICBvcHRpb25zLnRocmVzaG9sZCA9IHRoaXMudmFsdWUgLyAxMDA7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0dCcpLmlubmVyVGV4dCA9IHRoaXMudmFsdWUgLyAxMDA7XG4gIGZvciAoaSQgPSAwLCBsZW4kID0gKHJlZiQgPSBtYXJrZXJzKS5sZW5ndGg7IGkkIDwgbGVuJDsgKytpJCkge1xuICAgIGkgPSBpJDtcbiAgICBtYXJrZXIgPSByZWYkW2kkXTtcbiAgICBpZiAoaSAhPT0gNCkge1xuICAgICAgcmVzdWx0cyQucHVzaChtYXJrZXIuc2V0U2hhZG93KG9wdGlvbnMudGhyZXNob2xkKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRzJDtcbn0pO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpZnQtb2ZmJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24oKXtcbiAgb3B0aW9ucy5saWZ0T2ZmID0gdGhpcy52YWx1ZSAvIDEwMDtcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsbycpLmlubmVyVGV4dCA9IHRoaXMudmFsdWUgLyAxMDAgPT09IDFcbiAgICA/IFwiMSB0aWxlXCJcbiAgICA6IHRoaXMudmFsdWUgLyAxMDAgKyBcIiB0aWxlc1wiO1xufSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKXtcbiAgb3V0cHV0LnNpemVUbygocm9vbVBvc1swXSAqIDIgKyByb29tRGltWzBdKSAqIM6yLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBvdXRwdXQucmVkcmF3KM6yKTtcbiAgcmV0dXJuIGRyYXdGcmFtZSgpO1xufSk7XG5vdXRwdXQuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG5vdXRwdXQuY2FudmFzLnN0eWxlLm1hcmdpbkxlZnQgPSAnMTAwcHgnO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRyb2xzJykuc3R5bGUubWFyZ2luTGVmdCA9ICgxMDAgKyBvdXRwdXQudykgKyBcInB4XCI7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udHJvbHMnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZW50ZXInKS5zdHlsZS53aWR0aCA9ICgxMDAgKyBvdXRwdXQudyArIDI1MCkgKyBcInB4XCI7XG5mcmFtZURyaXZlci5zdGFydCgpOyIsInZhciByZWYkLCBpZCwgbG9nLCByYWYsIEZyYW1lRHJpdmVyLCBvdXQkID0gdHlwZW9mIGV4cG9ydHMgIT0gJ3VuZGVmaW5lZCcgJiYgZXhwb3J0cyB8fCB0aGlzO1xucmVmJCA9IHJlcXVpcmUoJ3N0ZCcpLCBpZCA9IHJlZiQuaWQsIGxvZyA9IHJlZiQubG9nLCByYWYgPSByZWYkLnJhZjtcbm91dCQuRnJhbWVEcml2ZXIgPSBGcmFtZURyaXZlciA9IChmdW5jdGlvbigpe1xuICBGcmFtZURyaXZlci5kaXNwbGF5TmFtZSA9ICdGcmFtZURyaXZlcic7XG4gIHZhciBwcm90b3R5cGUgPSBGcmFtZURyaXZlci5wcm90b3R5cGUsIGNvbnN0cnVjdG9yID0gRnJhbWVEcml2ZXI7XG4gIGZ1bmN0aW9uIEZyYW1lRHJpdmVyKG9uRnJhbWUpe1xuICAgIHRoaXMub25GcmFtZSA9IG9uRnJhbWU7XG4gICAgdGhpcy5mcmFtZSA9IGJpbmQkKHRoaXMsICdmcmFtZScsIHByb3RvdHlwZSk7XG4gICAgbG9nKFwiRnJhbWVEcml2ZXI6Om5ld1wiKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgemVybzogMCxcbiAgICAgIHRpbWU6IDAsXG4gICAgICBmcmFtZTogMCxcbiAgICAgIHJ1bm5pbmc6IGZhbHNlXG4gICAgfTtcbiAgfVxuICBwcm90b3R5cGUuZnJhbWUgPSBmdW5jdGlvbigpe1xuICAgIHZhciBub3csIM6UdDtcbiAgICBub3cgPSBEYXRlLm5vdygpIC0gdGhpcy5zdGF0ZS56ZXJvO1xuICAgIM6UdCA9IG5vdyAtIHRoaXMuc3RhdGUudGltZTtcbiAgICB0aGlzLnN0YXRlLnRpbWUgPSBub3c7XG4gICAgdGhpcy5zdGF0ZS5mcmFtZSA9IHRoaXMuc3RhdGUuZnJhbWUgKyAxO1xuICAgIHRoaXMub25GcmFtZSjOlHQsIHRoaXMuc3RhdGUudGltZSwgdGhpcy5zdGF0ZS5mcmFtZSk7XG4gICAgaWYgKHRoaXMuc3RhdGUucnVubmluZykge1xuICAgICAgcmV0dXJuIHJhZih0aGlzLmZyYW1lKTtcbiAgICB9XG4gIH07XG4gIHByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHRoaXMuc3RhdGUucnVubmluZyA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsb2coXCJGcmFtZURyaXZlcjo6U3RhcnQgLSBzdGFydGluZ1wiKTtcbiAgICB0aGlzLnN0YXRlLnplcm8gPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuc3RhdGUudGltZSA9IDA7XG4gICAgdGhpcy5zdGF0ZS5ydW5uaW5nID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5mcmFtZSgpO1xuICB9O1xuICBwcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHRoaXMuc3RhdGUucnVubmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbG9nKFwiRnJhbWVEcml2ZXI6OlN0b3AgLSBzdG9wcGluZ1wiKTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5ydW5uaW5nID0gZmFsc2U7XG4gIH07XG4gIHJldHVybiBGcmFtZURyaXZlcjtcbn0oKSk7XG5mdW5jdGlvbiBiaW5kJChvYmosIGtleSwgdGFyZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiAodGFyZ2V0IHx8IG9iailba2V5XS5hcHBseShvYmosIGFyZ3VtZW50cykgfTtcbn0iLCJ2YXIgcmVmJCwgaWQsIGxvZywgZWwsIHBpLCB0YXUsIGZsb29yLCBIZXJvLCBvdXQkID0gdHlwZW9mIGV4cG9ydHMgIT0gJ3VuZGVmaW5lZCcgJiYgZXhwb3J0cyB8fCB0aGlzO1xucmVmJCA9IHJlcXVpcmUoJ3N0ZCcpLCBpZCA9IHJlZiQuaWQsIGxvZyA9IHJlZiQubG9nLCBlbCA9IHJlZiQuZWwsIHBpID0gcmVmJC5waSwgdGF1ID0gcmVmJC50YXUsIGZsb29yID0gcmVmJC5mbG9vcjtcbm91dCQuSGVybyA9IEhlcm8gPSAoZnVuY3Rpb24oKXtcbiAgSGVyby5kaXNwbGF5TmFtZSA9ICdIZXJvJztcbiAgdmFyIHByb3RvdHlwZSA9IEhlcm8ucHJvdG90eXBlLCBjb25zdHJ1Y3RvciA9IEhlcm87XG4gIGZ1bmN0aW9uIEhlcm8ocG9zLCBkaW0pe1xuICAgIHZhciB3LCBoO1xuICAgIHRoaXMueCA9IHBvc1swXSwgdGhpcy55ID0gcG9zWzFdLCB0aGlzLnogPSBwb3NbMl07XG4gICAgdyA9IGRpbVswXSwgaCA9IGRpbVsxXTtcbiAgICBsb2coXCJuZXcgSGVybzpcIiwgcG9zKTtcbiAgICB0aGlzLmNhbnZhcyA9IGVsKCdjYW52YXMnKTtcbiAgICB0aGlzLncgPSB0aGlzLmNhbnZhcy53aWR0aCA9IHcgKiAyO1xuICAgIHRoaXMuaCA9IHRoaXMuY2FudmFzLmhlaWdodCA9IGggKiAyO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy5jYW52YXMuc3R5bGUubGVmdCA9ICgxMDAgLyAyIC0gdyAvIDIpICsgXCJweFwiO1xuICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdyArICdweCc7XG4gICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gaCArICdweCc7XG4gICAgdGhpcy5kcmF3KCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gIH1cbiAgcHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICByZXR1cm4gdGhpcy5jYW52YXMuc3R5bGUudG9wID0gKHZhbHVlIC0gdGhpcy5oIC8gMikgKyBcInB4XCI7XG4gIH07XG4gIHByb3RvdHlwZS5hcHBlbmRUbyA9IGZ1bmN0aW9uKGhvc3Qpe1xuICAgIHJldHVybiBob3N0LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcbiAgfTtcbiAgcHJvdG90eXBlLmJsaXRUbyA9IGZ1bmN0aW9uKHRhcmdldCwgeCwgeSwgzrEpe1xuICAgIHRhcmdldC5jdHguZ2xvYmFsQWxwaGEgPSDOsTtcbiAgICB0YXJnZXQuY3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhcywgeCwgeSwgdGhpcy5jYW52YXMud2lkdGggLyAyLCB0aGlzLmNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgICByZXR1cm4gdGFyZ2V0LmN0eC5nbG9iYWxBbHBoYSA9IDE7XG4gIH07XG4gIHByb3RvdHlwZS5kcmF3Q2FwZSA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyMwMGUnO1xuICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLncgLyAyLCB0aGlzLmggLyA0KTtcbiAgICB0aGlzLmN0eC5saW5lVG8odGhpcy53LCB0aGlzLmggKiAzIC8gNCk7XG4gICAgdGhpcy5jdHgubGluZVRvKDAsIHRoaXMuaCAqIDMgLyA0KTtcbiAgICB0aGlzLmN0eC5saW5lVG8odGhpcy53IC8gMiwgdGhpcy5oIC8gNCk7XG4gICAgdGhpcy5jdHguZmlsbCgpO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjMDBiJztcbiAgICB0aGlzLmN0eC5tb3ZlVG8odGhpcy53IC8gMiwgdGhpcy5oICogMiAvIDUpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncsIHRoaXMuaCAqIDMgLyA0KTtcbiAgICB0aGlzLmN0eC5saW5lVG8oMCwgdGhpcy5oICogMyAvIDQpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncgLyAyLCB0aGlzLmggKiAyIC8gNSk7XG4gICAgcmV0dXJuIHRoaXMuY3R4LmZpbGwoKTtcbiAgfTtcbiAgcHJvdG90eXBlLmRyYXdUb3JzbyA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJ2dyZXknO1xuICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLncgKiAxIC8gMiwgdGhpcy5oICogMiAvIDUpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncgKiAzIC8gNCwgdGhpcy5oICogMyAvIDQpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncgKiAxIC8gMiwgdGhpcy5oICogNCAvIDQpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncgKiAxIC8gNCwgdGhpcy5oICogMyAvIDQpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncgKiAxIC8gMiwgdGhpcy5oICogMiAvIDUpO1xuICAgIHJldHVybiB0aGlzLmN0eC5maWxsKCk7XG4gIH07XG4gIHByb3RvdHlwZS5kcmF3RmFjZSA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyM4NTInO1xuICAgIHRoaXMuY3R4LmFyYyh0aGlzLncgLyAyLCB0aGlzLmggLyA0LCB0aGlzLncgLyA0LCAwLCB0YXUpO1xuICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnI2ZjYSc7XG4gICAgdGhpcy5jdHguYXJjKHRoaXMudyAvIDIsIHRoaXMuaCAvIDQgKyB0aGlzLncgLyAyMCwgdGhpcy5oIC8gMTAsIDAsIHRhdSk7XG4gICAgcmV0dXJuIHRoaXMuY3R4LmZpbGwoKTtcbiAgfTtcbiAgcHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbijOsSl7XG4gICAgdGhpcy5kcmF3Q2FwZSgpO1xuICAgIHRoaXMuZHJhd1RvcnNvKCk7XG4gICAgcmV0dXJuIHRoaXMuZHJhd0ZhY2UoKTtcbiAgfTtcbiAgcmV0dXJuIEhlcm87XG59KCkpOyIsInZhciByZWYkLCBpZCwgbG9nLCBlbCwgZmxvb3IsIE1hcmtlciwgb3V0JCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnICYmIGV4cG9ydHMgfHwgdGhpcztcbnJlZiQgPSByZXF1aXJlKCdzdGQnKSwgaWQgPSByZWYkLmlkLCBsb2cgPSByZWYkLmxvZywgZWwgPSByZWYkLmVsLCBmbG9vciA9IHJlZiQuZmxvb3I7XG5vdXQkLk1hcmtlciA9IE1hcmtlciA9IChmdW5jdGlvbigpe1xuICBNYXJrZXIuZGlzcGxheU5hbWUgPSAnTWFya2VyJztcbiAgdmFyIHByb3RvdHlwZSA9IE1hcmtlci5wcm90b3R5cGUsIGNvbnN0cnVjdG9yID0gTWFya2VyO1xuICBmdW5jdGlvbiBNYXJrZXIoY29sLCBwb3MsIHNoYWRvdyl7XG4gICAgcG9zID09IG51bGwgJiYgKHBvcyA9IDApO1xuICAgIHNoYWRvdyA9PSBudWxsICYmIChzaGFkb3cgPSAwKTtcbiAgICB0aGlzLmRvbSA9IGVsKCdkaXYnKTtcbiAgICBpbXBvcnQkKHRoaXMuZG9tLnN0eWxlLCB7XG4gICAgICBiYWNrZ3JvdW5kOiBjb2wsXG4gICAgICBoZWlnaHQ6ICcxcHgnLFxuICAgICAgd2lkdGg6ICcxMDBweCcsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGxlZnQ6IDBcbiAgICB9KTtcbiAgICB0aGlzLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICAgIHRoaXMuc2V0KHBvcyk7XG4gICAgaWYgKHNoYWRvdykge1xuICAgICAgdGhpcy5zZXRTaGFkb3coc2hhZG93KTtcbiAgICB9XG4gIH1cbiAgcHJvdG90eXBlLmFwcGVuZFRvID0gZnVuY3Rpb24oaG9zdCl7XG4gICAgcmV0dXJuIGhvc3QuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xuICB9O1xuICBwcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24odmFsdWUpe1xuICAgIHJldHVybiB0aGlzLmRvbS5zdHlsZS50b3AgPSBmbG9vcih2YWx1ZSkgKyAncHgnO1xuICB9O1xuICBwcm90b3R5cGUuc2V0U2hhZG93ID0gZnVuY3Rpb24odmFsdWUpe1xuICAgIHJldHVybiB0aGlzLmRvbS5zdHlsZS5ib3JkZXJCb3R0b20gPSBmbG9vcih2YWx1ZSAqIDEwMCkgKyBcInB4IHNvbGlkICM0NDRcIjtcbiAgfTtcbiAgcmV0dXJuIE1hcmtlcjtcbn0oKSk7XG5mdW5jdGlvbiBpbXBvcnQkKG9iaiwgc3JjKXtcbiAgdmFyIG93biA9IHt9Lmhhc093blByb3BlcnR5O1xuICBmb3IgKHZhciBrZXkgaW4gc3JjKSBpZiAob3duLmNhbGwoc3JjLCBrZXkpKSBvYmpba2V5XSA9IHNyY1trZXldO1xuICByZXR1cm4gb2JqO1xufSIsInZhciByZWYkLCBpZCwgbG9nLCBlbCwgZmxvb3IsIEJsaXR0ZXIsIE91dHB1dCwgb3V0JCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnICYmIGV4cG9ydHMgfHwgdGhpcztcbnJlZiQgPSByZXF1aXJlKCdzdGQnKSwgaWQgPSByZWYkLmlkLCBsb2cgPSByZWYkLmxvZywgZWwgPSByZWYkLmVsLCBmbG9vciA9IHJlZiQuZmxvb3I7XG5CbGl0dGVyID0gKGZ1bmN0aW9uKCl7XG4gIEJsaXR0ZXIuZGlzcGxheU5hbWUgPSAnQmxpdHRlcic7XG4gIHZhciBwcm90b3R5cGUgPSBCbGl0dGVyLnByb3RvdHlwZSwgY29uc3RydWN0b3IgPSBCbGl0dGVyO1xuICBmdW5jdGlvbiBCbGl0dGVyKHcsIGgpe1xuICAgIHRoaXMuY2FudmFzID0gZWwoJ2NhbnZhcycpO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLnNpemVUbyh3LCBoKTtcbiAgfVxuICBwcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53LCB0aGlzLmgpO1xuICB9O1xuICBwcm90b3R5cGUuc2l6ZVRvID0gZnVuY3Rpb24odywgaCl7XG4gICAgdGhpcy53ID0gdGhpcy5jYW52YXMud2lkdGggPSB3O1xuICAgIHJldHVybiB0aGlzLmggPSB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoO1xuICB9O1xuICBwcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbihob3N0KXtcbiAgICByZXR1cm4gaG9zdC5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gIH07XG4gIHByb3RvdHlwZS5ibGl0VG8gPSBmdW5jdGlvbih0YXJnZXQsIHgsIHksIM6xKXtcbiAgICDOsSA9PSBudWxsICYmICjOsSA9IDEpO1xuICAgIHRhcmdldC5jdHguZ2xvYmFsQWxwaGEgPSDOsTtcbiAgICB0YXJnZXQuY3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhcywgeCwgeSwgdGhpcy53LCB0aGlzLmgpO1xuICAgIHJldHVybiB0YXJnZXQuY3R4Lmdsb2JhbEFscGhhID0gMTtcbiAgfTtcbiAgcmV0dXJuIEJsaXR0ZXI7XG59KCkpO1xub3V0JC5PdXRwdXQgPSBPdXRwdXQgPSAoZnVuY3Rpb24oc3VwZXJjbGFzcyl7XG4gIHZhciBwcm90b3R5cGUgPSBleHRlbmQkKChpbXBvcnQkKE91dHB1dCwgc3VwZXJjbGFzcykuZGlzcGxheU5hbWUgPSAnT3V0cHV0JywgT3V0cHV0KSwgc3VwZXJjbGFzcykucHJvdG90eXBlLCBjb25zdHJ1Y3RvciA9IE91dHB1dDtcbiAgZnVuY3Rpb24gT3V0cHV0KHcsIGgsIM6yKXtcbiAgICB0aGlzLmdyaWQgPSBuZXcgQmxpdHRlcih3LCBoKTtcbiAgICB0aGlzLmdyb3VuZCA9IG5ldyBCbGl0dGVyKHcsIGgpO1xuICAgIE91dHB1dC5zdXBlcmNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZWRyYXcozrIpO1xuICB9XG4gIHByb3RvdHlwZS5kcmF3R3JvdW5kID0gZnVuY3Rpb24ozrIpe1xuICAgIHZhciBpJCwgdG8kLCBpLCByZXN1bHRzJCA9IFtdO1xuICAgIGZvciAoaSQgPSAwLCB0byQgPSB0aGlzLmg7IM6yIDwgMCA/IGkkID49IHRvJCA6IGkkIDw9IHRvJDsgaSQgKz0gzrIpIHtcbiAgICAgIGkgPSBpJDtcbiAgICAgIHRoaXMuZ3JvdW5kLmN0eC5maWxsU3R5bGUgPSBcInJnYihcIiArIGZsb29yKDkwIC0gaSAvIHRoaXMuaCAqIDYwKSArIFwiLCBcIiArIGZsb29yKDE2MCAtIGkgLyB0aGlzLmggKiAzMCkgKyBcIiwgNTApXCI7XG4gICAgICByZXN1bHRzJC5wdXNoKHRoaXMuZ3JvdW5kLmN0eC5maWxsUmVjdCgwLCBpLCB0aGlzLncsIHRoaXMuaCAtIGkpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHMkO1xuICB9O1xuICBwcm90b3R5cGUuZHJhd0dyaWQgPSBmdW5jdGlvbijOsil7XG4gICAgdmFyIGkkLCB0byQsIHgsIHk7XG4gICAgdGhpcy5ncmlkLmdsb2JhbEFscGhhID0gMC4xO1xuICAgIHRoaXMuZ3JpZC5jdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMjU1LDI1NSwyNTUsMC4xKVwiO1xuICAgIHRoaXMuZ3JpZC5jdHguYmVnaW5QYXRoKCk7XG4gICAgZm9yIChpJCA9IDAsIHRvJCA9IHRoaXMudzsgzrIgPCAwID8gaSQgPj0gdG8kIDogaSQgPD0gdG8kOyBpJCArPSDOsikge1xuICAgICAgeCA9IGkkO1xuICAgICAgdGhpcy5ncmlkLmN0eC5tb3ZlVG8oMC41ICsgeCwgMCk7XG4gICAgICB0aGlzLmdyaWQuY3R4LmxpbmVUbygwLjUgKyB4LCB0aGlzLmgpO1xuICAgIH1cbiAgICBmb3IgKGkkID0gMCwgdG8kID0gdGhpcy5oOyDOsiA8IDAgPyBpJCA+PSB0byQgOiBpJCA8PSB0byQ7IGkkICs9IM6yKSB7XG4gICAgICB5ID0gaSQ7XG4gICAgICB0aGlzLmdyaWQuY3R4Lm1vdmVUbygwLjUsIDAuNSArIHkpO1xuICAgICAgdGhpcy5ncmlkLmN0eC5saW5lVG8odGhpcy53LCAwLjUgKyB5KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ3JpZC5jdHguc3Ryb2tlKCk7XG4gIH07XG4gIHByb3RvdHlwZS5yZWRyYXcgPSBmdW5jdGlvbijOsil7XG4gICAgdGhpcy5kcmF3R3JvdW5kKM6yKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3R3JpZCjOsik7XG4gIH07XG4gIHByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24ozrIsIGdsaWRlKXtcbiAgICBnbGlkZSA9PSBudWxsICYmIChnbGlkZSA9IDApO1xuICAgIHRoaXMuZ3JvdW5kLmJsaXRUbyh0aGlzLCAwLCAwKTtcbiAgICByZXR1cm4gdGhpcy5ncmlkLmJsaXRUbyh0aGlzLCAwLCBnbGlkZSAlIM6yKTtcbiAgfTtcbiAgcHJvdG90eXBlLnNpemVUbyA9IGZ1bmN0aW9uKHcsIGgpe1xuICAgIHN1cGVyY2xhc3MucHJvdG90eXBlLnNpemVUby5jYWxsKHRoaXMsIHcsIGgpO1xuICAgIHRoaXMuZ3JpZC5zaXplVG8odywgaCk7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdW5kLnNpemVUbyh3LCBoKTtcbiAgfTtcbiAgcmV0dXJuIE91dHB1dDtcbn0oQmxpdHRlcikpO1xuZnVuY3Rpb24gZXh0ZW5kJChzdWIsIHN1cCl7XG4gIGZ1bmN0aW9uIGZ1bigpe30gZnVuLnByb3RvdHlwZSA9IChzdWIuc3VwZXJjbGFzcyA9IHN1cCkucHJvdG90eXBlO1xuICAoc3ViLnByb3RvdHlwZSA9IG5ldyBmdW4pLmNvbnN0cnVjdG9yID0gc3ViO1xuICBpZiAodHlwZW9mIHN1cC5leHRlbmRlZCA9PSAnZnVuY3Rpb24nKSBzdXAuZXh0ZW5kZWQoc3ViKTtcbiAgcmV0dXJuIHN1Yjtcbn1cbmZ1bmN0aW9uIGltcG9ydCQob2JqLCBzcmMpe1xuICB2YXIgb3duID0ge30uaGFzT3duUHJvcGVydHk7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIGlmIChvd24uY2FsbChzcmMsIGtleSkpIG9ialtrZXldID0gc3JjW2tleV07XG4gIHJldHVybiBvYmo7XG59IiwidmFyIHJlZiQsIGlkLCBsb2csIGVsLCBmbG9vciwgUm9vbSwgb3V0JCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnICYmIGV4cG9ydHMgfHwgdGhpcztcbnJlZiQgPSByZXF1aXJlKCdzdGQnKSwgaWQgPSByZWYkLmlkLCBsb2cgPSByZWYkLmxvZywgZWwgPSByZWYkLmVsLCBmbG9vciA9IHJlZiQuZmxvb3I7XG5vdXQkLlJvb20gPSBSb29tID0gKGZ1bmN0aW9uKCl7XG4gIFJvb20uZGlzcGxheU5hbWUgPSAnUm9vbSc7XG4gIHZhciBwcm90b3R5cGUgPSBSb29tLnByb3RvdHlwZSwgY29uc3RydWN0b3IgPSBSb29tO1xuICBmdW5jdGlvbiBSb29tKHBvcywgZGltLCDOsil7XG4gICAgdGhpcy54ID0gcG9zWzBdLCB0aGlzLnkgPSBwb3NbMV0sIHRoaXMueiA9IHBvc1syXTtcbiAgICB0aGlzLncgPSBkaW1bMF0sIHRoaXMuaCA9IGRpbVsxXSwgdGhpcy5kID0gZGltWzJdO1xuICAgIHRoaXMuzrIgPSDOsiAhPSBudWxsID8gzrIgOiA1MDtcbiAgICB0aGlzLmNhbnZhcyA9IGVsKCdjYW52YXMnKTtcbiAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JlZCc7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy7OsiAqIHRoaXMudztcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLs6yICogKHRoaXMuaCArIHRoaXMuZCk7XG4gICAgdGhpcy5nZW5lcmF0ZShkaW0pO1xuICAgIHRoaXMuZHJhdygpO1xuICB9XG4gIHByb3RvdHlwZS5zcGl0ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgeSwgcm93O1xuICAgIHJldHVybiBsb2coZnVuY3Rpb24oaXQpe1xuICAgICAgcmV0dXJuIGl0LmpvaW4oXCJcXG5cIik7XG4gICAgfSgoZnVuY3Rpb24oKXtcbiAgICAgIHZhciBpJCwgcmVmJCwgbGVuJCwgcmVzdWx0cyQgPSBbXTtcbiAgICAgIGZvciAoaSQgPSAwLCBsZW4kID0gKHJlZiQgPSB0aGlzLnRpbGVzKS5sZW5ndGg7IGkkIDwgbGVuJDsgKytpJCkge1xuICAgICAgICB5ID0gaSQ7XG4gICAgICAgIHJvdyA9IHJlZiRbaSRdO1xuICAgICAgICByZXN1bHRzJC5wdXNoKHJvdy5qb2luKCd8JykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHMkO1xuICAgIH0uY2FsbCh0aGlzKSkpKTtcbiAgfTtcbiAgcHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oYXJnJCl7XG4gICAgdmFyIHcsIGgsIGQsIHksIHg7XG4gICAgdyA9IGFyZyRbMF0sIGggPSBhcmckWzFdLCBkID0gYXJnJFsyXTtcbiAgICByZXR1cm4gdGhpcy50aWxlcyA9IChmdW5jdGlvbigpe1xuICAgICAgdmFyIGkkLCB0byQsIGxyZXN1bHQkLCBqJCwgdG8xJCwgcmVzdWx0cyQgPSBbXTtcbiAgICAgIGZvciAoaSQgPSAwLCB0byQgPSBoOyBpJCA8IHRvJDsgKytpJCkge1xuICAgICAgICB5ID0gaSQ7XG4gICAgICAgIGxyZXN1bHQkID0gW107XG4gICAgICAgIGZvciAoaiQgPSAwLCB0bzEkID0gdzsgaiQgPCB0bzEkOyArK2okKSB7XG4gICAgICAgICAgeCA9IGokO1xuICAgICAgICAgIGlmICh5ID09PSAwIHx8IHggPT09IDAgfHwgeCA9PT0gdyAtIDEpIHtcbiAgICAgICAgICAgIGxyZXN1bHQkLnB1c2goMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxyZXN1bHQkLnB1c2goMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHMkLnB1c2gobHJlc3VsdCQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHMkO1xuICAgIH0oKSk7XG4gIH07XG4gIHByb3RvdHlwZS5kcmF3QmxvY2sgPSBmdW5jdGlvbih4LCB5LCB6KXtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnIzg4OCc7XG4gICAgdGhpcy5jdHguZmlsbFJlY3QoeCAqIHRoaXMuzrIsICh0aGlzLmQgKyB5IC0gMSkgKiB0aGlzLs6yIC0gMSAtIHogKiB0aGlzLs6yLCB0aGlzLs6yLCB0aGlzLs6yICogMik7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyNhYWEnO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KHggKiB0aGlzLs6yLCAodGhpcy5kICsgeSAtIDApICogdGhpcy7OsiAtIDEgLSB6ICogdGhpcy7OsiwgdGhpcy7OsiAtIDEsIHRoaXMuzrIgLSAxKTtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnI2VlZSc7XG4gICAgcmV0dXJuIHRoaXMuY3R4LmZpbGxSZWN0KHggKiB0aGlzLs6yLCAodGhpcy5kICsgeSAtIDEpICogdGhpcy7OsiAtIDEgLSB6ICogdGhpcy7OsiwgdGhpcy7OsiAtIDEsIHRoaXMuzrIgLSAxKTtcbiAgfTtcbiAgcHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbih6LCB2KXtcbiAgICB2YXIgaSQsIHRvJCwgbHJlc3VsdCQsIGokLCByZWYkLCBsZW4kLCB5LCByb3csIGxyZXN1bHQxJCwgayQsIGxlbjEkLCB4LCB3YWxsLCByZXN1bHRzJCA9IFtdO1xuICAgIHogPT0gbnVsbCAmJiAoeiA9IDApO1xuICAgIHYgPT0gbnVsbCAmJiAodiA9IDUwICsgMTAgKiB0aGlzLnopO1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmdiKFwiICsgdiArIFwiLCBcIiArIHYgKyBcIiwgXCIgKyB2ICsgXCIpXCI7XG4gICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgdGhpcy7OsiAqIHRoaXMuZCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCAtIHRoaXMuzrIgKiB0aGlzLmQpO1xuICAgIGZvciAoaSQgPSAwLCB0byQgPSB0aGlzLmQ7IGkkIDwgdG8kOyArK2kkKSB7XG4gICAgICB6ID0gaSQ7XG4gICAgICBscmVzdWx0JCA9IFtdO1xuICAgICAgZm9yIChqJCA9IDAsIGxlbiQgPSAocmVmJCA9IHRoaXMudGlsZXMpLmxlbmd0aDsgaiQgPCBsZW4kOyArK2okKSB7XG4gICAgICAgIHkgPSBqJDtcbiAgICAgICAgcm93ID0gcmVmJFtqJF07XG4gICAgICAgIGxyZXN1bHQxJCA9IFtdO1xuICAgICAgICBmb3IgKGskID0gMCwgbGVuMSQgPSByb3cubGVuZ3RoOyBrJCA8IGxlbjEkOyArK2skKSB7XG4gICAgICAgICAgeCA9IGskO1xuICAgICAgICAgIHdhbGwgPSByb3dbayRdO1xuICAgICAgICAgIGlmICh3YWxsKSB7XG4gICAgICAgICAgICBscmVzdWx0MSQucHVzaCh0aGlzLmRyYXdCbG9jayh4LCB5LCB6KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxyZXN1bHQkLnB1c2gobHJlc3VsdDEkKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdHMkLnB1c2gobHJlc3VsdCQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cyQ7XG4gIH07XG4gIHByb3RvdHlwZS5ibGl0VG8gPSBmdW5jdGlvbih0YXJnZXQsIHgsIHksIM6xKXtcbiAgICDOsSA9PSBudWxsICYmICjOsSA9IDEpO1xuICAgIHRhcmdldC5jdHguZ2xvYmFsQWxwaGEgPSDOsTtcbiAgICB0YXJnZXQuY3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhcywgeCwgeSwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgcmV0dXJuIHRhcmdldC5jdHguZ2xvYmFsQWxwaGEgPSAxO1xuICB9O1xuICByZXR1cm4gUm9vbTtcbn0oKSk7IiwidmFyIGlkLCBsb2csIGZsaXAsIHNpbiwgY29zLCBwaSwgdGF1LCBkZWxheSwgZmxvb3IsIHJhbmRvbSwgcmFuZCwgcmFuZG9tRnJvbSwgYWRkVjIsIGZpbHRlciwgZWwsIGNsYW1wWmVybywgZWFzZU91dCwgd3JhcCwgbGltaXQsIHJhZiwgdGhhdCwgb3V0JCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnICYmIGV4cG9ydHMgfHwgdGhpcztcbm91dCQuaWQgPSBpZCA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0O1xufTtcbm91dCQubG9nID0gbG9nID0gZnVuY3Rpb24oKXtcbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbn07XG5vdXQkLmZsaXAgPSBmbGlwID0gZnVuY3Rpb24ozrspe1xuICByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgcmV0dXJuIM67KGIsIGEpO1xuICB9O1xufTtcbm91dCQuc2luID0gc2luID0gTWF0aC5zaW47XG5vdXQkLmNvcyA9IGNvcyA9IE1hdGguY29zO1xub3V0JC5waSA9IHBpID0gTWF0aC5QSTtcbm91dCQudGF1ID0gdGF1ID0gcGkgKiAyO1xub3V0JC5kZWxheSA9IGRlbGF5ID0gZmxpcChzZXRUaW1lb3V0KTtcbm91dCQuZmxvb3IgPSBmbG9vciA9IE1hdGguZmxvb3I7XG5vdXQkLnJhbmRvbSA9IHJhbmRvbSA9IE1hdGgucmFuZG9tO1xub3V0JC5yYW5kID0gcmFuZCA9IGZ1bmN0aW9uKG1pbiwgbWF4KXtcbiAgcmV0dXJuIG1pbiArIGZsb29yKHJhbmRvbSgpICogKG1heCAtIG1pbikpO1xufTtcbm91dCQucmFuZG9tRnJvbSA9IHJhbmRvbUZyb20gPSBmdW5jdGlvbihsaXN0KXtcbiAgcmV0dXJuIGxpc3RbcmFuZCgwLCBsaXN0Lmxlbmd0aCAtIDEpXTtcbn07XG5vdXQkLmFkZFYyID0gYWRkVjIgPSBmdW5jdGlvbihhLCBiKXtcbiAgcmV0dXJuIFthWzBdICsgYlswXSwgYVsxXSArIGJbMV1dO1xufTtcbm91dCQuZmlsdGVyID0gZmlsdGVyID0gY3VycnkkKGZ1bmN0aW9uKM67LCBsaXN0KXtcbiAgdmFyIGkkLCBsZW4kLCB4LCByZXN1bHRzJCA9IFtdO1xuICBmb3IgKGkkID0gMCwgbGVuJCA9IGxpc3QubGVuZ3RoOyBpJCA8IGxlbiQ7ICsraSQpIHtcbiAgICB4ID0gbGlzdFtpJF07XG4gICAgaWYgKM67KHgpKSB7XG4gICAgICByZXN1bHRzJC5wdXNoKHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0cyQ7XG59KTtcbm91dCQuZWwgPSBlbCA9IGJpbmQkKGRvY3VtZW50LCAnY3JlYXRlRWxlbWVudCcpO1xub3V0JC5jbGFtcFplcm8gPSBjbGFtcFplcm8gPSBmdW5jdGlvbihpdCl7XG4gIGlmIChpdCA8IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaXQ7XG4gIH1cbn07XG5vdXQkLmVhc2VPdXQgPSBlYXNlT3V0ID0gZnVuY3Rpb24odCwgYiwgYywgZCl7XG4gIHJldHVybiAtYyAqICh0IC89IGQpICogKHQgLSAyKSArIGI7XG59O1xub3V0JC53cmFwID0gd3JhcCA9IGN1cnJ5JChmdW5jdGlvbihtaW4sIG1heCwgbil7XG4gIGlmIChuID4gbWF4KSB7XG4gICAgcmV0dXJuIG1pbjtcbiAgfSBlbHNlIGlmIChuIDwgbWluKSB7XG4gICAgcmV0dXJuIG1heDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbjtcbiAgfVxufSk7XG5vdXQkLmxpbWl0ID0gbGltaXQgPSBjdXJyeSQoZnVuY3Rpb24obWluLCBtYXgsIG4pe1xuICBpZiAobiA+IG1heCkge1xuICAgIHJldHVybiBtYXg7XG4gIH0gZWxzZSBpZiAobiA8IG1pbikge1xuICAgIHJldHVybiBtaW47XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG47XG4gIH1cbn0pO1xub3V0JC5yYWYgPSByYWYgPSAodGhhdCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpICE9IG51bGxcbiAgPyB0aGF0XG4gIDogKHRoYXQgPSB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lKSAhPSBudWxsXG4gICAgPyB0aGF0XG4gICAgOiAodGhhdCA9IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUpICE9IG51bGxcbiAgICAgID8gdGhhdFxuICAgICAgOiBmdW5jdGlvbijOuyl7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KM67LCAxMDAwIC8gNjApO1xuICAgICAgfTtcbmZ1bmN0aW9uIGN1cnJ5JChmLCBib3VuZCl7XG4gIHZhciBjb250ZXh0LFxuICBfY3VycnkgPSBmdW5jdGlvbihhcmdzKSB7XG4gICAgcmV0dXJuIGYubGVuZ3RoID4gMSA/IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgcGFyYW1zID0gYXJncyA/IGFyZ3MuY29uY2F0KCkgOiBbXTtcbiAgICAgIGNvbnRleHQgPSBib3VuZCA/IGNvbnRleHQgfHwgdGhpcyA6IHRoaXM7XG4gICAgICByZXR1cm4gcGFyYW1zLnB1c2guYXBwbHkocGFyYW1zLCBhcmd1bWVudHMpIDxcbiAgICAgICAgICBmLmxlbmd0aCAmJiBhcmd1bWVudHMubGVuZ3RoID9cbiAgICAgICAgX2N1cnJ5LmNhbGwoY29udGV4dCwgcGFyYW1zKSA6IGYuYXBwbHkoY29udGV4dCwgcGFyYW1zKTtcbiAgICB9IDogZjtcbiAgfTtcbiAgcmV0dXJuIF9jdXJyeSgpO1xufVxuZnVuY3Rpb24gYmluZCQob2JqLCBrZXksIHRhcmdldCl7XG4gIHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gKHRhcmdldCB8fCBvYmopW2tleV0uYXBwbHkob2JqLCBhcmd1bWVudHMpIH07XG59Il19
