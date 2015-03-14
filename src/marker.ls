
# Require

{ id, log, el, floor } = require \std


#
# Marker
#
# Little line that hugs the left of the screen, for visualisation
#

export class Marker
  (col, pos = 0, shadow = 0) ->
    @dom = el \div

    @dom.style <<< do
      background: col
      height : \1px
      width : \100px
      position: \absolute
      left: 0

    @append-to document.body

    @set pos
    if shadow then @set-shadow shadow

  append-to: (host) ->
    host.append-child @dom

  set: (value) ->
    @dom.style.top = (floor value) + \px

  set-shadow: (value) ->
    @dom.style.border-bottom = "#{floor value * 100}px solid #444"


