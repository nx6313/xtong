import { ScrollviewComponent } from "../components/scrollview/scrollview";
import { TaskListComponent } from "../components/task-list/task-list";

export class Remand {
    orderId: string = ''; // 订单Id
    orderNum: string = ''; // 订单编号
    orderTime: string = ''; // 订单时间
    orderNeedTime: string = ''; // 订单要求开始时间
    orderType: string = ''; // 订单类型
    clientPhone: string = ''; // 客户电话
    clientName: string = ''; // 客户姓名
    clientAddress: string = ''; // 客户地址
    orderStatus: number = 0; // 订单状态
    remark: string = ''; // 备注信息
    orderLat: string = '0'; // 订单地址 - 纬度
    orderLng: string = '0'; // 订单地址 - 经度
    constructor() {
    }
}

export class RemandDetail {
    address: string = '';
    addtime: string = '';
    closemoney: string = '';
    closetime: string = '';
    ftime: string = '';
    lat: string = '';
    lng: string = '';
    mark: string = '';
    mobile: string = '';
    msg: string = '';
    name: string = '';
    orderformid: string = '';
    ordersn: string = '';
    paitime: string = '';
    paitype: string = '';
    paystate: string = '';
    paytype: string = '';
    starttime: string = '';
    state: number = 0; // 订单状态
    stoptime: string = '';
    reference: string = '';
    type_id: string = '';
    type_price: string = '';
    typeorder: string = '';
    updatetime: string = '';
    waiterid: string = '';
    constructor() {
    }
}

export class RemandPageContainerItem {
    aboutScrollView: ScrollviewComponent;
    aboutTaskList: TaskListComponent;
    pageIndex?: number = 1;
    dataList?: Array<Remand> = [];
    constructor(aboutScrollView: ScrollviewComponent, aboutTaskList: TaskListComponent) {
        this.aboutScrollView = aboutScrollView;
        this.aboutTaskList = aboutTaskList;
    }
}

export class RemandPageContainer {
    tab_status_all?: RemandPageContainerItem;
    tab_status_empty?: RemandPageContainerItem;
    tab_status_full?: RemandPageContainerItem;
    tab_status_stop?: RemandPageContainerItem;
    tab_status_cancle?: RemandPageContainerItem;
    tab_status_doing?: RemandPageContainerItem;
    tab_status_nostart?: RemandPageContainerItem;
    tab_time_today?: RemandPageContainerItem;
    tab_time_tomorrow?: RemandPageContainerItem;
    tab_time_after_tomorrow?: RemandPageContainerItem;
    tab_time_nicety?: RemandPageContainerItem;
    constructor() {
    }
}