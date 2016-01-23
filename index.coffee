debounce = require 'debounce'

keys =
  13: 'enter'
  27: 'esc'
  38: 'up'
  40: 'down'

mod = (m, p) -> ((m % p) + p) % p

module.exports = (state, params, hub) ->
  options = params.options ? {}

  update = (obj) ->
    params[key] = value for key, value of obj if obj
    hub.emit 'update', params

  updatevalue = (value) -> update
    value: value
    isopen: yes
    selectedindex: null

  clickingonitem = no

  options: options
  keys: keys
  update: update
  updatevalue: updatevalue
  updatevalue: debounce updatevalue, options.debounce ? 200
  inputparams:
    onkeydown: (e) ->
      key = keys[e.which]
      return if !key?

      if key is 'esc'
        e.preventDefault()
        if params.isopen
          update
            isopen: no
            selectedindex: null
        else
          update
            value: ''
            selectedindex: null
        return

      if key in ['up', 'down']
        e.preventDefault()
        if params.isopen
          delta = if key is 'up' then -1 else 1
          if params.selectedindex?
            params.selectedindex += delta
            params.selectedindex = mod params.selectedindex, params.items.length
          else
            params.selectedindex = 0
          update()
        else
          update
            isopen: yes
            selectedindex: 0
        return

      if key is 'enter' and params.isopen and params.selectedindex?
        e.preventDefault()
        update
          isopen: no
          selectedindex: null
          value: params.items[params.selectedindex]
    onkeyup: (e) ->
      key = keys[e.which]
      return if key?
      updatevalue e.target.value
    onfocus: (e) ->
      update isopen: yes
    onblur: (e) ->
      return if clickingonitem
      update isopen: no
  linkparams: (item, index) ->
    onmouseenter: (e) -> update selectedindex: index
    onmouseleave: (e) -> update selectedindex: null
    onmousedown: (e) -> clickingonitem = yes
    onclick: (e) ->
      e.preventDefault()
      update
        isopen: no
        selectedindex: null
        value: item
