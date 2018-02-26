export class Demand {
    staffId: string;
    merchantId: string;
    name: string;
    startAddress: string;
    startPosition: string;
    endAddress: string;
    endPosition: string;
    startTime: string;
    endTime: string;
    remark: string;
    carNumber: string;
    freight: string;
    cargoType: string;
    constructor() {
    }
    setStaffId(staffId: string) {
        this.staffId = staffId;
        return this;
    }
    setMerchantId(merchantId: string) {
        this.merchantId = merchantId;
        return this;
    }
    setName(name: string) {
        this.name = name;
        return this;
    }
    setStartAddress(startAddress: string) {
        this.startAddress = startAddress;
        return this;
    }
    setStartPosition(startPosition: string) {
        this.startPosition = startPosition;
        return this;
    }
    setEndAddress(endAddress: string) {
        this.endAddress = endAddress;
        return this;
    }
    setEndPosition(endPosition: string) {
        this.endPosition = endPosition;
        return this;
    }
    setStartTime(startTime: string) {
        this.startTime = startTime;
        return this;
    }
    setEndTime(endTime: string) {
        this.endTime = endTime;
        return this;
    }
    setRemark(remark: string) {
        this.remark = remark;
        return this;
    }
    setCarNumber(carNumber: string) {
        this.carNumber = carNumber;
        return this;
    }
    setFreight(freight: string) {
        this.freight = freight;
        return this;
    }
    setCargoType(cargoType: string) {
        this.cargoType = cargoType;
        return this;
    }
}