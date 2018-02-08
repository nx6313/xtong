export class SelectMarkerAddress {
    adcode?: string;
    address?: string;
    adname?: string;
    citycode?: string;
    cityname?: string;
    email?: string;
    entr_location?: Location;
    exit_location?: Location;
    location?: Location;
    name?: string;
    pcode?: string;
    pname?: string;
    postcode?: string;
    shopinfo?: string;
    tel?: string;
    type?: string;
    website?: string;
    constructor(name?: string, location?: Location) {
        name ? this.name = name : {};
        location ? this.location = location : {};
    }
}

export class Location {
    L?: number;
    N?: number;
    lat?: number;
    lng?: number;
    constructor() {
    }
}