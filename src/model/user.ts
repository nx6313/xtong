export class UserInfo {
    userId: string = '';
    userPhone: string = '';
    workType: string = '';
    avatar: string = '';
    nickName: string = '';
    cutmoney: string = ''; // 提成金额
    getmoney: string = ''; // 已结金额
    allmoney: string = '- -';
    yestermoney: string = '- -';
    todaymoney: string = '- -';
    constructor(userId?: string) {
        userId ? this.userId = userId : {};
    }
}