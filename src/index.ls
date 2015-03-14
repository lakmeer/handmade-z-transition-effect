
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
  automatic: yes
  lift-off: 2
  threshold: 0.33

room-height = 3
tile-size = β = 25
flight-range = 13

room-pos = [ 2, 14 ]
room-dim = [ 15, 9, room-height ]

room-bounds-x = limit 1 + room-pos.0, room-pos.0 + room-dim.0 - 2
room-bounds-y = limit 1 + room-pos.1, room-pos.1 + room-dim.1 - 1


# Setup

output       = new Output (room-pos.0 * 2 + room-dim.0) * β, window.inner-height, β
markers      = for i from 0 to 4 => new Marker \white, i * 100 + 100, if i isnt 4 then options.threshold
rooms        = for i from 0 to 4 => new Room [ room-pos.0, room-dim.1, i ], room-dim, β
hero         = new Hero [ room-pos.0 + (floor room-dim.0 / 2), room-pos.1 + (floor room-dim.1 / 2), 0 ], [ β, β * 2 ]
hero-marker  = new Marker \red, 400, 0
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
  camera-centering-offset = β * if options.camera-follow then 10 else 0

  hero.set        400 - hero.z / room-height * 100 + 100
  hero-marker.set 400 - hero.z / room-height * 100 + 100

  # Draw ground plane
  output.draw β, glide

  # Draw tower
  for room in rooms
    {x, y, z, w, h, d} = room

    if hero.z / d <= z - options.threshold
      α = 0
    else if hero.z / d <= z
      α = 2 + (-1 / options.threshold) * (z + options.threshold - hero.z / d)
      v = ease-out α, 0, 1, 1
    else # hero.z is greater than floor height
      v = 1
      α = 1

    room-x = x * β
    room-y = y * β + (d - 1) * β - camera-centering-offset
    room-z = z * d * β + (1 - v) * β * options.lift-off
    room-a = α

    room.blit-to output, room-x, glide + room-y - room-z, room-a

  # Draw hero
  hero-x = hero.x * β
  hero-y = hero.y * β - β - camera-centering-offset
  hero-z = hero.z * β
  hero-α = 1

  shadow-x = (hero.x + 0.5) * β
  shadow-y = (hero.y + 0.5) * β - camera-centering-offset
  flight-z = (floor hero.z / 3) * β * room-height * -1 + glide
  shadow-a = 1 - hero.z % room-height / room-height

  draw-shadow output.ctx, shadow-x, shadow-y + flight-z, shadow-a

  hero.blit-to output, hero-x, glide + hero-y - hero-z - 0.6 * β, hero-α


# Listeners

document.add-event-listener \mousemove, ({ pageY }) ->
  if !options.automatic
    frame-driver.stop!
    hero.z = limit 0, flight-range, room-height * 4 - (pageY - 100) / 400 * room-height * 4
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
  options.camera-follow = @checked

document.get-element-by-id \auto .add-event-listener \change, ->
  if !@checked then frame-driver.stop! else frame-driver.start!
  options.automatic = @checked

document.get-element-by-id \threshold .add-event-listener \mousemove, ->
  options.threshold = @value / 100
  document.get-element-by-id \tt .innerText = @value/100
  for marker, i in markers when i isnt 4
    marker.set-shadow options.threshold

document.get-element-by-id \lift-off .add-event-listener \mousemove, ->
  options.lift-off = @value / 100
  document.get-element-by-id \lo .innerText =
    if @value/100 is 1 then "1 tile" else @value/100 + " tiles"

window.add-event-listener \resize, ->
  output.size-to (room-pos.0 * 2 + room-dim.0) * β, window.inner-height
  output.redraw β
  draw-frame!


# Start

output.append-to document.body
output.canvas.style.margin-left = \100px

document.get-element-by-id \controls .style.margin-left = "#{ 100 + output.w }px"
document.get-element-by-id \controls .style.display = \block
document.get-element-by-id \center .style.width = "#{ 100 + output.w + 250 }px"

frame-driver.start!

