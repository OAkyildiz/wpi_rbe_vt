var api_key='AIzaSyC5T6PpdEd7hWeEMrJcinjSJnMfzbnFaC8'
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    if (document.querySelector('html').lang)
      lang = document.querySelector('html').lang;
    else
      lang = 'en';

    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&key='+api_key+'&language=' + lang;
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
});

var wpi = {lat:42.2751, long:-71.8053, def_zoom:17};
var wpi_style = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#785b5b"},{"visibility":"simplified"}]},{"featureType":"landscape.man_made","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"},{"color":"#400707"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"color":"#4a1616"}]},{"featureType":"poi.sports_complex","elementType":"labels.text.fill","stylers":[{"color":"#350e0e"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"hue":"#ff0000"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
//TODO: Make symbosl for markers
var markers={
  size: 10
  , simple: {ico: 'res/ico/circle_ico.png', color: 'red'}
  , lab: {ico: 'res/ico/tools.svg', color: '#902A20'}
  , office: {ico: 'res/ico/desk.png', color: '#32607A'}
  , project: {ico:'res/ico/gear.png', color:'#323232'}
  , outlineColor: '#606060',
  };


var map;
var build = true;
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: wpi.lat, lng: wpi.long},
    zoom: 16.5,
    minZoom: 16,
    maxZoom: 19.5,
    zoomControl: true,
    gestureHandling: 'cooperative',
    scrollWheel: true,
    //draggable: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: wpi_style
  });
    google.maps.Polygon.prototype.getPolygonBounds=function(){
        var bounds = new google.maps.LatLngBounds()
        this.getPath().forEach(function(element,index){bounds.extend(element)})
        return bounds
    }
var buildings;
var labs;
var offices;
var path;

var layers = new Map();


layers['buildings'] = new google.maps.Data();
layers['markers'] = new google.maps.Data();
layers['path'] = new google.maps.Data();

layers['buildings'].addListener('addfeature',function(e){
  buildingCallback(e.feature) ;
});

layers['buildings'].addListener('click', function(event) {
  var feature = event.feature;
  if(feature.getGeometry().getType()=='Polygon'){
      feature.setProperty('focused', true); //set all others o false
      var bound = feature.getPolygonBounds();
      map.fitBounds(bounds);
      console.log(feature.getProperty('name'));
    }
    else{
    console.log('?');
    }
  });


layers['markers'].addListener('addfeature',function(e){
  markerCallback(e.feature) ;
});
//layers['labs'].setMap(map);

layers['buildings'].setMap(map);
layers['markers'].setMap(map);
layers['path'].setMap(map);


layers['buildings'].loadGeoJson('res/json/buildings.geojson', null);/*buildingsCallback(layers['buildings']));*/
layers['path'].loadGeoJson('res/json/path1.geojson', null);
layers['markers'].loadGeoJson('res/json/labs.geojson', null);
layers['markers'].loadGeoJson('res/json/offices.geojson', null);/*,markerCallback(layers['offices']));*/

//layers['offices'].setMap(map)
layers['markers'].setStyle( {

  icon: {
    path: google.maps.SymbolPath.CIRCLE
    , scale: 5
    , strokeColor: markers.outlineColor
    , strokeWeight: 1.5
// fillColor:'#202020'
    , fillOpacity: 1
  }
});

layers['buildings'].setStyle( {
  fillColor: '#903737',
  strokeColor: '#503030',
  strokeWeight: 2,
});

layers['path'].setStyle( {
    strokeColor: '#202020'
    ,icon: {
        path: google.maps.SymbolPath.CIRCLE
        , scale: 5
        , strokeColor: '#202020'
        , StrokeColor: markers.outlineColor
        , strokeWeight: 0.75
        , fillColor:'#202020'
        , fillOpacity: 1

    // size: new google.maps.Size(markers.size, markers.size),
    // origin: new google.maps.Point(0, 0),
    // anchor: new google.maps.Point(markers.size/2, markers.size/2),
    // scaledSize: new google.maps.Size(markers.size, markers.size)
  }
});
//

// console.log(map.data);
// map.data.forEach(function(feature) {
//     console.log('>> ');
// });
console.log("huh");

}



/////////////////
  /* Helpers */
/////////////////



function check_cb(){ console.log('done')}


function markerCallback(marker){
    var c=0;
    console.log('hit');
    console.log(marker.getProperty('name') , ', ',marker.getProperty('type'),', ', marker.getId(),': ', marker.getGeometry().getType());
    // marker.setStyle({
    //   icon:{
    //     fillColor: markers.lab.color
    //;  }

}

function labsCallback(json){
  labs=json;
  console.log(labs);
}

function  buildingCallback(feature){

  //  map.Data.setMap(map);
// Feature related stuff here
    console.log(feature.getProperty('name'));
  }
  // buildings=json;
  // console.log('wth');
  // console.log(buildings);
  //
  // $.each(buildings, function(idx, loc) {
  // //draw
  // console.log('drawing buildings');
  // loc.dwg = new google.maps.Polygon({
  //         paths: loc.coordinates,
  //         strokeColor: '#FF0000',
  //         strokeOpacity: 0.8,
  //         strokeWeight: 3,
  //         fillColor: '#FF0000',
  //         fillOpacity: 0.35
  //       });
  // loc.dwg.setMap(map);
  // // add listener
  //
  // // add counter
  //   loc.count =0;
