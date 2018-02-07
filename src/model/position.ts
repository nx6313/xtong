export class SelectMarkerAddress {
    adcode?: string;
    address?: string;
    adname?: string;
    citycode?: string;
    cityname?: string;
    email?: string;
    entr_location?: Location;
    location?: Location;
    name?: string;
    pcode?: string;
    pname?: string;
    postcode?: string;
    shopinfo?: string;
    tel?: string;
    type?: string;
    website?: string;
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