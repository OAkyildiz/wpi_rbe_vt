var api_key='AIzaSyC5T6PpdEd7hWeEMrJcinjSJnMfzbnFaC8'
var api_key2='AIzaSyD-MPagQ1OQT4urv8RYak6m_LHugkrBr6Q'
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    if (document.querySelector('html').lang)
      lang = document.querySelector('html').lang;
    else
      lang = 'en';

    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&key='+api_key2+'&language=' + lang;
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
});
//used for
var ne = 0;
var sw = 0;
//var md = require('markdown-it')()

var wpi = {latLng: {lat:42.2751, lng:-71.8053}, def_zoom:16.5};
var wpi_style = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#785b5b"},{"visibility":"simplified"}]},{"featureType":"landscape.man_made","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"},{"color":"#400707"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"color":"#4a1616"}]},{"featureType":"poi.sports_complex","elementType":"labels.text.fill","stylers":[{"color":"#350e0e"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"hue":"#ff0000"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
//TODO: Make symbosl for markers
var markers={
  size: 10
  , types: new Map()
  , outlineColor: '#606060'
  , boldOutlineColor: '#404040'
}

var buildings = new Map();
var labs;
var offices;
var path;
var overlay_state= false;
var overlay_content = null;

var hovered_feature;//


var layers = new Map();
var temp_ico;

markers.types['lab']= {ico: 'res/ico/tools.svg', color: '#902A20', hColor: '#B03B30'};
markers.types['office']= {ico: 'res/ico/desk.png', color: '#808080', hColor: '#959595'};
markers.types['project']= {ico:'res/ico/gear.png', color:'#323232', hColor: '#454545'};
markers.types['cluster']= {ico:'res/ico/gear.svg', color:'#301020', hColor: '#351525'};

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
    //gestureHandling: 'cooperative',
    gestureHandling: 'none',
    scrollWheel: true,
    //draggable: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: wpi_style
  });

//////// I.E. USE THIS TO IDSABLE WHEN OVERLAY IS ON
/////////////////////////
//addDomListener(instance:Object, eventName:string, handler:Function)
///////////////////////

markers.types['simple']= {ico: google.maps.SymbolPath.CIRCLE, color: 'red'};

temp_ico = {path: markers.types['simple'].ico
  , scale: 8
, strokeColor: markers.outlineColor
, strokeWeight: 1
, fillColor: markers.types['simple'].color
, fillOpacity: 0.65
}
map.addListener('click', function(event) { defaultView(map);});
map.addListener(map, 'idle', function() {
                  var bounds =  map.getBounds();
                  ne = bounds.getNorthEast();
                  sw = bounds.getSouthWest();
                  //do whatever you want with those bounds
         });


layers['buildings'] = new google.maps.Data();
layers['markers'] = new google.maps.Data();
layers['path'] = new google.maps.Data();

layers['buildings'].addListener('addfeature',function(e){
  buildingCallback(e.feature, buildings, map) ;
});

/* buildings */

layers['buildings'].addListener('click', function(event) {
  focusBuilding(event.feature, layers['buildings']);
  // TODO: resize markers here.
  });
layers['buildings'].addListener('mouseover', function(event) {
  mouseOverHandler(event, layers['buildings']);
  });

  layers['buildings'].addListener('mouseout', function(event) {
    layers['buildings'].revertStyle();
  });


  /* Markers */
layers['markers'].addListener('addfeature',function(event) {
   markerCallback(event, layers['markers'], buildings);
 });

 // layers['markers'].addListener('mouseover', function(event) {
 //   mouseOverHandler(event, layers['buildings']);
 //   });
 //
 //   layers['markers'].addListener('mouseout', function(event) {
 //     layers['markers'].revertStyle();
 //   });

 layers['markers'].addListener('click',function(event) {
    //markerClicked(event, layers['markers'], buildings);
    show_overlay(event.feature.getProperty('name'),event.feature.getProperty('label'));
  });

  layers['markers'].addListener('mouseover',function(event) {
     marker=event.feature;
    // markerCallback(event, layers['markers'], buildings);
    layers["markers"].overrideStyle(marker, {
      icon: {
        scale: 9,
        path: markers.types['simple'].ico,
        strokeColor: markers.boldOutlineColor,
        strokeWeight: 2.5,
        fillColor: markers.types[marker.getProperty('class')].hColor,
        fillOpacity: 1
      }}
    );

    //currently not priority. show label
    if (false){
      var point = map.getProjection().fromLatLngToPoint(event.latLng);
      console.log(marker.getProperty(point));

      show_tooltip(marker.getProperty('name'), point);
     }
   });

   layers['markers'].addListener('mouseout',function(event) {
     marker=event.feature;
     hide_tooltip();

     layers["markers"].overrideStyle(marker, {
       icon: {
         path: markers.types['simple'].ico,
         scale: 5,
         strokeColor: markers.outlineColor,
         strokeWeight: 1.5,
         fillColor: markers.types[marker.getProperty('class')].color,
         fillOpacity: 1
       }});
    });

//layers['labs'].setMap(map);

layers['path'].setMap(map);
layers['buildings'].setMap(map);
layers['markers'].setMap(map);


layers['path'].loadGeoJson('res/json/path1.geojson', null);
layers['buildings'].loadGeoJson('res/json/buildings.geojson', null, check_cb('buildings'));/*buildingsCallback(layers['buildings']));*/
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
  strokeColor: '#502020',
  strokeWeight: 2,
});

layers['path'].setStyle( {
    strokeColor: '#906060'

    ,icon: {
        path: markers.types['simple'].ico
        , scale: 5
        , strokeColor: '#906060'
        , StrokeColor: markers.outlineColor
        , strokeWeight: 0.75
        , fillColor:'#453535'
        , fillOpacity: 1
}});

console.log("eol");
}

///**Tooltip**////
function show_tooltip(name, point){
  $('#marker-tooltip').html(name).css({
       'left': point.x,
       'top': point.y,
       'display': 'block'
     });
}

function hide_tooltip(){
  $('#marker-tooltip').html(name).css({
       'display': 'none'
     });
}

///////
/////////////////
  /* Helpers */
/////////////////


function defaultView(map){
  map.setCenter(wpi.latLng);
  map.setZoom(wpi.def_zoom);
  //buildings.forEach(resetClusters);
  //gatherCluster(buildings['85p']);
  resetClusters();
}

function check_cb(name){ console.log(name,'done')}

function markerCallback(event, layer, bmap){
    marker=event.feature;//console.log('hit');
    building=marker.getProperty('building');

    //marker.setMap(null); // hide the marker
    bmap[building].features.push(marker);
    // console.log(  bmap[building]);
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
  console.log(f.getProperty('name'));
  label=f.getProperty('label');
  bmap[label]={};// Feature related stuff here
  bmap[label].features=[];// Feature related stuff here
  bmap[label].center=getPolygonBounds(f).getCenter();
  bmap[label].cluster=createCluster(label ,bmap ,gmap);
  bmap[label].actual=f;

  //marker.addListener('click',function() {

//  });
  //temp_ico=(bmap[label].cluster.getIcon());
// var icon = {
//     url: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/aa.svg",
//     anchor: new google.maps.Point(25,50),
//     scaledSize: new google.maps.Size(50,50)
// }
}

function createCluster(lbl ,bmap ,gmap){
  marker = new google.maps.Marker({
      visible: true
    , map: gmap
    , position:  bmap[lbl].center
    , building: lbl //   dirty circle reference
    , label: '0'
    , icon: temp_ico // TODO: check for a potential bug where async loading
                    // changes the scale of temp_ico before it's loaded
  });
  console.log(lbl);

  //console.log(bmap[label].cluster.getIcon());

  marker.addListener('click',function() {
     // markerCallback(event, layers['markers'], buildings);
     //TODO animation here
    //showInfo(bmap[lbl]);

    breakCluster(bmap[lbl]);
    focusBuilding(bmap[lbl].actual); // workaround for now
//layers['buildings'] //need to get the building polygon
  //  on();
    });
    return marker;
}

function resetClusters(){
  for (var key in buildings) {
    if (buildings.hasOwnProperty(key)) {
        gatherCluster(buildings[key]);
      }
    }
  }


//hover -> break, clickable
//click -> break, unclickable, lock OR toggle, clickable

function breakCluster(building){
  //TODO: animation here
      building.cluster.setVisible(false);
      console.log(building.cluster.building)
      for(idx=0; idx<building.features.length; idx++){
        //vectorize (map)
      // console.log(building.features[idx].coordinates);
        map.data.revertStyle();
        layers['markers'].overrideStyle(building.features[idx], {
          visible: true,
          clickable: true,
        });
      }} //shrink and distribute animation

function gatherCluster(building){
  //TODO: animation here
  for(idx=0; idx<building.features.length; idx++){

    //console.log(bmap[building].features[idx]);
    map.data.revertStyle();
    layers['markers'].overrideStyle(building.features[idx], {
      visible: false,
      clickable: false,
    });
  }
  building.cluster.setVisible(true);

}

function markerFromEntry(){}

function focusBuilding(feature){

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
      hovered_feature=feature;
      }
      else{
      console.log('?');
      hovered_feature=null;
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

/* overlay stuff*/

//  name is provided for now to replace missing label
// TODO: get rid of name
function show_overlay(name,requested) {
  console.log("show " +name);
    if (overlay_content!=requested){
       update_overlay(name, requested);
     }
     overlay_state = true;
    document.getElementById("overlay").style.display = "flex";

}

function hide_overlay() {
  document.getElementById("overlay").style.display = "none";
  overlay_state = false;
  //not needed for now? maybe seperate falgs
}

function update_overlay(name,requested){
      var dict;
      var path;
      document.getElementById("header_text").innerHTML=name;
      console.log("loading " + requested );
      $.getJSON("info/json/" + requested + ".json",function (data){
        dict=data;
        path="info/pages/" + requested +"/";
        document.getElementById("cover_img").src =path+dict.cover;
      })  .done(function() {
    console.log( "setting contents" );
    set_contents(path, dict)
  })
  .fail(function() {
    console.log( "no content here yet" );
    set_placeholder();
  })
  .always(function() {
    console.log( "complete" );
  });
      overlay_content = requested;


}

function set_placeholder(){
  document.getElementById("cover_img").src
  = "res/img/portrait-placeholder.jpeg";

  document.getElementById("article").innerHTML = "Article";
  $("#personal").hide();
  $("#links").hide();

  //TODO: getJSON only when the JSON is not saved
  // setContents after that
  // clean memory when not focused
  // make the contents[label] = {} a timed queue?
}

function set_contents(path, dict){
  //document.getElementById("header_text").innerHTML=name;
  //check conetn for exists?
  document.getElementById("cover_img").src =path+"img/"+dict.cover;
  document.getElementById("article").innerHTML;
  populate_links(path, dict.links);
  fill_info(dict);
  load_internal(path+'html/'+dict["main"]);
  // fill_carousel(path+"img/",dict["photos"]);
  $("#article>a").click(function(e){e.preventDefault(); window.open(a.href, target='_blank'); return false;});
  //md.render('!!!include('+path+"md/"+dict.main+')!!!');
}

function load_internal(href){
  fetch(href)
  .then(data => data.text())
  .then(html => document.getElementById('article').innerHTML = html);

}


function fill_info(dict){
  fields=["room", "building", "phone", "email"];
  // console.log("contact.info");
  for(var x in fields){
    key=fields[x];
    val=dict[key];
    // console.log(key +": " +val);
    if (dict.hasOwnProperty(key)) {
      //TODO: add mailto here. if key=email
      if (val){
        $('span#'+key).html(val);
        $('.contact#'+key).show();
      }
      else{
        $('.contact#'+key).hide();
      }
    }
    else{
      $('.contact#'+key).hide();
    }
  }
  $("#personal").show();
}

    function jPopulate_links(path, linkmap){

    $('#links').append("<a class=\"sidelink\" >hey!</a>");

    }

function populate_links(path, linkmap){
    div_links=document.getElementById("links")
    //console.log(div_links.className)
    c=0;
    $('#links').empty();
    //div_links.removeChildren();
      //console.log(key + " -> " + linkmap[key]);


    for (var key in linkmap) {
      if (linkmap.hasOwnProperty(key)) {
        //console.log(key + " -> " + linkmap[key]);
        var a = set_link(a,path,key, linkmap[key]);
        a.setAttribute("id", "sidelink");
        div_links.appendChild(a);
        c+=1;
      }
    }
    $("#links").show();
}
// can we handle this with just the json value and setting onclick handle
//$(this).addClass('local');
function set_link(a,path, key, uri){
  var a = document.createElement('a');
  var txt = document.createTextNode(key);
  a.appendChild(txt);
  a.title = key;
  //md check here;
  a.href = uri;
  //ternary this + jquery?
  if(location.hostname === a.hostname || !a.hostname.length){
    a.href= path+'html/'+uri;
    a.className="internal";
  }
  else {
    a.className="external";
  }
    a.onclick=function (e) {
            return handle_link(a);
  };
  return a;
}

function handle_link(a){
  console.log(a.className);
  if(a.className=="external"){
      window.open(a.href, target='_blank');

   }
   else if(a.className=="internal") {
       //className
       load_internal(a.href);
     }
     return false;

}

function fill_carousel(path, images){
    slides=document.getElementById("slides")
    //console.log(div_links.className)
    c=0;
    $('.slide').remove();
    if(Object.keys(images).length === 0){
      $('footer').hide();
    }
    else{
      for (var img_path in images) {
        if (images.hasOwnProperty(fig)) {
          //console.log(key + " -> " + linkmap[key]);
          var li = document.createElement('li').className("slide");
          var fig = document.createElement('figure');
          var a = document.createElement('a');
          var img = document.createElement('img');
          a.href=images[img_path];
          img.src=path+img_path; //TODO: this will need link handling
          img.alt=img_path;
          slides.appendChild(li);
          li.appendChild(fig);
          fig.appendChild(a);
          a.appendChild(img);

          c+=1;
      }
    }
    $('footer').show();
  }
}
