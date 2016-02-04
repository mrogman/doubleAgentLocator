import DoubleAgent from './DoubleAgent'
import DoubleAgentCollection from './DoubleAgentCollection'
import { search, removeExistingSearchResults, focusedName } from './header.js'

/* Set leaflet and mapbox options here */
var settings = {

    leaflet: {
        defaults: {
            zoom: 4,
            searchPanOffset: [200, -50], //amount in px to shift pan to show marker when search results open
            panOptions: {
                animate: true,
                duration: 0.35,
                easeLinearity: 0.5
            },
            coords: [39.953876, -95.28392],
            markers: {
                opacity: 0.75,
                click: {
                    zoom: 0
                }
            },
            icons: {
                //size: ,
                imageUrl: {
                    male: '/img/agent_m_dark.png',
                    female: '/img/agent_f_dark.png'
                }
            }
        },
        options: {
            keyboardPanOffset: 350,
            zoomControl: false,
            maxBounds: [[84.67351256610522, -174.0234375],
                        [-84.67351256610522, 174.0234375]]
        }
    },

    mapbox: {
        defaultStyle: 'dark', //use this to set default tile layer
        accessToken: 'pk.eyJ1IjoibXJvZ21hbiIsImEiOiJjaWsxczUyeTQzYWd5dm9raTBkanozczlxIn0.-jgr6Bgk4YRJVkKM_pJTUg',

        getUrl: (style, token)=> {
            return `https://api.mapbox.com/v4/mapbox.${style}/{z}/{x}/{y}.png?access_token=${token}`;
        },

        options: {
            minZoom: 4,
            noWrap: true,
            attribution: `<a href="http://www.mapbox.com/about/maps/" target="_blank">
                      Terms &amp; Feedback
                  </a>`
        }
    }

};

/**************************************/

var map,
    $map,
    tileLayers,
    activeTile,
    markersBaseLayer,
    doubleAgentCollection;


export function init() {
    $map = $('#map');
    $map.css({opacity:0});
    //initialize map
    map = L.map('map', settings.leaflet.options);
    var token = settings.mapbox.accessToken;
    var opts = settings.mapbox.options;
    tileLayers = {
        light: L.tileLayer(settings.mapbox.getUrl('light', token), opts),
        dark: L.tileLayer(settings.mapbox.getUrl('dark', token), opts)
    };

    activeTile = tileLayers[settings.mapbox.defaultStyle];

    activeTile.on('load', ()=> {
        $map.animate({
                opacity:1
            }, 800, 'easeInQuart', ()=> {
                this.activeTile.off('load'); //only trigger animations on initial load
            });
    });

    leaflet_init(map, activeTile);
}

export function leaflet_init(map, tile) {
    var {zoom, coords} = settings.leaflet.defaults;
    map
        .addLayer(tile)
        .setView(coords, zoom)
}

export function getData(url) {
    var doubleAgents = [];
    var request = $.getJSON(url, function( data ) { //TODO: handle reject
        $.each( data, (i, agent)=> {
            doubleAgents.push(new DoubleAgent(agent));
        });
    });
    request.done(()=> {
        doubleAgentCollection = new DoubleAgentCollection(doubleAgents);
        markersBaseLayer = L.layerGroup(doubleAgentCollection.markers);
        markersBaseLayer.addTo(map);
        $('div#loading i#waiting').remove();
        $('div#loading div#load-success')
            .fadeIn(400)
            .delay(400)
            .fadeOut(1000, 'easeOutQuart', function() {
                $(this).remove()
            });
    });
}

//accepts DoubleAgent or array of DoubleAgent
export function redrawMarker(doubleAgent, markerOpts = {}, iconOpts = {}) {
    var markers;
    removeAllMarkers();
    if($.isArray(doubleAgent)) {
        markers = [];
        doubleAgent.forEach( agent => {
            markers.push(agent.createMarker(markerOpts,iconOpts).marker);
        });
    }
    else {
        markers = doubleAgent.createMarker(markerOpts,iconOpts).marker;
    }
    drawMarkers(markers, markersBaseLayer);

    return markers
}

export function removeAllMarkers(exclude = []) { //array of markers
    markersBaseLayer.clearLayers();
    drawMarkers(exclude, markersBaseLayer);
}

export function drawMarkers(markers, layer) { //TODO split into two methods
    if($.isArray(markers)) {
        markers.forEach(marker => {
            layer.addLayer(marker)
        });
    }
    else {
        layer.allMarkersLayer.addLayer(markers);
    }
}

export function returnToOriginalView() {
    search.$input.val('');
    removeExistingSearchResults();
    redrawMarker(doubleAgentCollection.models);
    map.setZoom(settings.leaflet.defaults.zoom);
    search.$input.focus();
}


export function getMarkerByName(name) {
    var markers = doubleAgentCollection.markers;
    return $.grep(markers, (e)=> { return e.options.name == name; })[0];
}


export {settings, map, $map, tileLayers, activeTile,
    doubleAgentCollection, markersBaseLayer,}


