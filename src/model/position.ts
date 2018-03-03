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

export class SDKLocation {
    locationType?: number;
    latitude?: number;
    longitude?: number;
    address?: string;
    country?: string;
    province?: string;
    city?: string;
    district?: string;
    street?: string;
    streetNum?: string;
    cityCode?: string;
    adCode?: string;
    aoiName?: string;
    buildingId?: string;
    floor?: string;
    gpsStatus?: number;
    time?: number;
    speed?: number;
    constructor() {
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