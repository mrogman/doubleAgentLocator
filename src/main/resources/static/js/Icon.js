export default class {

    constructor(iconUrl, {iconSize = [50,50],
                iconAnchor = [25, 50],
                popupAnchor = [-3, -50]}) {

        this.iconUrl = iconUrl;
        this.iconSize = iconSize;
        this.iconAnchor = iconAnchor;
        this.popupAnchor = popupAnchor;

        return L.icon({
            iconUrl: iconUrl,
            iconSize: iconSize,
            iconAnchor: iconAnchor,
            popupAnchor: popupAnchor
        })
    }

}