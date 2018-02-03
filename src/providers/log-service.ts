import { Injectable, ErrorHandler } from '@angular/core';
import { Platform } from 'ionic-angular';

import { EventsService } from '../providers/events-service';

declare var MarLog;

@Injectable()
export class LogService implements ErrorHandler {
    constructor(private platform: Platform,
        private eventsService: EventsService) { }

    handleError(err: any): void {
        this.eventsService.events.publish('SYS:ERROR', err);
    }

    log(color?: string, ...logs) {
        let logColor = '';
        let logBgColor = '';
        let logJSONSet = '';
        if (color.indexOf('HUE[') == 0 && color.indexOf(']') == color.length - 1) {
            let logHueSet = color.substring(4, color.length - 1).split(',');
            logColor = logHueSet[0].trim();
            if (logHueSet.length > 1) {
                logBgColor = logHueSet[1].trim();
            }
        } else if (color.indexOf('JSON[') == 0 && color.indexOf(']') == color.length - 1) {
            logJSONSet = color.substring(5, color.length - 1).trim();
        } else {
            logs.unshift(color);
        }
        let logIndex = 0;
        for (let item of logs) {
            logIndex++;
            if (logs.length > 1 && logIndex == 1) {
                this.printLogHeaderFooter('header', logColor, logBgColor);
            }
            if (logColor && typeof item !== 'object') {
                if (logBgColor) {
                    console.log('%c%s', 'color: ' + logColor + '; background: ' + logBgColor + ';', '\t\t' + item);
                } else {
                    console.log('%c%s', 'color: ' + logColor + ';', '\t\t' + item);
                }
            } else {
                console.log(item);
            }
            if (logs.length > 1 && logIndex == logs.length) {
                this.printLogHeaderFooter('footer', logColor, logBgColor);
            }
            if (typeof item !== 'object') {
                MarLog.printLog(item);
            } else {
                try {
                    MarLog.printLog(JSON.stringify(item), logJSONSet);
                } catch (error) {
                    MarLog.printLog(item);
                }
            }
        }
    }

    private printLogHeaderFooter(type, logColor?: string, logBgColor?: string) {
        let curTime = '';
        if (type === 'header') {
            curTime = ' [ ' + (new Date().getFullYear() + ' ' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + '::' + new Date().getMilliseconds()) + ' ] ';
        } else {
            curTime = '*****************************';
        }
        if (logColor) {
            if (logBgColor) {
                console.log('%c%s', 'color: ' + logColor + '; background: ' + logBgColor + ';', '****' + curTime + '****');
            } else {
                console.log('%c%s', 'color: ' + logColor + ';', '****' + curTime + '****');
            }
        } else {
            console.log('****' + curTime + '****');
        }
    }

}