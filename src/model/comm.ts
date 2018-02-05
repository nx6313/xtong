export class PageParams {
    cmd: string;
    params?: Array<any>;
    constructor(cmd, params?: Array<any>) {
        this.cmd = cmd;
        params ? this.params = params : {};
    }
}
export class CustomList {
    type?: string = '';
    lIcon?: string = '';
    lTxt: string = '';
    rTxt?: string = '';
    rIcon?: string = '';
    isDanger: boolean = false;
    isMenu: boolean = false;
    callBack?: Function = () => { };
    ngBind?: string = '';
    initVal?: any;
    isImg: boolean = false;
    constructor(lIcon?: string, lTxt: string = '', callBack?: Function) {
        lIcon ? this.lIcon = lIcon : {};
        this.lTxt = lTxt;
        callBack ? this.callBack = callBack : () => { };
    }
}
export class TabObj {
    id?: any;
    txt?: string;
    selected?: Boolean;
    constructor() {
    }
}