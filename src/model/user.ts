export class UserInfo {
    staffId: string = '';
    userName: string = '';
    phone: string = '';
    merchantId: string = '';
    constructor(staffId?: string) {
        staffId ? this.staffId = staffId : {};
    }
}