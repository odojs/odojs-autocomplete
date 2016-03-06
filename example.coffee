{ component, hub, dom } = require 'odojs'
achelper = require 'odojs-autocomplete'
relay = require 'odo-relay'
exe = require 'odoql-exe'
relay = require 'odo-relay'
odoql = require 'odoql/odojs'
component.use odoql

hub = hub()
exe = exe hub: hub

items = [
  'Buildings'
  'Shared Services'
  'Control Systems'
  'High Voltage'
  'Other'
  'Fluid Exchanger'
  'Protection System'
  'Steam Plant'
  'Steam Turbines'
  'Geo Wells'
  'Therm Generators'
  'Transformers'
  'Transmission'
]

autocomplete = component
  render: (state, params, hub) ->
    params = params.autocomplete ? {}
    params.value ?= ''
    params.isopen ?= no
    params.selectedindex ?= null
    params.items ?= items

    ac = achelper state, params, hub.child
      update: (p, cb) ->
        p.items = items.filter (item) -> item.toLowerCase().indexOf(p.value.toLowerCase()) is 0
        if p.items.length is 1
          if p.items[0] is p.value
            p.items = items
          else if p.isopen and !p.selectedindex?
            p.selectedindex = 0
        hub.emit 'update', autocomplete: p
        cb()

    ac.inputparams.value = params.value
    ac.inputparams.attributes =
      type: 'text'
      placeholder: ac.options.placeholder ? 'Type to autocomplete'

    isopen = params.isopen and params.items.length > 0
    dom ".autocomplete#{if isopen then '.open' else ''}", [
      dom 'input', ac.inputparams
      if isopen
        dom 'ul', params.items.map (item, index) ->
          description = dom 'span', item
          if params.items.length isnt items.length
            description = [
              dom 'span.underline', item.substr 0, params.value.length
              dom 'span', item.substr params.value.length
            ]
          isselected = index is params.selectedindex
          linkparams = ac.linkparams item, index
          linkparams.attributes = href: '#'
          dom "#{if isselected then 'li.selected' else 'li'}", dom 'a', linkparams, description
    ]

router = component
  render: (state, params, hub) ->
    params.autocomplete ?= {}
    dom '#root', [
      autocomplete state, params, hub
      dom 'p', 'Some trash here'
    ]

root = document.querySelector '#root'
scene = relay root, router, exe, hub: hub

hub.every 'update', (p, cb) ->
  console.log p?.autocomplete
  scene.update p
  cb()

scene.update {}
