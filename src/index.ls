
# Require

{ id, log, sin, cos, tau, limit, floor, clamp-zero, ease-out } = require \std

{ FrameDriver } = require \./frame-driver
{ Output }      = require \./output
{ Room }        = require \./room
{ Marker }      = require \./marker
{ Hero }        = require \./hero


# Options

options =
  camera-follow: yes
  mouse-control: no

room-height = 3
tile-size = β = 20
flight-range = 13
transition-threshold = 1/3

room-pos = [ 2, 10 ]
room-dim = [ 15, 9, room-height ]

room-bounds-x = limit 1 + room-pos.0, room-pos.0 + room-dim.0 - 2
room-bounds-y = limit 1 + room-pos.1, room-pos.1 + room-dim.1 - 1


# Setup

output  = new Output window.inner-width - 100, window.inner-height, β
markers = for i from 0 to 4 => new Marker \white, i * 100 + 50
rooms   = for i from 0 to 4 => new Room [ room-pos.0, room-dim.1, i ], room-dim, β
hero    = new Hero [ room-pos.0 + (floor room-dim.0 / 2), room-pos.1 + (floor room-dim.1 / 2), 0 ], [ β, β * 2 ]

hero-marker = new Marker \red, 400

frame-driver = new FrameDriver (Δt, time) ->
  hero.z = flight-range/2 + flight-range/2 * sin time / 2000
  draw-frame!


# Renderer

draw-shadow = (ctx, x, y, α) ->
  output.ctx.beginPath!
  output.ctx.fill-style = \black
  output.ctx.arc x, y, β/3, 0, tau
  output.ctx.global-alpha = 0.2 * α
  output.ctx.fill!
  output.ctx.global-alpha = 1

draw-frame = (Δt, time, frame) ->

  glide = if options.camera-follow then hero.z * β else 0

  output.draw β, glide

  hero.set        400 - hero.z / room-height * 100 + 50
  hero-marker.set 400 - hero.z / room-height * 100 + 50

  for room in rooms
    {x, y, z, w, h, d} = room

    if hero.z / d < z - transition-threshold
      α = 0
    else if hero.z / d <= z
      α = 2 + (-1 / transition-threshold) * (z + transition-threshold - hero.z / d)
      v = ease-out α, 0, 1, 1
    else # hero.z is greater than floor height
      v = 1
      α = 1

    room-x = x * β
    room-y = y * β - room-height * β
    room-z = z * d * β - v * β
    room-a = α

    room.blit-to output, room-x, glide + room-y - room-z, room-a


  hero-x = hero.x * β
  hero-y = hero.y * β - β
  hero-z = hero.z * β
  hero-α = 1

  shadow-x = (hero.x + 0.5) * β
  shadow-y = (hero.y + 0.3) * β
  flight-z = (glide + β * transition-threshold) % (3 * β)
  shadow-a = 1 - hero.z % room-height / room-height

  draw-shadow output.ctx, shadow-x, shadow-y + flight-z, shadow-a


  hero.blit-to output, hero-x, glide + hero-y - hero-z - 0.6 * β, hero-α


# Listeners

document.add-event-listener \mousemove, ({ pageY }) ->
  if options.mouse-control
    frame-driver.stop!
    hero.z = clamp-zero -1 + flight-range - pageY/window.innerHeight * flight-range
    draw-frame!

document.add-event-listener \click, ({ pageY }) ->
  frame-driver.start!
  draw-frame!

window.add-event-listener \resize, ->
  output.size-to window.inner-width - 100, window.inner-height
  output.redraw β
  draw-frame!

document.add-event-listener \keydown, ({ which }) ->
  switch which
  | 37 => hero.x = room-bounds-x hero.x - 1
  | 38 => hero.y = room-bounds-y hero.y - 1
  | 39 => hero.x = room-bounds-x hero.x + 1
  | 40 => hero.y = room-bounds-y hero.y + 1
  | _ => void
  draw-frame!

document.get-element-by-id \follow .add-event-listener \change, ->
  options.camera-follow = this.checked

document.get-element-by-id \mouse .add-event-listener \change, ->
  if this.checked
    frame-driver.stop!
  options.mouse-control = this.checked


# Start

output.append-to document.body
output.canvas.style.margin-left = \100px

draw-frame!
frame-driver.start!

