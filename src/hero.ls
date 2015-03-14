
# Require

{ id, log, el, pi, tau, floor } = require \std


#
# Hero
#
# Little man icon
#

export class Hero
  ([ @x, @y, @z ]:pos, [ w, h ]:dim) ->
    @canvas = el \canvas
    @w = @canvas.width  = w * 2
    @h = @canvas.height = h * 2
    @ctx = @canvas.get-context \2d

    @canvas.style.position = \absolute
    @canvas.style.left = "#{ 80/2 - w/2 }px"
    @canvas.style.width = w + \px
    @canvas.style.height = h + \px

    @draw!

    document.body.append-child @canvas

  set: (value) ->
    @canvas.style.top = "#{ value - @h / 2 }px"

  append-to: (host) ->
    host.append-child @canvas

  blit-to: (target, x, y, α) ->
    target.ctx.global-alpha = α
    target.ctx.draw-image @canvas, x, y, @canvas.width/2, @canvas.height/2
    target.ctx.global-alpha = 1

  draw-cape: ->
    @ctx.beginPath!
    @ctx.fill-style = \#00e
    @ctx.move-to @w/2, @h/4
    @ctx.line-to @w,   @h * 3/4
    @ctx.line-to 0,    @h * 3/4
    @ctx.line-to @w/2, @h/4
    @ctx.fill!

    @ctx.beginPath!
    @ctx.fill-style = \#00b
    @ctx.move-to @w/2, @h * 2/5
    @ctx.line-to @w,   @h * 3/4
    @ctx.line-to 0,    @h * 3/4
    @ctx.line-to @w/2, @h * 2/5
    @ctx.fill!

  draw-torso: ->
    @ctx.beginPath!
    @ctx.fill-style = \grey
    @ctx.move-to @w * 1/2, @h * 2/5
    @ctx.line-to @w * 3/4, @h * 3/4
    @ctx.line-to @w * 1/2, @h * 4/4
    @ctx.line-to @w * 1/4, @h * 3/4
    @ctx.line-to @w * 1/2, @h * 2/5
    @ctx.fill!

  draw-face: ->
    @ctx.beginPath!
    @ctx.fill-style = \#852
    @ctx.arc @w/2, @h/4, @w/4, 0, tau
    @ctx.fill!

    @ctx.beginPath!
    @ctx.fill-style = \#fca
    @ctx.arc @w/2, @h/4 + @w/20, @h/10, 0, tau
    @ctx.fill!


  draw: (α) ->
    @draw-cape!
    @draw-torso!
    @draw-face!

