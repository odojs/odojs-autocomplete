(function() {
  var achelper, autocomplete, component, dom, exe, hub, items, odoql, relay, root, router, scene, _ref;

  _ref = require('odojs'), component = _ref.component, hub = _ref.hub, dom = _ref.dom;

  achelper = require('./index');

  relay = require('odo-relay');

  exe = require('odoql-exe');

  odoql = require('odoql/odojs');

  component.use(odoql);

  hub = hub();

  exe = exe({
    hub: hub
  });

  items = ['Buildings', 'Shared Services', 'Control Systems', 'High Voltage', 'Other', 'Fluid Exchanger', 'Protection System', 'Steam Plant', 'Steam Turbines', 'Geo Wells', 'Therm Generators', 'Transformers', 'Transmission'];

  autocomplete = component({
    render: function(state, params, hub) {
      var ac, isopen, _ref1, _ref2;
      params = (_ref1 = params.autocomplete) != null ? _ref1 : {};
      if (params.value == null) {
        params.value = '';
      }
      if (params.isopen == null) {
        params.isopen = false;
      }
      if (params.selectedindex == null) {
        params.selectedindex = null;
      }
      if (params.items == null) {
        params.items = items;
      }
      ac = achelper(state, params, hub.child({
        update: function(p, cb) {
          p.items = items.filter(function(item) {
            return item.toLowerCase().indexOf(p.value.toLowerCase()) === 0;
          });
          if (p.items.length === 1) {
            if (p.items[0] === p.value) {
              p.items = items;
            } else if (p.isopen && (p.selectedindex == null)) {
              p.selectedindex = 0;
            }
          }
          hub.emit('update', {
            autocomplete: p
          });
          return cb();
        }
      }));
      ac.inputparams.value = params.value;
      ac.inputparams.attributes = {
        type: 'text',
        placeholder: (_ref2 = ac.options.placeholder) != null ? _ref2 : 'Type to autocomplete'
      };
      isopen = params.isopen && params.items.length > 0;
      return dom(".autocomplete" + (isopen ? '.open' : ''), [
        dom('input', ac.inputparams), isopen ? dom('ul', params.items.map(function(item, index) {
          var description, isselected, linkparams;
          description = dom('span', item);
          if (params.items.length !== items.length) {
            description = [dom('span.underline', item.substr(0, params.value.length)), dom('span', item.substr(params.value.length))];
          }
          isselected = index === params.selectedindex;
          linkparams = ac.linkparams(item, index);
          linkparams.attributes = {
            href: '#'
          };
          return dom("" + (isselected ? 'li.selected' : 'li'), dom('a', linkparams, description));
        })) : void 0
      ]);
    }
  });

  router = component({
    render: function(state, params, hub) {
      if (params.autocomplete == null) {
        params.autocomplete = {};
      }
      return dom('#root', [autocomplete(state, params, hub), dom('p', 'Some trash here')]);
    }
  });

  root = document.querySelector('#root');

  scene = relay(root, router, exe, {
    hub: hub
  });

  hub.every('update', function(p, cb) {
    console.log(p != null ? p.autocomplete : void 0);
    scene.update(p);
    return cb();
  });

  scene.update({});

}).call(this);
