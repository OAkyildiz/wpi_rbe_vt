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

var wpi = {latLng: {lat:42.2751, lng:-71.8053}, def_zoom:16.5};
var wpi_style = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#785b5b"},{"visibility":"simplified"}]},{"featureType":"landscape.man_made","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"},{"color":"#400707"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"color":"#4a1616"}]},{"featureType":"poi.sports_complex","elementType":"labels.text.fill","stylers":[{"color":"#350e0e"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"hue":"#ff0000"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
//TODO: Make symbosl for markers
var markers={
  size: 10
  , types: new Map()
  , outlineColor: '#606060'
}

var buildings = new Map();
var labs;
var offices;
var path;

var layers = new Map();
var temp_ico;

markers.types['lab']= {ico: 'res/ico/tools.svg', color: '#902A20'};
markers.types['office']= {ico: 'res/ico/desk.png', color: '#32607A'};
markers.types['project']= {ico:'res/ico/gear.png', color:'#323232'};
markers.types['cluster']= {ico:'res/ico/gear.svg', color:'#301020'};

var cluster_ico={path: markers.types['cluster'].ico
  , scale: 8
, strokeColor: markers.outlineColor
, strokeWeight: 1
, fillColor: markers.types['cluster'].color
, fillOpacity: 1
};

var map;
var build = true;


function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: wpi.latLng,
    zoom: wpi.def_zoom,
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



markers.types['simple']= {ico: google.maps.SymbolPath.CIRCLE, color: 'red'};

temp_ico = {path: markers.types['simple'].ico
  , scale: 8
, strokeColor: markers.outlineColor
, strokeWeight: 1
, fillColor: markers.types['simple'].color
, fillOpacity: 0.65
}
map.addListener('click', function(event) { defaultView(map);});
map.addListener('idle', function(event) {console.log('idle');});


layers['buildings'] = new google.maps.Data();
layers['markers'] = new google.maps.Data();
layers['path'] = new google.maps.Data();

layers['buildings'].addListener('addfeature',function(e){
  buildingCallback(e.feature, buildings, map) ;
});



layers['buildings'].addListener('click', function(event) {
  focusBuilding(event, layers['buildings']);
  });
layers['buildings'].addListener('mouseover', function(event) {
  mouseOverHandler(event, layers['buildings']);
  });

  layers['buildings'].addListener('mouseout', function(event) {
    layers['buildings'].revertStyle();
  });

layers['markers'].addListener('addfeature',function(event) {
   markerCallback(event, layers['markers'], buildings);
 });
//layers['labs'].setMap(map);

layers['buildings'].setMap(map);
layers['markers'].setMap(map);
layers['path'].setMap(map);


layers['buildings'].loadGeoJson('res/json/buildings.geojson', null, check_cb('buildings'));/*buildingsCallback(layers['buildings']));*/
layers['path'].loadGeoJson('res/json/path1.geojson', null);
layers['markers'].loadGeoJson('res/json/labs.geojson', null);
layers['markers'].loadGeoJson('res/json/offices.geojson', null, check_cb('markers'));/*,markerCallback(layers['offices']));*/

//layers['offices'].setMap(map)
layers['markers'].setStyle( {

  icon: {
    path: markers.types['simple'].ico
    , scale: 5
    , strokeColor: markers.outlineColor
    , strokeWeight: 1.5
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
        path: markers.types['simple'].ico
        , scale: 5
        , strokeColor: '#202020'
        , StrokeColor: markers.outlineColor
        , strokeWeight: 0.75
        , fillColor:'#202020'
        , fillOpacity: 1
}});

console.log("eol");

}


/////////////////
  /* Helpers */
/////////////////


function defaultView(map){
  map.setCenter(wpi.latLng);
  map.setZoom(wpi.def_zoom);
}
function check_cb(name){ console.log(name,'done')}


function markerCallback(event, layer, bmap){
    marker=event.feature;//console.log('hit');
    building=marker.getProperty('building');
    //console.log(building);

    //marker.setMap(null); // hide the marker
    bmap[building].features.push(marker);
    //console.log(layer);
    console.log(marker.getProperty('class'));
    layer.overrideStyle(marker, {
      visible: false,
      clickable: false,
      icon: {
        path: markers.types['simple'].ico
        , scale: 5
        , strokeColor: markers.outlineColor
        , strokeWeight: 1.5
        , fillColor: markers.types[marker.getProperty('class')].color
        , fillOpacity: 1
      }}
    );
    n=bmap[building].features.length;
    bmap[building].cluster.setLabel(n.toString());
    temp_ico.scale=8+n/2;
    bmap[building].cluster.setIcon(temp_ico);
    //console.log( bmap[building])
    //layers['buildings'].overrideStyle(bmap[building].cluster,{icon: {path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,  scale:6+2*n}});
    //google.maps.Marker.setStyle();
    // marker.setStyle({
    //   icon:{
    //     fillColor: markers.lab.color
    //;  }
}

function  buildingCallback(f,bmap, gmap){
  //f.setProperty("center",getPolygonBounds(f).getCenter());
  label=f.getProperty('label');
  bmap[label]={};// Feature related stuff here
  bmap[label].features=[];// Feature related stuff here
  bmap[label].center=getPolygonBounds(f).getCenter();
  bmap[label].cluster=new google.maps.Marker({
      visible: true
    , map: gmap
    , position:  bmap[label].center
    , label: '0'
    , icon: temp_ico // TODO: check for a potential bug where async loading
                    // changes the scale of temp_ico before it's loaded
  });
  console.log(f.getProperty('name'));
  //console.log(bmap[label].cluster.getIcon());
  bmap[label].cluster.addListener('mouseover',function(event) {
    // markerCallback(event, layers['markers'], buildings);
    console.log(label);
   });

  bmap[label].cluster.addListener('click',function(event) {
     // markerCallback(event, layers['markers'], buildings);
     //TODO animation here
      bmap[label].cluster.setVisible(false);
      console.log(label)
      for(idx=0; idx<bmap[label].features.length; idx++){

        //console.log(bmap[building].features[idx]);
        map.data.revertStyle();
        layers['markers'].overrideStyle(bmap[label].features[idx], {
          visible: true,
          clickable: true,
        });

        //setVisible(true);
      }
    });
  //temp_ico=(bmap[label].cluster.getIcon());
// var icon = {
//     url: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/aa.svg",
//     anchor: new google.maps.Point(25,50),
//     scaledSize: new google.maps.Size(50,50)
// }
}
function clusterMarkers(){}


//hover -> break, clickable
//click -> break, unclickable, lock OR toggle, clickable

function breakCluster(){} //shrink and distribute animation

function gatherCluster(){}

function markerFromEntry(){}

function focusBuilding(event, layer){

    var feature = event.feature;
    if(feature.getGeometry().getType()=='Polygon'){
        feature.setProperty('focused', true); //set all others o false
        map.fitBounds(getPolygonBounds(feature));
        console.log(feature.getProperty('name'));
      }
}
function mouseOverHandler(event, layer){
  if(event.feature.getGeometry().getType()=='Polygon'){
    highlightBuilding(event.feature, layer);}
  else{
    console.log(event.feature.getGeometry().getType())}
}
function highlightBuilding(feature, layer){
     if(feature.getGeometry().getType()=='Polygon'){
      layer.revertStyle();
      layer.overrideStyle(feature, {strokeWeight: 4.5, fillColor: '#C04040'});
      }
      else{
      console.log('?');
      }
}
function getPolygonBounds(f){
    var bounds = new google.maps.LatLngBounds();
    f.getGeometry().getArray().forEach(function(path){
      path.getArray().forEach(function(latLng){
        bounds.extend(latLng);
      });
    });

    return bounds;
}
function labsCallback(json){
  labs=json;
  console.log(labs);
}
