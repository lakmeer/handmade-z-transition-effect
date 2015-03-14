(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ref$, id, log, sin, cos, tau, limit, floor, clampZero, easeOut, FrameDriver, Output, Room, Marker, Hero, options, roomHeight, tileSize, β, flightRange, transitionThreshold, roomPos, roomDim, roomBoundsX, roomBoundsY, output, markers, res$, i$, i, rooms, hero, heroMarker, frameDriver, drawShadow, drawFrame;
ref$ = require('std'), id = ref$.id, log = ref$.log, sin = ref$.sin, cos = ref$.cos, tau = ref$.tau, limit = ref$.limit, floor = ref$.floor, clampZero = ref$.clampZero, easeOut = ref$.easeOut;
FrameDriver = require('./frame-driver').FrameDriver;
Output = require('./output').Output;
Room = require('./room').Room;
Marker = require('./marker').Marker;
Hero = require('./hero').Hero;
options = {
  cameraFollow: true,
  mouseControl: false
};
roomHeight = 3;
tileSize = β = 20;
flightRange = 13;
transitionThreshold = 1 / 3;
roomPos = [2, 10];
roomDim = [15, 9, roomHeight];
roomBoundsX = limit(1 + roomPos[0], roomPos[0] + roomDim[0] - 2);
roomBoundsY = limit(1 + roomPos[1], roomPos[1] + roomDim[1] - 1);
output = new Output(window.innerWidth - 100, window.innerHeight, β);
res$ = [];
for (i$ = 0; i$ <= 4; ++i$) {
  i = i$;
  res$.push(new Marker('white', i * 100 + 50));
}
markers = res$;
res$ = [];
for (i$ = 0; i$ <= 4; ++i$) {
  i = i$;
  res$.push(new Room([roomPos[0], roomDim[1], i], roomDim, β));
}
rooms = res$;
hero = new Hero([roomPos[0] + floor(roomDim[0] / 2), roomPos[1] + floor(roomDim[1] / 2), 0], [β, β * 2]);
heroMarker = new Marker('red', 400);
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
  var glide, i$, ref$, len$, room, x, y, z, w, h, d, α, v, roomX, roomY, roomZ, roomA, heroX, heroY, heroZ, shadowX, shadowY, flightZ, shadowA;
  glide = options.cameraFollow ? hero.z * β : 0;
  output.draw(β, glide);
  hero.set(400 - hero.z / roomHeight * 100 + 50);
  heroMarker.set(400 - hero.z / roomHeight * 100 + 50);
  for (i$ = 0, len$ = (ref$ = rooms).length; i$ < len$; ++i$) {
    room = ref$[i$];
    x = room.x, y = room.y, z = room.z, w = room.w, h = room.h, d = room.d;
    if (hero.z / d < z - transitionThreshold) {
      α = 0;
    } else if (hero.z / d <= z) {
      α = 2 + (-1 / transitionThreshold) * (z + transitionThreshold - hero.z / d);
      v = easeOut(α, 0, 1, 1);
    } else {
      v = 1;
      α = 1;
    }
    roomX = x * β;
    roomY = y * β - roomHeight * β;
    roomZ = z * d * β - v * β;
    roomA = α;
    room.blitTo(output, roomX, glide + roomY - roomZ, roomA);
  }
  heroX = hero.x * β;
  heroY = hero.y * β - β;
  heroZ = hero.z * β;
  hero - (α = 1);
  shadowX = (hero.x + 0.5) * β;
  shadowY = (hero.y + 0.3) * β;
  flightZ = (glide + β * transitionThreshold) % (3 * β);
  shadowA = 1 - hero.z % roomHeight / roomHeight;
  drawShadow(output.ctx, shadowX, shadowY + flightZ, shadowA);
  return hero.blitTo(output, heroX, glide + heroY - heroZ - 0.6 * β, hero - α);
};
document.addEventListener('mousemove', function(arg$){
  var pageY;
  pageY = arg$.pageY;
  if (options.mouseControl) {
    frameDriver.stop();
    hero.z = clampZero(-1 + flightRange - pageY / window.innerHeight * flightRange);
    return drawFrame();
  }
});
document.addEventListener('click', function(arg$){
  var pageY;
  pageY = arg$.pageY;
  frameDriver.start();
  return drawFrame();
});
window.addEventListener('resize', function(){
  output.sizeTo(window.innerWidth - 100, window.innerHeight);
  output.redraw(β);
  return drawFrame();
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
document.getElementById('mouse').addEventListener('change', function(){
  if (this.checked) {
    frameDriver.stop();
  }
  return options.mouseControl = this.checked;
});
output.appendTo(document.body);
output.canvas.style.marginLeft = '100px';
drawFrame();
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
    this.canvas = el('canvas');
    this.w = this.canvas.width = w * 2;
    this.h = this.canvas.height = h * 2;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = (80 / 2 - w / 2) + "px";
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
  function Marker(col, pos){
    pos == null && (pos = 0);
    this.dom = el('div');
    import$(this.dom.style, {
      background: col,
      height: '1px',
      width: '80px',
      position: 'absolute',
      left: 0
    });
    this.appendTo(document.body);
    this.set(pos);
  }
  prototype.appendTo = function(host){
    return host.appendChild(this.dom);
  };
  prototype.set = function(value){
    return this.dom.style.top = floor(value) + 'px';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9pbmRleC5scyIsIi9Vc2Vycy9sYWttZWVyL1Byb2plY3RzL2hhbmRtYWRlLXotZWZmZWN0L3NyYy9mcmFtZS1kcml2ZXIubHMiLCIvVXNlcnMvbGFrbWVlci9Qcm9qZWN0cy9oYW5kbWFkZS16LWVmZmVjdC9zcmMvaGVyby5scyIsIi9Vc2Vycy9sYWttZWVyL1Byb2plY3RzL2hhbmRtYWRlLXotZWZmZWN0L3NyYy9tYXJrZXIubHMiLCIvVXNlcnMvbGFrbWVlci9Qcm9qZWN0cy9oYW5kbWFkZS16LWVmZmVjdC9zcmMvb3V0cHV0LmxzIiwiL1VzZXJzL2xha21lZXIvUHJvamVjdHMvaGFuZG1hZGUtei1lZmZlY3Qvc3JjL3Jvb20ubHMiLCIvVXNlcnMvbGFrbWVlci9Qcm9qZWN0cy9oYW5kbWFkZS16LWVmZmVjdC9zcmMvc3RkL2luZGV4LmxzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmVmJCwgaWQsIGxvZywgc2luLCBjb3MsIHRhdSwgbGltaXQsIGZsb29yLCBjbGFtcFplcm8sIGVhc2VPdXQsIEZyYW1lRHJpdmVyLCBPdXRwdXQsIFJvb20sIE1hcmtlciwgSGVybywgb3B0aW9ucywgcm9vbUhlaWdodCwgdGlsZVNpemUsIM6yLCBmbGlnaHRSYW5nZSwgdHJhbnNpdGlvblRocmVzaG9sZCwgcm9vbVBvcywgcm9vbURpbSwgcm9vbUJvdW5kc1gsIHJvb21Cb3VuZHNZLCBvdXRwdXQsIG1hcmtlcnMsIHJlcyQsIGkkLCBpLCByb29tcywgaGVybywgaGVyb01hcmtlciwgZnJhbWVEcml2ZXIsIGRyYXdTaGFkb3csIGRyYXdGcmFtZTtcbnJlZiQgPSByZXF1aXJlKCdzdGQnKSwgaWQgPSByZWYkLmlkLCBsb2cgPSByZWYkLmxvZywgc2luID0gcmVmJC5zaW4sIGNvcyA9IHJlZiQuY29zLCB0YXUgPSByZWYkLnRhdSwgbGltaXQgPSByZWYkLmxpbWl0LCBmbG9vciA9IHJlZiQuZmxvb3IsIGNsYW1wWmVybyA9IHJlZiQuY2xhbXBaZXJvLCBlYXNlT3V0ID0gcmVmJC5lYXNlT3V0O1xuRnJhbWVEcml2ZXIgPSByZXF1aXJlKCcuL2ZyYW1lLWRyaXZlcicpLkZyYW1lRHJpdmVyO1xuT3V0cHV0ID0gcmVxdWlyZSgnLi9vdXRwdXQnKS5PdXRwdXQ7XG5Sb29tID0gcmVxdWlyZSgnLi9yb29tJykuUm9vbTtcbk1hcmtlciA9IHJlcXVpcmUoJy4vbWFya2VyJykuTWFya2VyO1xuSGVybyA9IHJlcXVpcmUoJy4vaGVybycpLkhlcm87XG5vcHRpb25zID0ge1xuICBjYW1lcmFGb2xsb3c6IHRydWUsXG4gIG1vdXNlQ29udHJvbDogZmFsc2Vcbn07XG5yb29tSGVpZ2h0ID0gMztcbnRpbGVTaXplID0gzrIgPSAyMDtcbmZsaWdodFJhbmdlID0gMTM7XG50cmFuc2l0aW9uVGhyZXNob2xkID0gMSAvIDM7XG5yb29tUG9zID0gWzIsIDEwXTtcbnJvb21EaW0gPSBbMTUsIDksIHJvb21IZWlnaHRdO1xucm9vbUJvdW5kc1ggPSBsaW1pdCgxICsgcm9vbVBvc1swXSwgcm9vbVBvc1swXSArIHJvb21EaW1bMF0gLSAyKTtcbnJvb21Cb3VuZHNZID0gbGltaXQoMSArIHJvb21Qb3NbMV0sIHJvb21Qb3NbMV0gKyByb29tRGltWzFdIC0gMSk7XG5vdXRwdXQgPSBuZXcgT3V0cHV0KHdpbmRvdy5pbm5lcldpZHRoIC0gMTAwLCB3aW5kb3cuaW5uZXJIZWlnaHQsIM6yKTtcbnJlcyQgPSBbXTtcbmZvciAoaSQgPSAwOyBpJCA8PSA0OyArK2kkKSB7XG4gIGkgPSBpJDtcbiAgcmVzJC5wdXNoKG5ldyBNYXJrZXIoJ3doaXRlJywgaSAqIDEwMCArIDUwKSk7XG59XG5tYXJrZXJzID0gcmVzJDtcbnJlcyQgPSBbXTtcbmZvciAoaSQgPSAwOyBpJCA8PSA0OyArK2kkKSB7XG4gIGkgPSBpJDtcbiAgcmVzJC5wdXNoKG5ldyBSb29tKFtyb29tUG9zWzBdLCByb29tRGltWzFdLCBpXSwgcm9vbURpbSwgzrIpKTtcbn1cbnJvb21zID0gcmVzJDtcbmhlcm8gPSBuZXcgSGVybyhbcm9vbVBvc1swXSArIGZsb29yKHJvb21EaW1bMF0gLyAyKSwgcm9vbVBvc1sxXSArIGZsb29yKHJvb21EaW1bMV0gLyAyKSwgMF0sIFvOsiwgzrIgKiAyXSk7XG5oZXJvTWFya2VyID0gbmV3IE1hcmtlcigncmVkJywgNDAwKTtcbmZyYW1lRHJpdmVyID0gbmV3IEZyYW1lRHJpdmVyKGZ1bmN0aW9uKM6UdCwgdGltZSl7XG4gIGhlcm8ueiA9IGZsaWdodFJhbmdlIC8gMiArIGZsaWdodFJhbmdlIC8gMiAqIHNpbih0aW1lIC8gMjAwMCk7XG4gIHJldHVybiBkcmF3RnJhbWUoKTtcbn0pO1xuZHJhd1NoYWRvdyA9IGZ1bmN0aW9uKGN0eCwgeCwgeSwgzrEpe1xuICBvdXRwdXQuY3R4LmJlZ2luUGF0aCgpO1xuICBvdXRwdXQuY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gIG91dHB1dC5jdHguYXJjKHgsIHksIM6yIC8gMywgMCwgdGF1KTtcbiAgb3V0cHV0LmN0eC5nbG9iYWxBbHBoYSA9IDAuMiAqIM6xO1xuICBvdXRwdXQuY3R4LmZpbGwoKTtcbiAgcmV0dXJuIG91dHB1dC5jdHguZ2xvYmFsQWxwaGEgPSAxO1xufTtcbmRyYXdGcmFtZSA9IGZ1bmN0aW9uKM6UdCwgdGltZSwgZnJhbWUpe1xuICB2YXIgZ2xpZGUsIGkkLCByZWYkLCBsZW4kLCByb29tLCB4LCB5LCB6LCB3LCBoLCBkLCDOsSwgdiwgcm9vbVgsIHJvb21ZLCByb29tWiwgcm9vbUEsIGhlcm9YLCBoZXJvWSwgaGVyb1osIHNoYWRvd1gsIHNoYWRvd1ksIGZsaWdodFosIHNoYWRvd0E7XG4gIGdsaWRlID0gb3B0aW9ucy5jYW1lcmFGb2xsb3cgPyBoZXJvLnogKiDOsiA6IDA7XG4gIG91dHB1dC5kcmF3KM6yLCBnbGlkZSk7XG4gIGhlcm8uc2V0KDQwMCAtIGhlcm8ueiAvIHJvb21IZWlnaHQgKiAxMDAgKyA1MCk7XG4gIGhlcm9NYXJrZXIuc2V0KDQwMCAtIGhlcm8ueiAvIHJvb21IZWlnaHQgKiAxMDAgKyA1MCk7XG4gIGZvciAoaSQgPSAwLCBsZW4kID0gKHJlZiQgPSByb29tcykubGVuZ3RoOyBpJCA8IGxlbiQ7ICsraSQpIHtcbiAgICByb29tID0gcmVmJFtpJF07XG4gICAgeCA9IHJvb20ueCwgeSA9IHJvb20ueSwgeiA9IHJvb20ueiwgdyA9IHJvb20udywgaCA9IHJvb20uaCwgZCA9IHJvb20uZDtcbiAgICBpZiAoaGVyby56IC8gZCA8IHogLSB0cmFuc2l0aW9uVGhyZXNob2xkKSB7XG4gICAgICDOsSA9IDA7XG4gICAgfSBlbHNlIGlmIChoZXJvLnogLyBkIDw9IHopIHtcbiAgICAgIM6xID0gMiArICgtMSAvIHRyYW5zaXRpb25UaHJlc2hvbGQpICogKHogKyB0cmFuc2l0aW9uVGhyZXNob2xkIC0gaGVyby56IC8gZCk7XG4gICAgICB2ID0gZWFzZU91dCjOsSwgMCwgMSwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHYgPSAxO1xuICAgICAgzrEgPSAxO1xuICAgIH1cbiAgICByb29tWCA9IHggKiDOsjtcbiAgICByb29tWSA9IHkgKiDOsiAtIHJvb21IZWlnaHQgKiDOsjtcbiAgICByb29tWiA9IHogKiBkICogzrIgLSB2ICogzrI7XG4gICAgcm9vbUEgPSDOsTtcbiAgICByb29tLmJsaXRUbyhvdXRwdXQsIHJvb21YLCBnbGlkZSArIHJvb21ZIC0gcm9vbVosIHJvb21BKTtcbiAgfVxuICBoZXJvWCA9IGhlcm8ueCAqIM6yO1xuICBoZXJvWSA9IGhlcm8ueSAqIM6yIC0gzrI7XG4gIGhlcm9aID0gaGVyby56ICogzrI7XG4gIGhlcm8gLSAozrEgPSAxKTtcbiAgc2hhZG93WCA9IChoZXJvLnggKyAwLjUpICogzrI7XG4gIHNoYWRvd1kgPSAoaGVyby55ICsgMC4zKSAqIM6yO1xuICBmbGlnaHRaID0gKGdsaWRlICsgzrIgKiB0cmFuc2l0aW9uVGhyZXNob2xkKSAlICgzICogzrIpO1xuICBzaGFkb3dBID0gMSAtIGhlcm8ueiAlIHJvb21IZWlnaHQgLyByb29tSGVpZ2h0O1xuICBkcmF3U2hhZG93KG91dHB1dC5jdHgsIHNoYWRvd1gsIHNoYWRvd1kgKyBmbGlnaHRaLCBzaGFkb3dBKTtcbiAgcmV0dXJuIGhlcm8uYmxpdFRvKG91dHB1dCwgaGVyb1gsIGdsaWRlICsgaGVyb1kgLSBoZXJvWiAtIDAuNiAqIM6yLCBoZXJvIC0gzrEpO1xufTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGFyZyQpe1xuICB2YXIgcGFnZVk7XG4gIHBhZ2VZID0gYXJnJC5wYWdlWTtcbiAgaWYgKG9wdGlvbnMubW91c2VDb250cm9sKSB7XG4gICAgZnJhbWVEcml2ZXIuc3RvcCgpO1xuICAgIGhlcm8ueiA9IGNsYW1wWmVybygtMSArIGZsaWdodFJhbmdlIC0gcGFnZVkgLyB3aW5kb3cuaW5uZXJIZWlnaHQgKiBmbGlnaHRSYW5nZSk7XG4gICAgcmV0dXJuIGRyYXdGcmFtZSgpO1xuICB9XG59KTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oYXJnJCl7XG4gIHZhciBwYWdlWTtcbiAgcGFnZVkgPSBhcmckLnBhZ2VZO1xuICBmcmFtZURyaXZlci5zdGFydCgpO1xuICByZXR1cm4gZHJhd0ZyYW1lKCk7XG59KTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpe1xuICBvdXRwdXQuc2l6ZVRvKHdpbmRvdy5pbm5lcldpZHRoIC0gMTAwLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBvdXRwdXQucmVkcmF3KM6yKTtcbiAgcmV0dXJuIGRyYXdGcmFtZSgpO1xufSk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oYXJnJCl7XG4gIHZhciB3aGljaDtcbiAgd2hpY2ggPSBhcmckLndoaWNoO1xuICBzd2l0Y2ggKHdoaWNoKSB7XG4gIGNhc2UgMzc6XG4gICAgaGVyby54ID0gcm9vbUJvdW5kc1goaGVyby54IC0gMSk7XG4gICAgYnJlYWs7XG4gIGNhc2UgMzg6XG4gICAgaGVyby55ID0gcm9vbUJvdW5kc1koaGVyby55IC0gMSk7XG4gICAgYnJlYWs7XG4gIGNhc2UgMzk6XG4gICAgaGVyby54ID0gcm9vbUJvdW5kc1goaGVyby54ICsgMSk7XG4gICAgYnJlYWs7XG4gIGNhc2UgNDA6XG4gICAgaGVyby55ID0gcm9vbUJvdW5kc1koaGVyby55ICsgMSk7XG4gICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIGRyYXdGcmFtZSgpO1xufSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9sbG93JykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIG9wdGlvbnMuY2FtZXJhRm9sbG93ID0gdGhpcy5jaGVja2VkO1xufSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW91c2UnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgZnJhbWVEcml2ZXIuc3RvcCgpO1xuICB9XG4gIHJldHVybiBvcHRpb25zLm1vdXNlQ29udHJvbCA9IHRoaXMuY2hlY2tlZDtcbn0pO1xub3V0cHV0LmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xub3V0cHV0LmNhbnZhcy5zdHlsZS5tYXJnaW5MZWZ0ID0gJzEwMHB4JztcbmRyYXdGcmFtZSgpO1xuZnJhbWVEcml2ZXIuc3RhcnQoKTsiLCJ2YXIgcmVmJCwgaWQsIGxvZywgcmFmLCBGcmFtZURyaXZlciwgb3V0JCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnICYmIGV4cG9ydHMgfHwgdGhpcztcbnJlZiQgPSByZXF1aXJlKCdzdGQnKSwgaWQgPSByZWYkLmlkLCBsb2cgPSByZWYkLmxvZywgcmFmID0gcmVmJC5yYWY7XG5vdXQkLkZyYW1lRHJpdmVyID0gRnJhbWVEcml2ZXIgPSAoZnVuY3Rpb24oKXtcbiAgRnJhbWVEcml2ZXIuZGlzcGxheU5hbWUgPSAnRnJhbWVEcml2ZXInO1xuICB2YXIgcHJvdG90eXBlID0gRnJhbWVEcml2ZXIucHJvdG90eXBlLCBjb25zdHJ1Y3RvciA9IEZyYW1lRHJpdmVyO1xuICBmdW5jdGlvbiBGcmFtZURyaXZlcihvbkZyYW1lKXtcbiAgICB0aGlzLm9uRnJhbWUgPSBvbkZyYW1lO1xuICAgIHRoaXMuZnJhbWUgPSBiaW5kJCh0aGlzLCAnZnJhbWUnLCBwcm90b3R5cGUpO1xuICAgIGxvZyhcIkZyYW1lRHJpdmVyOjpuZXdcIik7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHplcm86IDAsXG4gICAgICB0aW1lOiAwLFxuICAgICAgZnJhbWU6IDAsXG4gICAgICBydW5uaW5nOiBmYWxzZVxuICAgIH07XG4gIH1cbiAgcHJvdG90eXBlLmZyYW1lID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgbm93LCDOlHQ7XG4gICAgbm93ID0gRGF0ZS5ub3coKSAtIHRoaXMuc3RhdGUuemVybztcbiAgICDOlHQgPSBub3cgLSB0aGlzLnN0YXRlLnRpbWU7XG4gICAgdGhpcy5zdGF0ZS50aW1lID0gbm93O1xuICAgIHRoaXMuc3RhdGUuZnJhbWUgPSB0aGlzLnN0YXRlLmZyYW1lICsgMTtcbiAgICB0aGlzLm9uRnJhbWUozpR0LCB0aGlzLnN0YXRlLnRpbWUsIHRoaXMuc3RhdGUuZnJhbWUpO1xuICAgIGlmICh0aGlzLnN0YXRlLnJ1bm5pbmcpIHtcbiAgICAgIHJldHVybiByYWYodGhpcy5mcmFtZSk7XG4gICAgfVxuICB9O1xuICBwcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpe1xuICAgIGlmICh0aGlzLnN0YXRlLnJ1bm5pbmcgPT09IHRydWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbG9nKFwiRnJhbWVEcml2ZXI6OlN0YXJ0IC0gc3RhcnRpbmdcIik7XG4gICAgdGhpcy5zdGF0ZS56ZXJvID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLnN0YXRlLnRpbWUgPSAwO1xuICAgIHRoaXMuc3RhdGUucnVubmluZyA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuZnJhbWUoKTtcbiAgfTtcbiAgcHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpe1xuICAgIGlmICh0aGlzLnN0YXRlLnJ1bm5pbmcgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxvZyhcIkZyYW1lRHJpdmVyOjpTdG9wIC0gc3RvcHBpbmdcIik7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUucnVubmluZyA9IGZhbHNlO1xuICB9O1xuICByZXR1cm4gRnJhbWVEcml2ZXI7XG59KCkpO1xuZnVuY3Rpb24gYmluZCQob2JqLCBrZXksIHRhcmdldCl7XG4gIHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gKHRhcmdldCB8fCBvYmopW2tleV0uYXBwbHkob2JqLCBhcmd1bWVudHMpIH07XG59IiwidmFyIHJlZiQsIGlkLCBsb2csIGVsLCBwaSwgdGF1LCBmbG9vciwgSGVybywgb3V0JCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnICYmIGV4cG9ydHMgfHwgdGhpcztcbnJlZiQgPSByZXF1aXJlKCdzdGQnKSwgaWQgPSByZWYkLmlkLCBsb2cgPSByZWYkLmxvZywgZWwgPSByZWYkLmVsLCBwaSA9IHJlZiQucGksIHRhdSA9IHJlZiQudGF1LCBmbG9vciA9IHJlZiQuZmxvb3I7XG5vdXQkLkhlcm8gPSBIZXJvID0gKGZ1bmN0aW9uKCl7XG4gIEhlcm8uZGlzcGxheU5hbWUgPSAnSGVybyc7XG4gIHZhciBwcm90b3R5cGUgPSBIZXJvLnByb3RvdHlwZSwgY29uc3RydWN0b3IgPSBIZXJvO1xuICBmdW5jdGlvbiBIZXJvKHBvcywgZGltKXtcbiAgICB2YXIgdywgaDtcbiAgICB0aGlzLnggPSBwb3NbMF0sIHRoaXMueSA9IHBvc1sxXSwgdGhpcy56ID0gcG9zWzJdO1xuICAgIHcgPSBkaW1bMF0sIGggPSBkaW1bMV07XG4gICAgdGhpcy5jYW52YXMgPSBlbCgnY2FudmFzJyk7XG4gICAgdGhpcy53ID0gdGhpcy5jYW52YXMud2lkdGggPSB3ICogMjtcbiAgICB0aGlzLmggPSB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoICogMjtcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5jYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIHRoaXMuY2FudmFzLnN0eWxlLmxlZnQgPSAoODAgLyAyIC0gdyAvIDIpICsgXCJweFwiO1xuICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdyArICdweCc7XG4gICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gaCArICdweCc7XG4gICAgdGhpcy5kcmF3KCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gIH1cbiAgcHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICByZXR1cm4gdGhpcy5jYW52YXMuc3R5bGUudG9wID0gKHZhbHVlIC0gdGhpcy5oIC8gMikgKyBcInB4XCI7XG4gIH07XG4gIHByb3RvdHlwZS5hcHBlbmRUbyA9IGZ1bmN0aW9uKGhvc3Qpe1xuICAgIHJldHVybiBob3N0LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcbiAgfTtcbiAgcHJvdG90eXBlLmJsaXRUbyA9IGZ1bmN0aW9uKHRhcmdldCwgeCwgeSwgzrEpe1xuICAgIHRhcmdldC5jdHguZ2xvYmFsQWxwaGEgPSDOsTtcbiAgICB0YXJnZXQuY3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhcywgeCwgeSwgdGhpcy5jYW52YXMud2lkdGggLyAyLCB0aGlzLmNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgICByZXR1cm4gdGFyZ2V0LmN0eC5nbG9iYWxBbHBoYSA9IDE7XG4gIH07XG4gIHByb3RvdHlwZS5kcmF3Q2FwZSA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyMwMGUnO1xuICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLncgLyAyLCB0aGlzLmggLyA0KTtcbiAgICB0aGlzLmN0eC5saW5lVG8odGhpcy53LCB0aGlzLmggKiAzIC8gNCk7XG4gICAgdGhpcy5jdHgubGluZVRvKDAsIHRoaXMuaCAqIDMgLyA0KTtcbiAgICB0aGlzLmN0eC5saW5lVG8odGhpcy53IC8gMiwgdGhpcy5oIC8gNCk7XG4gICAgdGhpcy5jdHguZmlsbCgpO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjMDBiJztcbiAgICB0aGlzLmN0eC5tb3ZlVG8odGhpcy53IC8gMiwgdGhpcy5oICogMiAvIDUpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncsIHRoaXMuaCAqIDMgLyA0KTtcbiAgICB0aGlzLmN0eC5saW5lVG8oMCwgdGhpcy5oICogMyAvIDQpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncgLyAyLCB0aGlzLmggKiAyIC8gNSk7XG4gICAgcmV0dXJuIHRoaXMuY3R4LmZpbGwoKTtcbiAgfTtcbiAgcHJvdG90eXBlLmRyYXdUb3JzbyA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJ2dyZXknO1xuICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLncgKiAxIC8gMiwgdGhpcy5oICogMiAvIDUpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncgKiAzIC8gNCwgdGhpcy5oICogMyAvIDQpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncgKiAxIC8gMiwgdGhpcy5oICogNCAvIDQpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncgKiAxIC8gNCwgdGhpcy5oICogMyAvIDQpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLncgKiAxIC8gMiwgdGhpcy5oICogMiAvIDUpO1xuICAgIHJldHVybiB0aGlzLmN0eC5maWxsKCk7XG4gIH07XG4gIHByb3RvdHlwZS5kcmF3RmFjZSA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyM4NTInO1xuICAgIHRoaXMuY3R4LmFyYyh0aGlzLncgLyAyLCB0aGlzLmggLyA0LCB0aGlzLncgLyA0LCAwLCB0YXUpO1xuICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnI2ZjYSc7XG4gICAgdGhpcy5jdHguYXJjKHRoaXMudyAvIDIsIHRoaXMuaCAvIDQgKyB0aGlzLncgLyAyMCwgdGhpcy5oIC8gMTAsIDAsIHRhdSk7XG4gICAgcmV0dXJuIHRoaXMuY3R4LmZpbGwoKTtcbiAgfTtcbiAgcHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbijOsSl7XG4gICAgdGhpcy5kcmF3Q2FwZSgpO1xuICAgIHRoaXMuZHJhd1RvcnNvKCk7XG4gICAgcmV0dXJuIHRoaXMuZHJhd0ZhY2UoKTtcbiAgfTtcbiAgcmV0dXJuIEhlcm87XG59KCkpOyIsInZhciByZWYkLCBpZCwgbG9nLCBlbCwgZmxvb3IsIE1hcmtlciwgb3V0JCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnICYmIGV4cG9ydHMgfHwgdGhpcztcbnJlZiQgPSByZXF1aXJlKCdzdGQnKSwgaWQgPSByZWYkLmlkLCBsb2cgPSByZWYkLmxvZywgZWwgPSByZWYkLmVsLCBmbG9vciA9IHJlZiQuZmxvb3I7XG5vdXQkLk1hcmtlciA9IE1hcmtlciA9IChmdW5jdGlvbigpe1xuICBNYXJrZXIuZGlzcGxheU5hbWUgPSAnTWFya2VyJztcbiAgdmFyIHByb3RvdHlwZSA9IE1hcmtlci5wcm90b3R5cGUsIGNvbnN0cnVjdG9yID0gTWFya2VyO1xuICBmdW5jdGlvbiBNYXJrZXIoY29sLCBwb3Mpe1xuICAgIHBvcyA9PSBudWxsICYmIChwb3MgPSAwKTtcbiAgICB0aGlzLmRvbSA9IGVsKCdkaXYnKTtcbiAgICBpbXBvcnQkKHRoaXMuZG9tLnN0eWxlLCB7XG4gICAgICBiYWNrZ3JvdW5kOiBjb2wsXG4gICAgICBoZWlnaHQ6ICcxcHgnLFxuICAgICAgd2lkdGg6ICc4MHB4JyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgbGVmdDogMFxuICAgIH0pO1xuICAgIHRoaXMuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gICAgdGhpcy5zZXQocG9zKTtcbiAgfVxuICBwcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbihob3N0KXtcbiAgICByZXR1cm4gaG9zdC5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XG4gIH07XG4gIHByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbih2YWx1ZSl7XG4gICAgcmV0dXJuIHRoaXMuZG9tLnN0eWxlLnRvcCA9IGZsb29yKHZhbHVlKSArICdweCc7XG4gIH07XG4gIHJldHVybiBNYXJrZXI7XG59KCkpO1xuZnVuY3Rpb24gaW1wb3J0JChvYmosIHNyYyl7XG4gIHZhciBvd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbiAgZm9yICh2YXIga2V5IGluIHNyYykgaWYgKG93bi5jYWxsKHNyYywga2V5KSkgb2JqW2tleV0gPSBzcmNba2V5XTtcbiAgcmV0dXJuIG9iajtcbn0iLCJ2YXIgcmVmJCwgaWQsIGxvZywgZWwsIGZsb29yLCBCbGl0dGVyLCBPdXRwdXQsIG91dCQgPSB0eXBlb2YgZXhwb3J0cyAhPSAndW5kZWZpbmVkJyAmJiBleHBvcnRzIHx8IHRoaXM7XG5yZWYkID0gcmVxdWlyZSgnc3RkJyksIGlkID0gcmVmJC5pZCwgbG9nID0gcmVmJC5sb2csIGVsID0gcmVmJC5lbCwgZmxvb3IgPSByZWYkLmZsb29yO1xuQmxpdHRlciA9IChmdW5jdGlvbigpe1xuICBCbGl0dGVyLmRpc3BsYXlOYW1lID0gJ0JsaXR0ZXInO1xuICB2YXIgcHJvdG90eXBlID0gQmxpdHRlci5wcm90b3R5cGUsIGNvbnN0cnVjdG9yID0gQmxpdHRlcjtcbiAgZnVuY3Rpb24gQmxpdHRlcih3LCBoKXtcbiAgICB0aGlzLmNhbnZhcyA9IGVsKCdjYW52YXMnKTtcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5zaXplVG8odywgaCk7XG4gIH1cbiAgcHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMudywgdGhpcy5oKTtcbiAgfTtcbiAgcHJvdG90eXBlLnNpemVUbyA9IGZ1bmN0aW9uKHcsIGgpe1xuICAgIHRoaXMudyA9IHRoaXMuY2FudmFzLndpZHRoID0gdztcbiAgICByZXR1cm4gdGhpcy5oID0gdGhpcy5jYW52YXMuaGVpZ2h0ID0gaDtcbiAgfTtcbiAgcHJvdG90eXBlLmFwcGVuZFRvID0gZnVuY3Rpb24oaG9zdCl7XG4gICAgcmV0dXJuIGhvc3QuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICB9O1xuICBwcm90b3R5cGUuYmxpdFRvID0gZnVuY3Rpb24odGFyZ2V0LCB4LCB5LCDOsSl7XG4gICAgzrEgPT0gbnVsbCAmJiAozrEgPSAxKTtcbiAgICB0YXJnZXQuY3R4Lmdsb2JhbEFscGhhID0gzrE7XG4gICAgdGFyZ2V0LmN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIHgsIHksIHRoaXMudywgdGhpcy5oKTtcbiAgICByZXR1cm4gdGFyZ2V0LmN0eC5nbG9iYWxBbHBoYSA9IDE7XG4gIH07XG4gIHJldHVybiBCbGl0dGVyO1xufSgpKTtcbm91dCQuT3V0cHV0ID0gT3V0cHV0ID0gKGZ1bmN0aW9uKHN1cGVyY2xhc3Mpe1xuICB2YXIgcHJvdG90eXBlID0gZXh0ZW5kJCgoaW1wb3J0JChPdXRwdXQsIHN1cGVyY2xhc3MpLmRpc3BsYXlOYW1lID0gJ091dHB1dCcsIE91dHB1dCksIHN1cGVyY2xhc3MpLnByb3RvdHlwZSwgY29uc3RydWN0b3IgPSBPdXRwdXQ7XG4gIGZ1bmN0aW9uIE91dHB1dCh3LCBoLCDOsil7XG4gICAgdGhpcy5ncmlkID0gbmV3IEJsaXR0ZXIodywgaCk7XG4gICAgdGhpcy5ncm91bmQgPSBuZXcgQmxpdHRlcih3LCBoKTtcbiAgICBPdXRwdXQuc3VwZXJjbGFzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVkcmF3KM6yKTtcbiAgfVxuICBwcm90b3R5cGUuZHJhd0dyb3VuZCA9IGZ1bmN0aW9uKM6yKXtcbiAgICB2YXIgaSQsIHRvJCwgaSwgcmVzdWx0cyQgPSBbXTtcbiAgICBmb3IgKGkkID0gMCwgdG8kID0gdGhpcy5oOyDOsiA8IDAgPyBpJCA+PSB0byQgOiBpJCA8PSB0byQ7IGkkICs9IM6yKSB7XG4gICAgICBpID0gaSQ7XG4gICAgICB0aGlzLmdyb3VuZC5jdHguZmlsbFN0eWxlID0gXCJyZ2IoXCIgKyBmbG9vcig5MCAtIGkgLyB0aGlzLmggKiA2MCkgKyBcIiwgXCIgKyBmbG9vcigxNjAgLSBpIC8gdGhpcy5oICogMzApICsgXCIsIDUwKVwiO1xuICAgICAgcmVzdWx0cyQucHVzaCh0aGlzLmdyb3VuZC5jdHguZmlsbFJlY3QoMCwgaSwgdGhpcy53LCB0aGlzLmggLSBpKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzJDtcbiAgfTtcbiAgcHJvdG90eXBlLmRyYXdHcmlkID0gZnVuY3Rpb24ozrIpe1xuICAgIHZhciBpJCwgdG8kLCB4LCB5O1xuICAgIHRoaXMuZ3JpZC5nbG9iYWxBbHBoYSA9IDAuMTtcbiAgICB0aGlzLmdyaWQuY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2JhKDI1NSwyNTUsMjU1LDAuMSlcIjtcbiAgICB0aGlzLmdyaWQuY3R4LmJlZ2luUGF0aCgpO1xuICAgIGZvciAoaSQgPSAwLCB0byQgPSB0aGlzLnc7IM6yIDwgMCA/IGkkID49IHRvJCA6IGkkIDw9IHRvJDsgaSQgKz0gzrIpIHtcbiAgICAgIHggPSBpJDtcbiAgICAgIHRoaXMuZ3JpZC5jdHgubW92ZVRvKDAuNSArIHgsIDApO1xuICAgICAgdGhpcy5ncmlkLmN0eC5saW5lVG8oMC41ICsgeCwgdGhpcy5oKTtcbiAgICB9XG4gICAgZm9yIChpJCA9IDAsIHRvJCA9IHRoaXMuaDsgzrIgPCAwID8gaSQgPj0gdG8kIDogaSQgPD0gdG8kOyBpJCArPSDOsikge1xuICAgICAgeSA9IGkkO1xuICAgICAgdGhpcy5ncmlkLmN0eC5tb3ZlVG8oMC41LCAwLjUgKyB5KTtcbiAgICAgIHRoaXMuZ3JpZC5jdHgubGluZVRvKHRoaXMudywgMC41ICsgeSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdyaWQuY3R4LnN0cm9rZSgpO1xuICB9O1xuICBwcm90b3R5cGUucmVkcmF3ID0gZnVuY3Rpb24ozrIpe1xuICAgIHRoaXMuZHJhd0dyb3VuZCjOsik7XG4gICAgcmV0dXJuIHRoaXMuZHJhd0dyaWQozrIpO1xuICB9O1xuICBwcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKM6yLCBnbGlkZSl7XG4gICAgZ2xpZGUgPT0gbnVsbCAmJiAoZ2xpZGUgPSAwKTtcbiAgICB0aGlzLmdyb3VuZC5ibGl0VG8odGhpcywgMCwgMCk7XG4gICAgcmV0dXJuIHRoaXMuZ3JpZC5ibGl0VG8odGhpcywgMCwgZ2xpZGUgJSDOsik7XG4gIH07XG4gIHByb3RvdHlwZS5zaXplVG8gPSBmdW5jdGlvbih3LCBoKXtcbiAgICBzdXBlcmNsYXNzLnByb3RvdHlwZS5zaXplVG8uY2FsbCh0aGlzLCB3LCBoKTtcbiAgICB0aGlzLmdyaWQuc2l6ZVRvKHcsIGgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZC5zaXplVG8odywgaCk7XG4gIH07XG4gIHJldHVybiBPdXRwdXQ7XG59KEJsaXR0ZXIpKTtcbmZ1bmN0aW9uIGV4dGVuZCQoc3ViLCBzdXApe1xuICBmdW5jdGlvbiBmdW4oKXt9IGZ1bi5wcm90b3R5cGUgPSAoc3ViLnN1cGVyY2xhc3MgPSBzdXApLnByb3RvdHlwZTtcbiAgKHN1Yi5wcm90b3R5cGUgPSBuZXcgZnVuKS5jb25zdHJ1Y3RvciA9IHN1YjtcbiAgaWYgKHR5cGVvZiBzdXAuZXh0ZW5kZWQgPT0gJ2Z1bmN0aW9uJykgc3VwLmV4dGVuZGVkKHN1Yik7XG4gIHJldHVybiBzdWI7XG59XG5mdW5jdGlvbiBpbXBvcnQkKG9iaiwgc3JjKXtcbiAgdmFyIG93biA9IHt9Lmhhc093blByb3BlcnR5O1xuICBmb3IgKHZhciBrZXkgaW4gc3JjKSBpZiAob3duLmNhbGwoc3JjLCBrZXkpKSBvYmpba2V5XSA9IHNyY1trZXldO1xuICByZXR1cm4gb2JqO1xufSIsInZhciByZWYkLCBpZCwgbG9nLCBlbCwgZmxvb3IsIFJvb20sIG91dCQgPSB0eXBlb2YgZXhwb3J0cyAhPSAndW5kZWZpbmVkJyAmJiBleHBvcnRzIHx8IHRoaXM7XG5yZWYkID0gcmVxdWlyZSgnc3RkJyksIGlkID0gcmVmJC5pZCwgbG9nID0gcmVmJC5sb2csIGVsID0gcmVmJC5lbCwgZmxvb3IgPSByZWYkLmZsb29yO1xub3V0JC5Sb29tID0gUm9vbSA9IChmdW5jdGlvbigpe1xuICBSb29tLmRpc3BsYXlOYW1lID0gJ1Jvb20nO1xuICB2YXIgcHJvdG90eXBlID0gUm9vbS5wcm90b3R5cGUsIGNvbnN0cnVjdG9yID0gUm9vbTtcbiAgZnVuY3Rpb24gUm9vbShwb3MsIGRpbSwgzrIpe1xuICAgIHRoaXMueCA9IHBvc1swXSwgdGhpcy55ID0gcG9zWzFdLCB0aGlzLnogPSBwb3NbMl07XG4gICAgdGhpcy53ID0gZGltWzBdLCB0aGlzLmggPSBkaW1bMV0sIHRoaXMuZCA9IGRpbVsyXTtcbiAgICB0aGlzLs6yID0gzrIgIT0gbnVsbCA/IM6yIDogNTA7XG4gICAgdGhpcy5jYW52YXMgPSBlbCgnY2FudmFzJyk7XG4gICAgdGhpcy5jYW52YXMuc3R5bGUuYmFja2dyb3VuZCA9ICdyZWQnO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuzrIgKiB0aGlzLnc7XG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy7OsiAqICh0aGlzLmggKyB0aGlzLmQpO1xuICAgIHRoaXMuZ2VuZXJhdGUoZGltKTtcbiAgICB0aGlzLmRyYXcoKTtcbiAgfVxuICBwcm90b3R5cGUuc3BpdCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHksIHJvdztcbiAgICByZXR1cm4gbG9nKGZ1bmN0aW9uKGl0KXtcbiAgICAgIHJldHVybiBpdC5qb2luKFwiXFxuXCIpO1xuICAgIH0oKGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgaSQsIHJlZiQsIGxlbiQsIHJlc3VsdHMkID0gW107XG4gICAgICBmb3IgKGkkID0gMCwgbGVuJCA9IChyZWYkID0gdGhpcy50aWxlcykubGVuZ3RoOyBpJCA8IGxlbiQ7ICsraSQpIHtcbiAgICAgICAgeSA9IGkkO1xuICAgICAgICByb3cgPSByZWYkW2kkXTtcbiAgICAgICAgcmVzdWx0cyQucHVzaChyb3cuam9pbignfCcpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzJDtcbiAgICB9LmNhbGwodGhpcykpKSk7XG4gIH07XG4gIHByb3RvdHlwZS5nZW5lcmF0ZSA9IGZ1bmN0aW9uKGFyZyQpe1xuICAgIHZhciB3LCBoLCBkLCB5LCB4O1xuICAgIHcgPSBhcmckWzBdLCBoID0gYXJnJFsxXSwgZCA9IGFyZyRbMl07XG4gICAgcmV0dXJuIHRoaXMudGlsZXMgPSAoZnVuY3Rpb24oKXtcbiAgICAgIHZhciBpJCwgdG8kLCBscmVzdWx0JCwgaiQsIHRvMSQsIHJlc3VsdHMkID0gW107XG4gICAgICBmb3IgKGkkID0gMCwgdG8kID0gaDsgaSQgPCB0byQ7ICsraSQpIHtcbiAgICAgICAgeSA9IGkkO1xuICAgICAgICBscmVzdWx0JCA9IFtdO1xuICAgICAgICBmb3IgKGokID0gMCwgdG8xJCA9IHc7IGokIDwgdG8xJDsgKytqJCkge1xuICAgICAgICAgIHggPSBqJDtcbiAgICAgICAgICBpZiAoeSA9PT0gMCB8fCB4ID09PSAwIHx8IHggPT09IHcgLSAxKSB7XG4gICAgICAgICAgICBscmVzdWx0JC5wdXNoKDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBscmVzdWx0JC5wdXNoKDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzJC5wdXNoKGxyZXN1bHQkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzJDtcbiAgICB9KCkpO1xuICB9O1xuICBwcm90b3R5cGUuZHJhd0Jsb2NrID0gZnVuY3Rpb24oeCwgeSwgeil7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyM4ODgnO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KHggKiB0aGlzLs6yLCAodGhpcy5kICsgeSAtIDEpICogdGhpcy7OsiAtIDEgLSB6ICogdGhpcy7OsiwgdGhpcy7OsiwgdGhpcy7OsiAqIDIpO1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjYWFhJztcbiAgICB0aGlzLmN0eC5maWxsUmVjdCh4ICogdGhpcy7OsiwgKHRoaXMuZCArIHkgLSAwKSAqIHRoaXMuzrIgLSAxIC0geiAqIHRoaXMuzrIsIHRoaXMuzrIgLSAxLCB0aGlzLs6yIC0gMSk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyNlZWUnO1xuICAgIHJldHVybiB0aGlzLmN0eC5maWxsUmVjdCh4ICogdGhpcy7OsiwgKHRoaXMuZCArIHkgLSAxKSAqIHRoaXMuzrIgLSAxIC0geiAqIHRoaXMuzrIsIHRoaXMuzrIgLSAxLCB0aGlzLs6yIC0gMSk7XG4gIH07XG4gIHByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oeiwgdil7XG4gICAgdmFyIGkkLCB0byQsIGxyZXN1bHQkLCBqJCwgcmVmJCwgbGVuJCwgeSwgcm93LCBscmVzdWx0MSQsIGskLCBsZW4xJCwgeCwgd2FsbCwgcmVzdWx0cyQgPSBbXTtcbiAgICB6ID09IG51bGwgJiYgKHogPSAwKTtcbiAgICB2ID09IG51bGwgJiYgKHYgPSA1MCArIDEwICogdGhpcy56KTtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcInJnYihcIiArIHYgKyBcIiwgXCIgKyB2ICsgXCIsIFwiICsgdiArIFwiKVwiO1xuICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIHRoaXMuzrIgKiB0aGlzLmQsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQgLSB0aGlzLs6yICogdGhpcy5kKTtcbiAgICBmb3IgKGkkID0gMCwgdG8kID0gdGhpcy5kOyBpJCA8IHRvJDsgKytpJCkge1xuICAgICAgeiA9IGkkO1xuICAgICAgbHJlc3VsdCQgPSBbXTtcbiAgICAgIGZvciAoaiQgPSAwLCBsZW4kID0gKHJlZiQgPSB0aGlzLnRpbGVzKS5sZW5ndGg7IGokIDwgbGVuJDsgKytqJCkge1xuICAgICAgICB5ID0gaiQ7XG4gICAgICAgIHJvdyA9IHJlZiRbaiRdO1xuICAgICAgICBscmVzdWx0MSQgPSBbXTtcbiAgICAgICAgZm9yIChrJCA9IDAsIGxlbjEkID0gcm93Lmxlbmd0aDsgayQgPCBsZW4xJDsgKytrJCkge1xuICAgICAgICAgIHggPSBrJDtcbiAgICAgICAgICB3YWxsID0gcm93W2skXTtcbiAgICAgICAgICBpZiAod2FsbCkge1xuICAgICAgICAgICAgbHJlc3VsdDEkLnB1c2godGhpcy5kcmF3QmxvY2soeCwgeSwgeikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBscmVzdWx0JC5wdXNoKGxyZXN1bHQxJCk7XG4gICAgICB9XG4gICAgICByZXN1bHRzJC5wdXNoKGxyZXN1bHQkKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHMkO1xuICB9O1xuICBwcm90b3R5cGUuYmxpdFRvID0gZnVuY3Rpb24odGFyZ2V0LCB4LCB5LCDOsSl7XG4gICAgzrEgPT0gbnVsbCAmJiAozrEgPSAxKTtcbiAgICB0YXJnZXQuY3R4Lmdsb2JhbEFscGhhID0gzrE7XG4gICAgdGFyZ2V0LmN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIHgsIHksIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgIHJldHVybiB0YXJnZXQuY3R4Lmdsb2JhbEFscGhhID0gMTtcbiAgfTtcbiAgcmV0dXJuIFJvb207XG59KCkpOyIsInZhciBpZCwgbG9nLCBmbGlwLCBzaW4sIGNvcywgcGksIHRhdSwgZGVsYXksIGZsb29yLCByYW5kb20sIHJhbmQsIHJhbmRvbUZyb20sIGFkZFYyLCBmaWx0ZXIsIGVsLCBjbGFtcFplcm8sIGVhc2VPdXQsIHdyYXAsIGxpbWl0LCByYWYsIHRoYXQsIG91dCQgPSB0eXBlb2YgZXhwb3J0cyAhPSAndW5kZWZpbmVkJyAmJiBleHBvcnRzIHx8IHRoaXM7XG5vdXQkLmlkID0gaWQgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdDtcbn07XG5vdXQkLmxvZyA9IGxvZyA9IGZ1bmN0aW9uKCl7XG4gIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gIHJldHVybiBhcmd1bWVudHNbMF07XG59O1xub3V0JC5mbGlwID0gZmxpcCA9IGZ1bmN0aW9uKM67KXtcbiAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgIHJldHVybiDOuyhiLCBhKTtcbiAgfTtcbn07XG5vdXQkLnNpbiA9IHNpbiA9IE1hdGguc2luO1xub3V0JC5jb3MgPSBjb3MgPSBNYXRoLmNvcztcbm91dCQucGkgPSBwaSA9IE1hdGguUEk7XG5vdXQkLnRhdSA9IHRhdSA9IHBpICogMjtcbm91dCQuZGVsYXkgPSBkZWxheSA9IGZsaXAoc2V0VGltZW91dCk7XG5vdXQkLmZsb29yID0gZmxvb3IgPSBNYXRoLmZsb29yO1xub3V0JC5yYW5kb20gPSByYW5kb20gPSBNYXRoLnJhbmRvbTtcbm91dCQucmFuZCA9IHJhbmQgPSBmdW5jdGlvbihtaW4sIG1heCl7XG4gIHJldHVybiBtaW4gKyBmbG9vcihyYW5kb20oKSAqIChtYXggLSBtaW4pKTtcbn07XG5vdXQkLnJhbmRvbUZyb20gPSByYW5kb21Gcm9tID0gZnVuY3Rpb24obGlzdCl7XG4gIHJldHVybiBsaXN0W3JhbmQoMCwgbGlzdC5sZW5ndGggLSAxKV07XG59O1xub3V0JC5hZGRWMiA9IGFkZFYyID0gZnVuY3Rpb24oYSwgYil7XG4gIHJldHVybiBbYVswXSArIGJbMF0sIGFbMV0gKyBiWzFdXTtcbn07XG5vdXQkLmZpbHRlciA9IGZpbHRlciA9IGN1cnJ5JChmdW5jdGlvbijOuywgbGlzdCl7XG4gIHZhciBpJCwgbGVuJCwgeCwgcmVzdWx0cyQgPSBbXTtcbiAgZm9yIChpJCA9IDAsIGxlbiQgPSBsaXN0Lmxlbmd0aDsgaSQgPCBsZW4kOyArK2kkKSB7XG4gICAgeCA9IGxpc3RbaSRdO1xuICAgIGlmICjOuyh4KSkge1xuICAgICAgcmVzdWx0cyQucHVzaCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdHMkO1xufSk7XG5vdXQkLmVsID0gZWwgPSBiaW5kJChkb2N1bWVudCwgJ2NyZWF0ZUVsZW1lbnQnKTtcbm91dCQuY2xhbXBaZXJvID0gY2xhbXBaZXJvID0gZnVuY3Rpb24oaXQpe1xuICBpZiAoaXQgPCAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGl0O1xuICB9XG59O1xub3V0JC5lYXNlT3V0ID0gZWFzZU91dCA9IGZ1bmN0aW9uKHQsIGIsIGMsIGQpe1xuICByZXR1cm4gLWMgKiAodCAvPSBkKSAqICh0IC0gMikgKyBiO1xufTtcbm91dCQud3JhcCA9IHdyYXAgPSBjdXJyeSQoZnVuY3Rpb24obWluLCBtYXgsIG4pe1xuICBpZiAobiA+IG1heCkge1xuICAgIHJldHVybiBtaW47XG4gIH0gZWxzZSBpZiAobiA8IG1pbikge1xuICAgIHJldHVybiBtYXg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG47XG4gIH1cbn0pO1xub3V0JC5saW1pdCA9IGxpbWl0ID0gY3VycnkkKGZ1bmN0aW9uKG1pbiwgbWF4LCBuKXtcbiAgaWYgKG4gPiBtYXgpIHtcbiAgICByZXR1cm4gbWF4O1xuICB9IGVsc2UgaWYgKG4gPCBtaW4pIHtcbiAgICByZXR1cm4gbWluO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuO1xuICB9XG59KTtcbm91dCQucmFmID0gcmFmID0gKHRoYXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSAhPSBudWxsXG4gID8gdGhhdFxuICA6ICh0aGF0ID0gd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSkgIT0gbnVsbFxuICAgID8gdGhhdFxuICAgIDogKHRoYXQgPSB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lKSAhPSBudWxsXG4gICAgICA/IHRoYXRcbiAgICAgIDogZnVuY3Rpb24ozrspe1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCjOuywgMTAwMCAvIDYwKTtcbiAgICAgIH07XG5mdW5jdGlvbiBjdXJyeSQoZiwgYm91bmQpe1xuICB2YXIgY29udGV4dCxcbiAgX2N1cnJ5ID0gZnVuY3Rpb24oYXJncykge1xuICAgIHJldHVybiBmLmxlbmd0aCA+IDEgPyBmdW5jdGlvbigpe1xuICAgICAgdmFyIHBhcmFtcyA9IGFyZ3MgPyBhcmdzLmNvbmNhdCgpIDogW107XG4gICAgICBjb250ZXh0ID0gYm91bmQgPyBjb250ZXh0IHx8IHRoaXMgOiB0aGlzO1xuICAgICAgcmV0dXJuIHBhcmFtcy5wdXNoLmFwcGx5KHBhcmFtcywgYXJndW1lbnRzKSA8XG4gICAgICAgICAgZi5sZW5ndGggJiYgYXJndW1lbnRzLmxlbmd0aCA/XG4gICAgICAgIF9jdXJyeS5jYWxsKGNvbnRleHQsIHBhcmFtcykgOiBmLmFwcGx5KGNvbnRleHQsIHBhcmFtcyk7XG4gICAgfSA6IGY7XG4gIH07XG4gIHJldHVybiBfY3VycnkoKTtcbn1cbmZ1bmN0aW9uIGJpbmQkKG9iaiwga2V5LCB0YXJnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuICh0YXJnZXQgfHwgb2JqKVtrZXldLmFwcGx5KG9iaiwgYXJndW1lbnRzKSB9O1xufSJdfQ==
