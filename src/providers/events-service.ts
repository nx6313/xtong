import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

@Injectable()
export class EventsService {
  eventsSubscribeList: Array<string> = new Array<string>();

  constructor(public events: Events) {

  }

  subscribe(topic: string, ...handlers: Function[]) {
    if (this.eventsSubscribeList.indexOf(topic) < 0) {
      this.eventsSubscribeList.push(topic);
      this.events.subscribe(topic, ...handlers);
    }
  }

  unsubscribe(topic: string, handler?: Function) {
    let index = this.eventsSubscribeList.indexOf(topic);
    if (index != -1) {
      this.eventsSubscribeList.splice(this.eventsSubscribeList.indexOf(topic), 1);
      this.events.unsubscribe(topic);
    }
  }

}
