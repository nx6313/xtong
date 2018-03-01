import { ScrollviewComponent } from "../components/scrollview/scrollview";
import { TaskListComponent } from "../components/task-list/task-list";
import { Location } from "./position";
import { Merchant } from "./user";

export class Remand {
    demandId: number;
    demandStatus: number;
    carNumber: number;
    cargoType: number;
    startAddress: string;
    startPosition: Location;
    startTime: Date;
    endAddress: string;
    endPosition: Location;
    endTime: Date;
    freight: number;
    merchant: Merchant;
    name: string;
    driverNumber: number = 0;
    remark?: string;
    // 计算属性
    orderDistance?: number = 0; // 订单距离公里数
    userDistance?: number = 0; // 用户当前距离任务开始地点公里数
    constructor() {
    }
}

export class RemandPageContainerItem {
    aboutScrollView: ScrollviewComponent;
    aboutTaskList: TaskListComponent;
    pageIndex?: number = 1;
    dataMapByDate?: Map<string, Array<Remand>> = new Map<string, Array<Remand>>(); // 根据时间获取的数据字典
    dataIdArr?: Array<number> = []; // 数据Id数组，用于判断是否有新数据产生
    constructor(aboutScrollView: ScrollviewComponent, aboutTaskList: TaskListComponent) {
        this.aboutScrollView = aboutScrollView;
        this.aboutTaskList = aboutTaskList;
    }
    /**
     * 将 remand 数据，按照指定的时间数据，以同一天的数据为组存放到 map 中；并会将数据的 id 保存到 dataIdArr
     * @param remand 存放的 remand 数据
     * @param judgeKey 用于判断的时间值
     */
    addRemandToDateMap(remand: Remand, judgeKey: string) {
        if (this.dataMapByDate.has(judgeKey)) {
            this.dataMapByDate.get(judgeKey).push(remand);
        } else {
            let newRemandArr = new Array<Remand>();
            newRemandArr.push(remand);
            this.dataMapByDate.set(judgeKey, newRemandArr);
        }
        this.dataIdArr.push(remand.demandId);
    }
}

export class RemandPageContainer {
    tab_status_all?: RemandPageContainerItem;
    tab_status_nostart?: RemandPageContainerItem;
    tab_status_doing?: RemandPageContainerItem;
    tab_status_stop?: RemandPageContainerItem;
    tab_status_cancle?: RemandPageContainerItem;
    constructor() {
    }
}