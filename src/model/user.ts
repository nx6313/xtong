export class UserInfo {
    staffId: string = '';
    userName: string = '';
    phone: string = '';
    merchant: Merchant = new Merchant();
    constructor(staffId?: string) {
        staffId ? this.staffId = staffId : {};
    }
}

export class Merchant {
    merchantId: string = '';
    companyName: string = '';
    createTime?: Date;
    constructor(merchantId?: string) {
        merchantId ? this.merchantId = merchantId : {};
    }
}