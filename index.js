(function() {
  var debounce, keys, mod;

  debounce = require('debounce');

  keys = {
    13: 'enter',
    27: 'esc',
    38: 'up',
    40: 'down'
  };

  mod = function(m, p) {
    return ((m % p) + p) % p;
  };

  module.exports = function(state, params, hub) {
    var clickingonitem, options, update, updatevalue, _ref, _ref1;
    options = (_ref = params.options) != null ? _ref : {};
    update = function(obj) {
      var key, value;
      if (obj) {
        for (key in obj) {
          value = obj[key];
          params[key] = value;
        }
      }
      return hub.emit('update', params);
    };
    updatevalue = function(value) {
      return update({
        value: value,
        isopen: true,
        selectedindex: null
      });
    };
    clickingonitem = false;
    return {
      options: options,
      keys: keys,
      update: update,
      updatevalue: updatevalue,
      updatevalue: debounce(updatevalue, (_ref1 = options.debounce) != null ? _ref1 : 200),
      inputparams: {
        onkeydown: function(e) {
          var delta, key;
          key = keys[e.which];
          if (key == null) {
            return;
          }
          if (key === 'esc') {
            e.preventDefault();
            if (params.isopen) {
              update({
                isopen: false,
                selectedindex: null
              });
            } else {
              update({
                value: '',
                selectedindex: null
              });
            }
            return;
          }
          if (key === 'up' || key === 'down') {
            e.preventDefault();
            if (params.isopen) {
              delta = key === 'up' ? -1 : 1;
              if (params.selectedindex != null) {
                params.selectedindex += delta;
                params.selectedindex = mod(params.selectedindex, params.items.length);
              } else {
                params.selectedindex = 0;
              }
              update();
            } else {
              update({
                isopen: true,
                selectedindex: 0
              });
            }
            return;
          }
          if (key === 'enter' && params.isopen && (params.selectedindex != null)) {
            e.preventDefault();
            return update({
              isopen: false,
              selectedindex: null,
              value: params.items[params.selectedindex]
            });
          }
        },
        onkeyup: function(e) {
          var key;
          key = keys[e.which];
          if (key != null) {
            return;
          }
          return updatevalue(e.target.value);
        },
        onfocus: function(e) {
          return update({
            isopen: true
          });
        },
        onblur: function(e) {
          if (clickingonitem) {
            return;
          }
          return update({
            isopen: false
          });
        }
      },
      linkparams: function(item, index) {
        return {
          onmouseenter: function(e) {
            return update({
              selectedindex: index
            });
          },
          onmouseleave: function(e) {
            return update({
              selectedindex: null
            });
          },
          onmousedown: function(e) {
            return clickingonitem = true;
          },
          onclick: function(e) {
            e.preventDefault();
            return update({
              isopen: false,
              selectedindex: null,
              value: item
            });
          }
        };
      }
    };
  };

}).call(this);
