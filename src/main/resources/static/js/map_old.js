import Icon from 'Icon'

//TODO: Remove -- ES5 style

//Map module
(()=> {

    var Map = {

        //Set leaflet and mapbox options here

        leaflet: {
            options: {
                keyboardPanOffset: 350
            }
        },

        mapbox: {
            defaultStyle: 'dark', //use this to set default tile layer
            accessToken: 'pk.eyJ1IjoibXJvZ21hbiIsImEiOiJjaWsxczUyeTQzYWd5dm9raTBkanozczlxIn0.-jgr6Bgk4YRJVkKM_pJTUg',
            getUrl: (style)=> {
                return `https://api.mapbox.com/v4/
                mapbox.${style}/{z}/{x}/{y}.png?
                access_token=${L.mapbox.accessToken}`;
            },
            options: {
                minZoom: 4,
                noWrap: true,
                attribution: `<a href="http://www.mapbox.com/about/maps/" target="_blank">
                                  Terms &amp; Feedback
                              </a>`
            }
        },

        init: ()=> {
            this.$map = $('#map');
            //initialize map
            this.map = L.map('map', Map.leaflet.options);
            this.tileLayers = {
                light: L.tileLayer(Map.mapbox.getUrl('light'), Map.mapbox.options),
                dark: L.tileLayer(Map.mapbox.getUrl('dark'), Map.mapbox.options)
            };

            this.map
                .setMaxBounds([
                    [84.67351256610522, -174.0234375],
                    [-84.67351256610522, 174.0234375]
                ])
                .addLayer(this.tileLayers.dark)
                //.addLayer(this.tileLayers.light)
                .setView([39.953876,-95.28392], 4);
        },

        icon: {
            male: new Icon('/img/agent_f_75.png'),
            female: new Icon('/img/agent_f_75.png')
        },

    };

    module.exports = Map
})();