import Fuse from '../vendor/js/fuse.js'
import * as DAMap from './Map'
import * as Marker from './Marker'

var currentInput;

var $header,
    $headerInner,
    search,
    filter;

//name of currently focused search result
export function focusedName() {
    return search.results.$children.filter(':focus').text();
};

export function init() {
    $header = $('div.header');
    $headerInner = $('.header-inner');
    $header.css({ top: -($header.height()) });
    showHeader(800, 1500);
    initSearch();
    initFilterControls();
}


function showHeader(duration, delay = 0) {
    $header
        .delay(delay)
        .animate({
            top: '0'
        }, duration, 'easeOutQuint');
}

function initSearch() {
    search = {
        $container: $headerInner.children('div.search'),
        $input: $('input#search-ui'),
        $icon: $('div.search i'),
        results: {
            $children: undefined //assigned dynamically
        }
    };

    search.$input.left = search.$container.offset().left;

    search.$input.on({
        keyup: (e)=> {
            var alphaNum = new RegExp("^[a-zA-Z0-9]+$");
            var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            if (alphaNum.test(str)) {
                //only perform if key is alphanumeric
                if(search.timeout !== undefined) clearTimeout(search.timeout);
                search.timeout = setTimeout(()=> {
                    currentInput = $(e.target).val();
                    var matches = searchNames();
                    var matchingMarkers = [];
                    showSearchResults(matches);
                    matches.forEach( agent => {
                        matchingMarkers.push(DAMap.getMarkerByName(agent))
                    });
                    DAMap.removeAllMarkers(matchingMarkers);
                }, 400);
            }
            else if(e.which == 27) { //esc
                closeSearchResults();
            }
        }
    });

    search.$icon.on('click', ()=> { alert('search on this view size not supported yet :(') });
}

function initFilterControls() {
    filter = {
        $container: $headerInner.children('div.filter'),
        $modalOverlay: undefined,
        controls: {
            $container: $('div#filter-controls'),
            $ageSlider: $('div#fc-age-range'),
            $ageValues: undefined,
            $genderRadio: $('div#fc-gender').find(':radio')
        },
        state: {
            gender: undefined, //"Male", "Female", "Both"
            ageRange: undefined //[min, max]
        }
    };

    filter.controls.$container.hide();
    filter.controls.$ageValues = filter.controls.$ageSlider.parent().find('span.age-label.value');

    var timer;
    filter.controls.$ageSlider.slider({
        range: true,
        min: 0,
        max: 120,
        values: [0, 100],
        slide: function (event, ui) {
            var min = ui.values[0],
                max = ui.values[1];
            filter.controls.$ageValues.filter('#min').text(min);
            filter.controls.$ageValues.filter('#max').text(max);

            if(timer) clearTimeout(timer);
            timer = setTimeout(()=> {
                filter.state.ageRange = [min, max];
                runFilter();
            }, 400);
        }
    });

    //initialize slider values
    var minVal = filter.controls.$ageSlider.slider("values", 0);
    var maxVal = filter.controls.$ageSlider.slider("values", 1);
    $(filter.controls.$ageValues[0]).text(minVal);
    $(filter.controls.$ageValues[1]).text(maxVal);
    filter.state.ageRange = [minVal, maxVal];

    filter.$container.not(filter.controls.$container).on({
        click: ()=> {
            showFilterControls();
        }
    });

    filter.controls.$genderRadio.change(()=> {
        var selected = filter.controls.$genderRadio.filter(':checked');
        filter.state.gender = selected.val();
        runFilter();
    })
}

function showFilterControls() {
    filter.controls.$container.fadeIn('fast');
    openModalOverlay();
    window.$modalOverlay
        .add(search.$input)
        .on('click', hideFilterControls);
}

function hideFilterControls() {
    filter.controls.$container.fadeOut('fast', function() { $(this).hide() });
    removeModalOverlay();
}

function runFilter() {
    var ageRange = filter.state.ageRange,
        gender = filter.state.gender,
        matches = DAMap.doubleAgentCollection.filterByAgeAndGender(ageRange, gender);
    DAMap.redrawMarker(matches)
}

function openModalOverlay() {
    if(window.$modalOverlay === undefined) {
        $('body').append("<div id='modal-overlay'></div>");
    }
    window.$modalOverlay = $('#modal-overlay');
}

function removeModalOverlay() {
    window.$modalOverlay.remove();
    window.$modalOverlay = undefined;
}

function searchNames() {
    var names = DAMap.doubleAgentCollection.names,
        matches = [],
        result = new Fuse(names).search(currentInput);

    result.forEach(matchIndex => {
        matches.push(names[matchIndex]);
    });

    return matches.slice(0, 7);
}

export function showSearchResults(matches) {
    removeExistingSearchResults();
    search.$container.append("<ul id='search-results'></ul>");
    search.results.$container = $('ul#search-results');
    matches.forEach((name, i)=> {
        search.results.$container.append(`<li tabindex='${i + 2}'>${name}</li>`)
    });
    initSearchResultBox();
    openModalOverlay();
    window.$modalOverlay.on('click', closeSearchResults);
}

export function closeSearchResults() {
    DAMap.returnToOriginalView();
    removeModalOverlay();
}

export function removeExistingSearchResults() {
    if(search.results.$container !== undefined) search.results.$container.remove();
}

function initSearchResultBox() {
    search.results.$children = search.results.$container.children('li');
    search.results.$children.on({
        keydown: (e)=> {
            if(e.which == 13) { //enter
                Marker.drillDown();
            }
            else if(e.which == 27) { //esc
                closeSearchResults()
            }
            else if(e.which != 9 && e.which != 16) { //ignore tab and shift
                search.$input.focus();
            }
        },
        focus: ()=> {
            var name = focusedName();
            var marker = DAMap.getMarkerByName(name);
            Marker.markerFocus(marker,
                DAMap.settings.leaflet.defaults.panOptions,
                0,
                DAMap.settings.leaflet.defaults.searchPanOffset);
        },
        mouseenter: (e)=> {
            $(e.target).trigger('focus');
        },
        click: ()=> {
            Marker.drillDown();
        }
    });
    var firstResult = search.results.$children[1];
    var lastResult = search.results.$children[search.results.$children.length - 1];
    $(lastResult).on({
        keydown: (e)=> {
            if(e.which == 9) search.$input.focus();
        }
    })
}

export { $header, $headerInner, search, filter}


