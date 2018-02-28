export class PageParams {
    cmd: string;
    params?: Array<any>;
    constructor(cmd, params?: Array<any>) {
        this.cmd = cmd;
        params ? this.params = params : {};
    }
}
export class Result {
    result?: number;
    content?: any;
    msg?: string;
    error?: {};
    constructor() {
    }
}
export class CustomForm {
    type?: string = 'input'; // input、address、number、money、time、picker、textarea
    style?: string = '1';
    lIcon?: string = '';
    lTxt: string = '';
    rIcon?: string = '';
    placeholder?: string = '';
    request?: Boolean = false;
    callBack?: Function = null;
    ngBind: any = null;
    ngRealValBind: any = null;
    initVal?: any;
    roundLBtn?: string = '';
    txtLBtn?: string = '';
    lBtnCallBack?: Function = null;
    pickerCols?: Array<PickerItem>;
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
    setNgRealValBind(ngRealValBind) {
        this.ngRealValBind = ngRealValBind;
        return this;
    }
    setPickerCols(pickerCols) {
        this.pickerCols = pickerCols;
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
export class PickerItem {
    textAlign?: string;
    values?: Array<string>;
    displayValues?: Array<string>;
    constructor(values: Array<string>) {
        this.values = values;
    }
    setTextAlign(textAlign: string) {
        this.textAlign = textAlign;
        return this;
    }
    setDisplayValues(displayValues: Array<string>) {
        this.displayValues = displayValues;
        return this;
    }
}