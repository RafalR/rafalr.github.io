
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmFmYWxyIiwiYSI6ImNpc3U2eDdjeTAwMWUyb3B0NWt4c2szMGMifQ.I9LYvPfqGJVSYzdgdfHnmQ';
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9'
    });
    map.setZoom(5)
    map.setCenter([19.5, 52.5]);
    map.on('load', function () {
      map.addLayer({
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
      }, 'water');
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
          
          'icon-image':'town-hall-15',
          'icon-size': {
            'stops': [[5, .2], [10, 1]]
          }
        },
        'paint': {
          //'icon-color':'#402200',
          //'icon-halo-color':'rgba(255, 206, 0, 0.95)'
          'text-color':'#fff',
          'text-halo-color':'#111',
          'text-halo-blur':3,
          'text-halo-width': {
            'stops': [[5, 1], [8, 2]]
          },
        }
      });
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
          'text-color': '#fff',
          'text-opacity': {
            'stops': [[7, 0], [8, .4]]
          }
        }
      });
      map.on('click', 'etykiety', function (e) {
         var features = map.queryRenderedFeatures(e.point);
        console.log(features)
        //var gmina = e.features[0].properties.name;
        //new mapboxgl.Popup()
          //.setLngLat(e.features[0].geometry.coordinates)
          //.setHTML('<a href="https://www.google.pl/search?q=bip'+gmina+'"">BIP '+gmina+'</a> ')
          //.addTo(map);
      });
    });
  });

})()