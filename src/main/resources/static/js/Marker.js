import { settings, map, doubleAgentCollection, markersBaseLayer, getMarkerByName } from './Map'
import Icon from './Icon'
import { search, focusedName, closeSearchResults } from './header'

//extend Marker class to provide custom options
var DAMarker = L.Marker.extend({
    options: {
        name: undefined,
        age: undefined,
        gender: undefined
    }
});

export function buildMarker(doubleAgent, markerOpts = {}, iconOpts = {}) {
    var markerSettings = settings.leaflet.defaults.markers,
        options = {
            name: doubleAgent.name,
            age: doubleAgent.age,
            gender: doubleAgent.gender,
            icon: getIcon(doubleAgent.gender, iconOpts),
            opacity: markerOpts.opacity || markerSettings.opacity
        };
    var marker = new DAMarker(doubleAgent.coordinates, options);
    markerBind(marker, doubleAgent);
    return marker
}

export function getIcon(gender, iconOpts) {
    var imageUrl = settings.leaflet.defaults.icons.imageUrl;
    if(gender === 'Male')
        return new Icon(imageUrl.male, iconOpts);
    else if(gender === 'Female')
        return new Icon(imageUrl.female, iconOpts);
}
export function markerBind(marker, doubleAgent) {
    marker
        .bindPopup(`<b>${doubleAgent.name}</b><br>
                        <!--{getReverseGeocode(marker)}-->
                        Age: ${doubleAgent.age}<br>
                        Gender: ${doubleAgent.gender}`)
        .on('click', (e)=> {
            markerFocus(e.target,
            settings.leaflet.defaults.panOptions,
            settings.leaflet.defaults.markers.click.zoom)
        });
}

export function getReverseGeocode(marker) {
    var geocodeService = L.esri.Geocoding.geocodeService(); //TODO L.esri is undefined

    var str = '';
    geocodeService.reverse().latlng(marker._latlng).run(function(error, result) {
        if(error) str = '';
        else if(result) str = result + "<br>";
    });
    return str
}


export function markerFocus(e, panOpts, zoom = 1, panOffset = undefined) {
    e.openPopup();
    map.panTo(e._latlng, panOpts);
    if(panOffset)
        map.panBy(L.point(panOffset[0], panOffset[1]));
    setTimeout(()=> {
        if(zoom > 0) //do not call zoomIn if set to 0
            map.zoomIn(zoom);
    }, 400);
}

export function drillDown() {
    search.$input.val('');
    var name = focusedName();
    var marker = getMarkerByName(name);
    closeSearchResults();
    markerFocus(marker, settings.leaflet.defaults.panOptions, 5);
    search.$input.focus();
    marker.openPopup(); //TODO fix, not opening
}