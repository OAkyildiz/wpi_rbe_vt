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




var buildings;
var labs;
var offices;
var path;


 buildings = new google.maps.KmlLayer('https://sites.google.com/site/wpirbemaprepo/home/files/buildings.kml', {
  suppressInfoWindows: true,
  preserveViewport: false,
  map: map
// if (build){
});
labs = new google.maps.KmlLayer('https://sites.google.com/site/wpirbemaprepo/home/files/labs.kml', {
  suppressInfoWindows: true,
  preserveViewport: false,
  map: map
// if (build){
});
 offices = new google.maps.KmlLayer('https://sites.google.com/site/wpirbemaprepo/home/files/offices.kml', {
  suppressInfoWindows: true,
  preserveViewport: false,
  map: map
// if (build){
});
 path = new google.maps.KmlLayer('https://sites.google.com/site/wpirbemaprepo/home/files/path1.kml', {
  suppressInfoWindows: true,
  preserveViewport: false,
  map: map
// if (build){
});

}
