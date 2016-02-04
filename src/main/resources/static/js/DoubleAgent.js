import { buildMarker } from './Marker'


export default class {

    constructor({id, name, age, gender, latitude, longitude}) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.coordinates = [latitude,longitude];
        this.latitude = latitude;
        this.longitude = longitude;
        this.createMarker();
    }

    createMarker(markerOpts = {}, iconOpts = {}) {
        this.marker = buildMarker(this, markerOpts, iconOpts);
        return this
    }
}