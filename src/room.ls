
# Require

{ id, log, el, floor } = require \std


#
# A tiled Room
#

export class Room
  ([ @x, @y, @z ]:pos, [ @w, @h, @d ]:dim, @β = 50) ->

    @canvas = el \canvas
    @canvas.style.background = \red
    @ctx = @canvas.get-context \2d
    @canvas.width = @β * @w
    @canvas.height = @β * (@h + @d)
    @generate dim
    @draw!

    #document.body.append-child @canvas

  spit: ->
    log <| (.join "\n") <| for row, y in @tiles => row.join \|

  generate: ([ w, h, d ]) ->
    @tiles =
      for y from 0 til h
        for x from 0 til w
          if y is 0 or x is 0 or x is w - 1 # No front wall
          #if y is 0 or y is h - 1 or x is 0 or x is w - 1
          then 1 else 0

  draw-block: (x, y, z) ->
    @ctx.fill-style = \#888 # BG
    @ctx.fill-rect x * @β, (@d + y - 1) * @β - 1 - z * @β, @β, @β * 2
    @ctx.fill-style = \#aaa # Side
    @ctx.fill-rect x * @β, (@d + y - 0) * @β - 1 - z * @β, @β - 1, @β - 1
    @ctx.fill-style = \#eee # Cap
    @ctx.fill-rect x * @β, (@d + y - 1) * @β - 1 - z * @β, @β - 1, @β - 1

  draw: (z = 0, v = 50 + 10 * @z) ->
    @ctx.fill-style = "rgb(#v, #v, #v)"
    @ctx.fill-rect 0, @β * @d, @canvas.width, @canvas.height - @β * @d

    for z from 0 til @d
      for row, y in @tiles
        for wall, x in row
          if wall
            @draw-block x, y, z

  blit-to: (target, x, y, α = 1) ->
    target.ctx.global-alpha = α
    target.ctx.draw-image @canvas, x, y, @canvas.width, @canvas.height
    target.ctx.global-alpha = 1

