var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-71.8036,42.2746]),
    minZoom: 16,
    maxZoom: 20,
    zoom:17
  })
});

map.setView(new ol.View({
  center: map.getView().getCenter(),
  extent: map.getView().calculateExtent(map.getSize()),
  zoom: map.getView().getZoom()
}));
