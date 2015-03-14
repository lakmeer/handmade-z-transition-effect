
# Require

{ id, log, el, floor } = require \std


class Blitter
  (w, h) ->
    @canvas = el \canvas
    @ctx = @canvas.get-context \2d
    @size-to w, h

  clear: ->
    @ctx.clear-rect 0, 0, @w, @h

  size-to: (w, h) ->
    @w = @canvas.width  = w
    @h = @canvas.height = h

  append-to: (host) ->
    host.append-child @canvas

  blit-to: (target, x, y, α = 1) ->
    target.ctx.global-alpha = α
    target.ctx.draw-image @canvas, x, y, @w, @h
    target.ctx.global-alpha = 1


#
# Output
#
# Bundle some useful boilerplate around canvas management
#

export class Output extends Blitter
  (w, h, β) ->
    @grid   = new Blitter w, h
    @ground = new Blitter w, h
    super ...
    @redraw β

  draw-ground: (β) ->
    for i from 0 to @h by β
      @ground.ctx.fill-style = "rgb(#{floor 90 - i/@h*60}, #{floor 160 - i/@h*30}, 50)"
      @ground.ctx.fill-rect 0, i, @w, @h - i

  draw-grid: (β) ->
    @grid.global-alpha = 0.1
    @grid.ctx.stroke-style = "rgba(255,255,255,0.1)"
    @grid.ctx.beginPath!

    for x from 0 to @w by β
      @grid.ctx.move-to 0.5 + x, 0
      @grid.ctx.line-to 0.5 + x, @h

    for y from 0 to @h by β
      @grid.ctx.move-to 0.5, 0.5 + y
      @grid.ctx.line-to @w, 0.5 + y

    @grid.ctx.stroke!

  redraw: (β) ->
    @draw-ground β
    @draw-grid β

  draw: (β, glide = 0) ->
    @ground.blit-to this, 0, 0
    @grid.blit-to this, 0, glide % β

  size-to: (w, h) ->
    super w, h
    @grid.size-to w, h
    @ground.size-to w, h

