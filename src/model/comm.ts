export class PageParams {
    cmd: string;
    params?: Array<any>;
    constructor(cmd, params?: Array<any>) {
        this.cmd = cmd;
        params ? this.params = params : {};
    }
}
export class CustomForm {
    type?: string = 'input'; // input、address、money、time、picker、textarea
    style?: string = '1';
    lIcon?: string = '';
    lTxt: string = '';
    rIcon?: string = '';
    placeholder?: string = '';
    request?: Boolean = false;
    callBack?: Function = null;
    ngBind: any = null;
    initVal?: any;
    roundLBtn?: string = '';
    txtLBtn?: string = '';
    lBtnCallBack?: Function = null;
    constructor(lTxt: string = '', ngBind: any, type?: string) {
        this.lTxt = lTxt;
        this.ngBind = ngBind;
        type ? this.type = type : {};
    }
    setAttr(attr: string, val: any) {
        this[attr] = val;
        return this;
    }
    isRequest() {
        this.request = true;
        return this;
    }
    setRIcon(rIcon) {
        this.rIcon = rIcon;
        return this;
    }
    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
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
    keyword?: string;
    selected?: Boolean;
    constructor() {
    }
}