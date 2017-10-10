(function () {
  document.addEventListener('DOMContentLoaded', function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmFmYWxyIiwiYSI6ImNpc3U2eDdjeTAwMWUyb3B0NWt4c2szMGMifQ.I9LYvPfqGJVSYzdgdfHnmQ';
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/rafalr/cj8lib1zr5ys92spfqri0azsw',
      hash: true
    });
    map.setZoom(5)
    map.setCenter([19.5, 52.5]);
    map.on('load', function () {
      /*map.addLayer({
        'id': 'granice',
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': 'granice.geojson'
        },
        'layout': {},
        'paint': {
          'line-color': '#ddd',
          'line-opacity': {
            'stops': [[7, 0], [8, .4]]
          }
        }
      }, 'admin');*/
      map.addLayer({
        'id': 'townhall',
        'type': 'symbol',
        'source': {
          'type': 'geojson',
          'data': 'townhall.geojson'
        },
        'layout': {
          'text-field': '{name}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, -0.8],
          'text-anchor': 'bottom',
          'text-size': {
            'stops': [[5, 5], [8, 11]]
          },

          'icon-image': 'town-hall-15',
          'icon-size': {
            'stops': [[5, .2], [10, 1]]
          }
        },
        'paint': {
          //'icon-color':'#402200',
          //'icon-halo-color':'rgba(255, 206, 0, 0.95)'
          'text-color': '#B86F26',
          'text-halo-color': '#633D16',
          'text-halo-blur': .8,
          'text-halo-width': {
            'stops': [[5, .1], [8, .2]]
          },
        }
      }, 'state_label');
      map.addLayer({
        'id': 'etykiety',
        'type': 'symbol',
        'source': {
          'type': 'geojson',
          'data': 'etykiety.geojson'
        },
        layout: {
          'text-field': '{name}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],

          'text-size': 14
        },
        paint: {
          'text-color': '#2ecc71',
          'text-opacity': {
            'stops': [[9, 0], [10, 1]]
          }
        }
      });
      map.on('click', 'etykiety', function (e) {
        var features = map.queryRenderedFeatures(e.point);
        var gmina = e.features[0].properties.name;
        new mapboxgl.Popup()
          .setLngLat(e.features[0].geometry.coordinates)
          .setHTML('<a target="_blank" href="https://www.google.pl/search?q=bip ' + gmina + '">BIP ' + gmina + '</a> ')
          .addTo(map);
      });
      map.on('click', 'townhall', function (e) {
        var features = map.queryRenderedFeatures(e.point);
        var obj = e.features[0].properties['@id'];
        obj = obj.replace(/([a-z])[a-z]{2,7}\/([0-9]{1,})/, '$1$2')
        new mapboxgl.Popup()
          .setLngLat(features[0].geometry.coordinates)
          .setHTML('<a onclick="loadObj(\'' + obj + '\')"  href="#">Otwórz w JOSM</a> ')
          .addTo(map);
      });
      map.on('zoom', function () {
        var z = map.getZoom();
        var editBt = document.getElementById('editBt')
        if (z < 13) {
          editBt.style.display = 'none';
        } else {
          editBt.style.display = 'block';
        }
      });
      document.getElementById('editBt').addEventListener('click', editInJOSM);
      document.getElementById('searchBt').addEventListener('click', searchQuery);
      document.getElementById('query').addEventListener('keypress', function (e) {
        if (e.keyCode == 13) {
          searchQuery()
        }
      })
    });
  });

})()

function loadObj(obj) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://localhost:8112/load_object?objects=' + obj);
  xhr.send();
}

function editInJOSM() {
  var bb = map.getBounds();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://localhost:8112/load_and_zoom?left=' + bb.getWest() + '&right=' + bb.getEast() + '&top=' + bb.getNorth() + '&bottom=' + bb.getSouth());
  xhr.send();
}

function searchQuery() {
  var xhr = new XMLHttpRequest();
  var q = document.getElementById('query').value;
  xhr.open('GET', 'https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + q)
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      var json = JSON.parse(xhr.responseText);
      var items = [];
      json.forEach(function (el, index, array) {
        items.push('<li><a href="#" onclick="goTo(' + el.lat + ',' + el.lon + ')">' + el.display_name + '</a></li>');
      });
      document.getElementById('res').innerHTML = items.join('');

    }
  };
  xhr.send();
}

function goTo(lat, lon) {
  map.flyTo({
    center: [lon, lat],
    zoom: 16.9,
    speed: 0.9,
  })
}
