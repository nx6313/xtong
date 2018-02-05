(function () {
    let that = this;
    let _EXPLOIT = false; // 是否为开发者模式

    function bindMarLog(bindElem) {
        $(bindElem).longPress(function () {
            that.MarLog.initShow();
        }, 14000);
    }

    let isSayingFlag = false;
    let canSayFlag = true;
    let canSayClearLogAgainFlag = true;
    let canClearLogFlag = true;
    let minPersonNeedClearLogContentFlag = false;
    let canSmoothFlag = true;
    let smoothTimeout = undefined;

    let canLogLocationFlag = false;

    let marlogImgIndex = 1;
    let colorParams = [
        ['#E9BF19', '#E9BF19', '#ECF6F5'],
        ['#E9BF19', '#E9BF19', '#4D4C49'],
        ['#33B1FE', '#33B1FE', '#4D4C49'],
        ['#E9BF19', '#E9BF19', '#4D4C49']
    ];

    function init() {
        if (!document.getElementById('marLogModule')) {
            marlogImgIndex = getRandomNum(1, colorParams.length);

            let marLogDrapElement = document.createElement('img');
            marLogDrapElement.id = 'marLogDragWrap';
            marLogDrapElement.src = 'assets/imgs/marlog_' + marlogImgIndex + '.gif';
            marLogDrapElement.draggable = false;
            marLogDrapElement.style.position = 'fixed';
            marLogDrapElement.style.display = 'none';
            marLogDrapElement.style.userSelect = 'none';
            marLogDrapElement.style.msUserSelect = 'none';
            marLogDrapElement.style.webkitUserSelect = 'none';
            marLogDrapElement.style.cursor = 'pointer';
            marLogDrapElement.style.height = '80px';
            marLogDrapElement.style.top = (document.documentElement.clientHeight - 80) + 'px';
            marLogDrapElement.style.right = '4px';
            marLogDrapElement.style.zIndex = 99999999;
            marLogDrapElement.onclick = function () {
                if (that.MarLog.logContentHasShow()) {
                    that.MarLog.cancelMinPersonClearLog();
                } else {
                    that.MarLog.show();
                }
            };
            document.body.appendChild(marLogDrapElement);
            var oW, oH;
            marLogDrapElement.addEventListener('touchstart', function (e) {
                if (document.getElementById('basePersonSayPop')) {
                    $(document.getElementById('basePersonSayPop')).fadeOut();
                }
                canSayFlag = false;
                var touches = e.touches[0];
                oW = touches.clientX - marLogDrapElement.offsetLeft;
                oH = touches.clientY - marLogDrapElement.offsetTop;
                document.addEventListener("touchmove", defaultEvent, false);
            }, false);
            marLogDrapElement.addEventListener('touchmove', function (e) {
                canSayFlag = false;
                var touches = e.touches[0];
                var oLeft = touches.clientX - oW;
                var oTop = touches.clientY - oH;
                if (oLeft < 0) {
                    oLeft = 0;
                } else if (oLeft > document.documentElement.clientWidth - marLogDrapElement.offsetWidth) {
                    oLeft = (document.documentElement.clientWidth - marLogDrapElement.offsetWidth);
                }
                if (oTop < 0) {
                    oTop = 0;
                } else if (oTop > document.documentElement.clientHeight - marLogDrapElement.offsetHeight) {
                    oTop = (document.documentElement.clientHeight - marLogDrapElement.offsetHeight);
                }
                marLogDrapElement.style.left = oLeft + "px";
                marLogDrapElement.style.top = oTop + "px";
            }, false);
            marLogDrapElement.addEventListener('touchend', function (e) {
                canSayFlag = true;
                document.removeEventListener("touchmove", defaultEvent, false);
            });
            // 开启小人说话气泡
            startBasePersonSay();

            let marLogElement = document.createElement('div');
            marLogElement.id = 'marLogModule';
            marLogElement.classList.add('banScreen');
            marLogElement.style.display = 'none';
            marLogElement.style.background = '#343B4C';
            marLogElement.style.color = '#EBF0F2';
            marLogElement.style.position = 'fixed';
            marLogElement.draggable = false;
            marLogElement.style.userSelect = 'none';
            marLogElement.style.msUserSelect = 'none';
            marLogElement.style.webkitUserSelect = 'none';
            marLogElement.style.cursor = 'pointer';
            marLogElement.style.left = '0px';
            marLogElement.style.right = '0px';
            marLogElement.style.bottom = '0px';
            marLogElement.style.zIndex = 9999999;
            marLogElement.style.opacity = '0.9';
            marLogElement.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, .2) inset';

            let marLogTitleElement = document.createElement('div');
            marLogTitleElement.classList.add('marLogTitleWrap');
            marLogTitleElement.style.borderBottom = '3px double #9C9C9C';
            marLogTitleElement.style.fontSize = '1.4rem';
            marLogTitleElement.style.boxShadow = '0px 0px 20px rgba(255, 255, 255, .2) inset';
            let marLogCloseElement = document.createElement('div');
            marLogCloseElement.style.display = 'inline-block';
            marLogCloseElement.style.width = '25%';
            marLogCloseElement.style.textAlign = 'center';
            marLogCloseElement.style.padding = '4px 0';
            marLogCloseElement.style.fontWeight = 'bold';
            marLogCloseElement.style.background = '#d33a31';
            marLogCloseElement.innerHTML = '关闭';
            marLogCloseElement.onclick = function () {
                that.MarLog.close();
            };
            marLogTitleElement.appendChild(marLogCloseElement);
            let marLogHideElement = document.createElement('div');
            marLogHideElement.style.display = 'inline-block';
            marLogHideElement.style.width = '25%';
            marLogHideElement.style.textAlign = 'center';
            marLogHideElement.style.padding = '4px 0';
            marLogHideElement.style.fontWeight = 'bold';
            marLogHideElement.innerHTML = '隐藏';
            marLogHideElement.onclick = function () {
                document.getElementById('marLogModule').style.display = 'none';
            };
            marLogTitleElement.appendChild(marLogHideElement);
            let marLogClearElement = document.createElement('div');
            marLogClearElement.style.display = 'inline-block';
            marLogClearElement.style.width = '25%';
            marLogClearElement.style.textAlign = 'center';
            marLogClearElement.style.padding = '4px 0';
            marLogClearElement.style.fontWeight = 'bold';
            marLogClearElement.innerHTML = '清空';
            marLogClearElement.onclick = function () {
                let logContentEle = document.getElementById('marLogModule').getElementsByClassName('marLogContentWrap')[0];
                $(logContentEle).animateCss('fadeOutDownBig').then(() => {
                    logContentEle.innerHTML = '';
                });
            };
            marLogTitleElement.appendChild(marLogClearElement);
            let marLogFullScreenElement = document.createElement('div');
            marLogFullScreenElement.style.display = 'inline-block';
            marLogFullScreenElement.style.width = '25%';
            marLogFullScreenElement.style.textAlign = 'center';
            marLogFullScreenElement.style.padding = '4px 0';
            marLogFullScreenElement.style.fontWeight = 'bold';
            marLogFullScreenElement.innerHTML = '全屏显示';
            marLogFullScreenElement.onclick = function () {
                that.MarLog.fullToggle(this);
            };
            marLogTitleElement.appendChild(marLogFullScreenElement);
            marLogElement.appendChild(marLogTitleElement);
            let canMoveLogContentTitleFlag = false;
            marLogTitleElement.addEventListener('touchstart', function (e) {
                setTimeout(function () {
                    canMoveLogContentTitleFlag = true;
                }, 600);
                document.addEventListener("touchmove", defaultEvent, false);
            }, false);
            marLogTitleElement.addEventListener('touchmove', function (e) {
                if (canMoveLogContentTitleFlag) {
                    let logPullScreenY = e.touches[0].clientY;
                }
            }, false);
            marLogTitleElement.addEventListener('touchend', function (e) {
                canMoveLogContentTitleFlag = false;
                logPullStartY = null;
                logPullMoveY = null;
                logDist = null;
                document.removeEventListener("touchmove", defaultEvent, false);
            });

            let marLogContentElement = document.createElement('div');
            marLogContentElement.classList.add('marLogContentWrap');
            marLogContentElement.style.position = 'relative';
            marLogContentElement.style.height = document.body.scrollHeight * 0.6 + 'px';
            marLogContentElement.style.overflowX = 'hidden';
            marLogContentElement.style.overflowY = 'auto';
            marLogContentElement.style.fontSize = '12px';
            marLogContentElement.style.paddingBottom = '4px';
            marLogElement.appendChild(marLogContentElement);
            marLogContentElement.addEventListener('touchstart', function (e) {
                canSmoothFlag = false;
                if (smoothTimeout) {
                    clearTimeout(smoothTimeout);
                }
                smoothTimeout = undefined;
            }, false);
            marLogContentElement.addEventListener('touchmove', function (e) {
                canSmoothFlag = false;
            }, false);
            marLogContentElement.addEventListener('touchend', function (e) {
                smoothTimeout = setTimeout(() => {
                    canSmoothFlag = true;
                }, 4000);
            });

            let marLogLocationElement = document.createElement('img');
            marLogLocationElement.src = 'assets/imgs/location.png';
            marLogLocationElement.style.position = 'absolute';
            marLogLocationElement.style.bottom = '14px';
            marLogLocationElement.style.right = '10px';
            marLogLocationElement.style.width = '40px';
            marLogLocationElement.classList.add('animated');
            marLogLocationElement.classList.add('infinite');
            marLogLocationElement.onclick = function () {
                if (this.classList.contains('rubberBand')) {
                    canLogLocationFlag = false;
                    this.classList.remove('rubberBand');
                } else {
                    canLogLocationFlag = true;
                    this.classList.add('rubberBand');
                }
            };
            marLogElement.appendChild(marLogLocationElement);

            document.body.appendChild(marLogElement);
        }
        if (_EXPLOIT) {
            that.MarLog.initShow();
        }
    }

    function initShow() {
        if (!document.getElementById('marLogModule')) {
            return false;
        }
        document.getElementById('marLogDragWrap').style.display = 'block';
        document.getElementById('marLogModule').style.display = 'none';

        marlogImgIndex = getRandomNum(1, colorParams.length);
        document.getElementById('marLogDragWrap').src = 'assets/imgs/marlog_' + marlogImgIndex + '.gif';
    }

    function show() {
        if (!document.getElementById('marLogModule')) {
            return false;
        }
        document.getElementById('marLogDragWrap').style.display = 'block';
        document.getElementById('marLogModule').style.display = 'block';
    }

    function close() {
        if (!document.getElementById('marLogModule')) {
            return false;
        }
        document.getElementById('marLogDragWrap').style.display = 'none';
        document.getElementById('marLogModule').style.display = 'none';
    }

    function fullToggle(clickThat) {
        if (!document.getElementById('marLogModule')) {
            return false;
        }
        if (document.getElementById('marLogModule').classList.contains('fullScreen')) {
            document.getElementById('marLogModule').classList.remove('fullScreen');
            document.getElementById('marLogModule').classList.add('banScreen');
            document.getElementById('marLogModule').style.opacity = '0.9';
            document.getElementById('marLogModule').getElementsByClassName('marLogContentWrap')[0].style.height = document.body.scrollHeight * 0.6 + 'px';
            clickThat.innerHTML = '全屏显示';
        } else {
            document.getElementById('marLogModule').classList.remove('banScreen');
            document.getElementById('marLogModule').classList.add('fullScreen');
            document.getElementById('marLogModule').style.borderRadius = '0px';
            document.getElementById('marLogModule').style.opacity = '1';
            document.getElementById('marLogModule').getElementsByClassName('marLogContentWrap')[0].style.height = (document.body.scrollHeight - document.getElementById('marLogModule').getElementsByClassName('marLogTitleWrap')[0].clientHeight - 2) + 'px';
            clickThat.innerHTML = '还原显示';
        }
    }

    function printLog(logContent, isError) {
        if (!document.getElementById('marLogModule')) {
            return false;
        }
        let marLogContentWrapElement = document.getElementById('marLogModule').getElementsByClassName('marLogContentWrap')[0];
        if (marLogContentWrapElement.childElementCount > 200) {
            if (that.MarLog.logContentHasShow()) {
                minPersonNeedClearLogContentFlag = true;
                if (!isSayingFlag && canSayClearLogAgainFlag) {
                    printMinPersonSay(true, '日志太多了，5 秒后我帮你清空了哦，需要取消的话，点击这里', 140, () => {
                        if (canClearLogFlag) {
                            canSayClearLogAgainFlag = false;
                            $(marLogContentWrapElement).animateCss('fadeOutDownBig').then(() => {
                                marLogContentWrapElement.innerHTML = '';
                                canSayClearLogAgainFlag = true;
                            });
                        }
                    });
                }
            } else {
                // marLogContentWrapElement.innerHTML = '';
            }
        }

        let logPrintContentElement = document.createElement('div');
        if (typeof isError === 'string') {
            try {
                let logContentJson = JSON.parse(logContent);
                if (!isError) {
                    if (logContent.length > 30) {
                        isError = logContent.substr(0, 30) + ' ...';
                    } else {
                        isError = logContent.substr(0, 30);
                    }
                }

                logPrintContentElement.classList.add('logErrorContentItem');
                logPrintContentElement.style.background = '#0A6E61';

                let logRootElem = document.createElement('div');
                logRootElem.classList.add('logRoot');
                logRootElem.classList.add('logClose');
                logRootElem.innerHTML = '<img style="width: 14px; vertical-align: top;" src="assets/imgs/arrows-close.png"/> ' + isError;
                logRootElem.onclick = function (event) {
                    let nextLogContent = showJsonContent(this, logContentJson, 0);
                    if (this.classList.contains('logOpen')) {
                        this.classList.remove('logOpen');
                        this.classList.add('logClose');
                        this.innerHTML = '<img style="width: 14px; vertical-align: top;" src="assets/imgs/arrows-close.png"/> ' + isError;
                    } else {
                        this.classList.remove('logClose');
                        this.classList.add('logOpen');
                        this.innerHTML = '<img style="width: 14px; vertical-align: top;" src="assets/imgs/arrows-open.png"/> ' + isError;
                        if (nextLogContent !== undefined) {
                            if (nextLogContent !== null) {
                                this.appendChild(nextLogContent);
                            } else {
                                let nextIsNullElem = document.createElement('div');
                                nextIsNullElem.innerHTML = ' ...';
                                this.appendChild(nextIsNullElem);
                            }
                        }
                    }
                    event.stopPropagation();
                };
                logPrintContentElement.appendChild(logRootElem);
            } catch (error) {
                logPrintContentElement.innerHTML = logContent;
            }
        } else {
            logPrintContentElement.innerHTML = logContent;
        }
        logPrintContentElement.style.borderBottom = '1px dotted #9C9C9C';
        logPrintContentElement.style.padding = '2px 4px';
        logPrintContentElement.style.display = 'none';
        if (isError === true) {
            logPrintContentElement.classList.add('logErrorContentItem');
            logPrintContentElement.style.background = '#F8C301';
            logPrintContentElement.style.color = '#C9180F';
        }
        marLogContentWrapElement.appendChild(logPrintContentElement);
        $(logPrintContentElement).fadeIn(function () {
            if (canSmoothFlag) {
                $(marLogContentWrapElement).stop().animate({
                    scrollTop: marLogContentWrapElement.scrollHeight + 800
                }, 800);
            } else {
                $(marLogContentWrapElement).stop()
            }
        });
    }

    function showJsonContent(rootElem, jsonObj, level) {
        let returnNextLogContent = undefined;
        if (rootElem.getElementsByClassName('log-' + level).length === 0) {
            returnNextLogContent = null;
            returnNextLogContent = document.createElement('div');
            returnNextLogContent.classList.add('log-' + level);
            returnNextLogContent.style.paddingLeft = '32px';
            returnNextLogContent.style.paddingRight = '2px';
            returnNextLogContent.style.paddingTop = '6px';
            returnNextLogContent.style.paddingBottom = '2px';
            returnNextLogContent.style.display = 'block';
            if (jsonObj.length !== undefined) { // 数组格式
                for (let j = 0; j < jsonObj.length; j++) {
                    let logContentItem = document.createElement('div');
                    if (jsonObj[j] !== null && typeof jsonObj[j] === 'object') {
                        logContentItem.innerHTML = '<img style="width: 14px; vertical-align: top;" src="assets/imgs/arrows-close.png"/> <strong style="color: #F8EF84;">' + j + ': </strong>' + JSON.stringify(jsonObj[j]).substr(0, 10) + ' ...';
                        logContentItem.classList.add('logClose');
                        logContentItem.onclick = function (event) {
                            let nextLogContent = showJsonContent(this, jsonObj[j], (level + 1));
                            if (this.classList.contains('logOpen')) {
                                this.classList.remove('logOpen');
                                this.classList.add('logClose');
                                this.innerHTML = '<img style="width: 14px; vertical-align: top;" src="assets/imgs/arrows-close.png"/> <strong style="color: #F8EF84;">' + j + ': </strong>' + JSON.stringify(jsonObj[j]).substr(0, 10) + ' ...';
                            } else {
                                this.classList.remove('logClose');
                                this.classList.add('logOpen');
                                this.innerHTML = '<img style="width: 14px; vertical-align: top;" src="assets/imgs/arrows-open.png"/> <strong style="color: #F8EF84;">' + j + ': </strong>' + JSON.stringify(jsonObj[j]).substr(0, 10) + ' ...';
                                if (nextLogContent !== undefined) {
                                    if (nextLogContent !== null) {
                                        this.appendChild(nextLogContent);
                                    } else {
                                        let nextIsNullElem = document.createElement('div');
                                        nextIsNullElem.innerHTML = ' ...';
                                        this.appendChild(nextIsNullElem);
                                    }
                                }
                            }
                            event.stopPropagation();
                        };
                    } else {
                        logContentItem.innerHTML = '<strong style="color: #F8EF84;">' + j + ': </strong>' + jsonObj[j];
                    }
                    logContentItem.style.borderTop = '1px dotted #9C9C9C';
                    logContentItem.style.paddingTop = '2px';
                    logContentItem.style.paddingBottom = '2px';
                    returnNextLogContent.appendChild(logContentItem);
                }
            } else { // json 对象
                for (let k in jsonObj) {
                    let logContentItem = document.createElement('div');
                    if (jsonObj[k] !== null && typeof jsonObj[k] === 'object') {
                        logContentItem.innerHTML = '<img style="width: 14px; vertical-align: top;" src="assets/imgs/arrows-close.png"/> <strong style="color: #F8EF84;">' + k + ': </strong>' + JSON.stringify(jsonObj[k]).substr(0, 10) + ' ...';
                        logContentItem.classList.add('logClose');
                        logContentItem.onclick = function (event) {
                            let nextLogContent = showJsonContent(this, jsonObj[k], (level + 1));
                            if (this.classList.contains('logOpen')) {
                                this.classList.remove('logOpen');
                                this.classList.add('logClose');
                                this.innerHTML = '<img style="width: 14px; vertical-align: top;" src="assets/imgs/arrows-close.png"/> <strong style="color: #F8EF84;">' + k + ': </strong>' + JSON.stringify(jsonObj[k]).substr(0, 10) + ' ...';
                            } else {
                                this.classList.remove('logClose');
                                this.classList.add('logOpen');
                                this.innerHTML = '<img style="width: 14px; vertical-align: top;" src="assets/imgs/arrows-open.png"/> <strong style="color: #F8EF84;">' + k + ': </strong>' + JSON.stringify(jsonObj[k]).substr(0, 10) + ' ...';
                                if (nextLogContent !== undefined) {
                                    if (nextLogContent !== null) {
                                        this.appendChild(nextLogContent);
                                    } else {
                                        let nextIsNullElem = document.createElement('div');
                                        nextIsNullElem.innerHTML = ' ...';
                                        this.appendChild(nextIsNullElem);
                                    }
                                }
                            }
                            event.stopPropagation();
                        };
                    } else {
                        logContentItem.innerHTML = '<strong style="color: #F8EF84;">' + k + ': </strong>' + jsonObj[k];
                    }
                    logContentItem.style.borderTop = '1px dotted #9C9C9C';
                    logContentItem.style.paddingTop = '2px';
                    logContentItem.style.paddingBottom = '2px';
                    returnNextLogContent.appendChild(logContentItem);
                }
            }
        } else {
            if (rootElem.getElementsByClassName('log-' + level)[0].style.display == 'none') {
                rootElem.getElementsByClassName('log-' + level)[0].style.display = 'block';
            } else {
                rootElem.getElementsByClassName('log-' + level)[0].style.display = 'none';
            }
        }
        return returnNextLogContent;
    }

    let basePersonSayHolderTime = 0;
    let preSayHolderTime = 0;
    let basePersonSayContent = '点击这里就能看到调试日志哦';

    function startBasePersonSay() {
        basePersonSayHolderTime = getRandomNum(10, 40);
        if (Math.abs(basePersonSayHolderTime - preSayHolderTime) < 10) {
            startBasePersonSay();
            return false;
        }
        preSayHolderTime = basePersonSayHolderTime;
        setTimeout(function () {
            if (!isSayingFlag) {
                printMinPersonSay(null);
            }
            startBasePersonSay();
        }, basePersonSayHolderTime * 1000);
    }

    function printMinPersonSay(whenLogFlag, sayContent, sayWrapWidth, callBack) {
        if (!((document.getElementById('marLogDragWrap').style.display === 'block' && document.getElementById('marLogModule').style.display !== 'block' && canSayFlag) ||
                (document.getElementById('marLogDragWrap').style.display === 'block' && whenLogFlag) ||
                (document.getElementById('marLogDragWrap').style.display === 'block' && typeof whenLogFlag === 'undefined'))) {
            return false;
        }
        let basePersonOffSetRight = document.body.clientWidth - document.getElementById('marLogDragWrap').offsetLeft - 28;
        let basePersonOffSetTop = document.getElementById('marLogDragWrap').offsetTop + 10;
        let sayWrapPopWidth = 90;
        if (sayWrapWidth) {
            sayWrapPopWidth = sayWrapWidth;
        }
        isSayingFlag = true;
        let sayElement = document.createElement('div');
        sayElement.id = 'basePersonSayPop';
        sayElement.style.position = 'fixed';
        sayElement.style.textAlign = 'center';
        sayElement.style.display = 'none';
        sayElement.style.userSelect = 'none';
        sayElement.style.msUserSelect = 'none';
        sayElement.style.webkitUserSelect = 'none';
        sayElement.style.cursor = 'pointer';
        sayElement.style.width = sayWrapPopWidth + 'px';
        sayElement.style.padding = '4px 6px';
        sayElement.style.borderRadius = '6px';
        sayElement.style.boxShadow = '2px 2px 20px rgba(200, 238, 233, .8) inset';
        sayElement.style.background = colorParams[marlogImgIndex - 1][0];
        sayElement.style.top = basePersonOffSetTop + 'px';
        if ((basePersonOffSetRight + sayWrapPopWidth) < document.body.clientWidth) {
            sayElement.style.right = basePersonOffSetRight + 'px';
        } else {
            sayElement.style.right = (basePersonOffSetRight - sayWrapPopWidth - 60) + 'px';
        }
        sayElement.style.zIndex = 999999999;
        let sayArrowElement = document.createElement('div');
        sayArrowElement.style.position = 'absolute';
        sayArrowElement.style.display = 'none';
        sayArrowElement.style.top = '14px';
        sayArrowElement.style.width = '0';
        sayArrowElement.style.height = '0';
        sayArrowElement.style.fontSize = '0';
        sayArrowElement.style.border = 'solid 6px';
        if ((basePersonOffSetRight + sayWrapPopWidth) < document.body.clientWidth) {
            sayArrowElement.style.borderColor = 'rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) ' + colorParams[marlogImgIndex - 1][1];
            sayArrowElement.style.right = '-12px';
        } else {
            sayArrowElement.style.borderColor = 'rgba(0, 0, 0, 0) ' + colorParams[marlogImgIndex - 1][1] + ' rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)';
            sayArrowElement.style.left = '-12px';
        }
        sayArrowElement.style.boxShadow = '2px 2px 20px rgba(211, 247, 242, .8) inset';
        sayElement.appendChild(sayArrowElement);
        document.body.appendChild(sayElement);
        sayElement.onclick = function () {
            if (that.MarLog.logContentHasShow()) {
                that.MarLog.cancelMinPersonClearLog();
            } else {
                that.MarLog.show();
            }
        };
        setTimeout(function () {
            $(sayArrowElement).fadeIn();
        }, 2800);
        $(sayElement).fadeIn(function () {
            startPrintSayWord(sayElement, sayContent, callBack);
        });
    }

    let chatIndex = 0;
    let minPersonSayPopCloseTimer = undefined;
    let minPersonSayPopAfterWordTimer = undefined;

    function startPrintSayWord(sayElement, sayContent, callBack) {
        let minPersonSayContent = basePersonSayContent;
        if (sayContent) {
            minPersonSayContent = sayContent;
        }
        let sayWord = minPersonSayContent.charAt(chatIndex);
        let sayWordElement = document.createElement('span');
        sayWordElement.style.display = 'none';
        sayWordElement.style.fontSize = '12px';
        sayWordElement.style.color = colorParams[marlogImgIndex - 1][2];
        //sayWordElement.style.textShadow = '0 0 4px #CEF6F2';
        sayWordElement.style.fontFamily = 'Yujian, "Roboto", "Helvetica Neue", sans-serif';
        sayWordElement.innerText = sayWord;
        sayElement.appendChild(sayWordElement);
        $(sayWordElement).fadeIn();
        if (chatIndex >= minPersonSayContent.length - 1) {
            chatIndex = 0;
            minPersonSayPopCloseTimer = setTimeout(function () {
                $(sayElement).fadeOut(function () {
                    try {
                        document.body.removeChild(sayElement);
                    } catch (error) {}
                    isSayingFlag = false;
                    if (callBack && typeof callBack === 'function') {
                        callBack();
                    }
                });
            }, 4800);
        } else {
            minPersonSayPopAfterWordTimer = setTimeout(function () {
                chatIndex++;
                startPrintSayWord(sayElement, sayContent, callBack);
            }, 200);
        }
    }

    function logContentHasShow() {
        if (document.getElementById('marLogModule').style.display !== 'block') {
            return false;
        }
        return true;
    }

    function cancelMinPersonClearLog() {
        if (minPersonNeedClearLogContentFlag) {
            canClearLogFlag = false;
            canSayClearLogAgainFlag = false;
            minPersonNeedClearLogContentFlag = false;
            minPersonStopTalk(() => {
                printMinPersonSay(true, '好吧，那我先不清理呢 ❧');
            });
            setTimeout(() => {
                canSayClearLogAgainFlag = true;
                canClearLogFlag = true;
            }, 40000);
        }
    }

    function minPersonStopTalk(callBack) {
        chatIndex = 0;
        if (minPersonSayPopCloseTimer) {
            clearTimeout(minPersonSayPopCloseTimer);
            minPersonSayPopCloseTimer = undefined;
        }
        if (minPersonSayPopAfterWordTimer) {
            clearTimeout(minPersonSayPopAfterWordTimer);
            minPersonSayPopAfterWordTimer = undefined;
        }
        let minPersonSayElement = document.getElementById('basePersonSayPop');
        if (minPersonSayElement) {
            $(minPersonSayElement).fadeOut(function () {
                try {
                    document.body.removeChild(minPersonSayElement);
                } catch (error) {}
                if (callBack && typeof callBack === 'function') {
                    callBack();
                }
            });
        } else {
            if (callBack && typeof callBack === 'function') {
                callBack();
            }
        }
    }

    function getLocationLogFlag() {
        return canLogLocationFlag;
    }

    window.MarLog = {
        bind: bindMarLog,
        init: init,
        initShow: initShow,
        show: show,
        close: close,
        fullToggle: fullToggle,
        printLog: printLog,
        logContentHasShow: logContentHasShow,
        cancelMinPersonClearLog: cancelMinPersonClearLog,
        minPersonStopTalk: minPersonStopTalk,
        printMinPersonSay: printMinPersonSay,
        getLocationLogFlag: getLocationLogFlag
    };
})();

$.fn.longPress = function (fn, holdTime) {
    var timeout = undefined;
    var downTimeout = undefined;
    var downInterval = undefined;
    var $this = this;
    for (var i = 0; i < $this.length; i++) {
        if (!$this[i]) {
            return false;
        }
        $this[i].addEventListener('touchstart', function (event) {
            if (document.getElementById('marLogDragWrap').style.display === 'block') {
                return false;
            }
            timeout = setTimeout(function () {
                fn();
                hideLonePressTip();
                clearInterval(downInterval);
            }, holdTime);
            downTimeout = setTimeout(function () {
                downInterval = setInterval(function () {
                    showLonePressTip();
                }, 1000);
            }, (holdTime - 5 * 1000));
        }, false);
        $this[i].addEventListener('touchend', function (event) {
            clearTimeout(timeout);
            clearTimeout(downTimeout);
            hideLonePressTip();
            clearInterval(downInterval);
            if ($this[i]) {
                $this[i].removeEventListener('touchstart', defaultEvent, false);
            }
        }, false);
    }
}

var _laterTime = 4;

function showLonePressTip() {
    if (!document.getElementById('longPressTipWrap')) {
        var longPressTipWrap = document.createElement('div');
        longPressTipWrap.id = 'longPressTipWrap';
        longPressTipWrap.style.position = 'absolute';
        longPressTipWrap.style.bottom = '40px';
        longPressTipWrap.style.zIndex = '9999999999999999999';
        longPressTipWrap.style.width = '100%';
        longPressTipWrap.style.textAlign = 'center';
        longPressTipWrap.classList.add('animated');
        longPressTipWrap.classList.add('rollIn');

        var longPressTipSpan = document.createElement('span');
        longPressTipSpan.style.padding = '6px 8px';
        longPressTipSpan.style.background = '#2B313F';
        longPressTipSpan.style.color = '#F5F5F5';
        longPressTipSpan.style.fontSize = '12px';
        longPressTipSpan.style.fontWeight = 'bold';
        longPressTipSpan.style.borderRadius = '3px';
        longPressTipSpan.style.boxShadow = '0 0 4px rgba(81, 81, 81, .2)';
        longPressTipWrap.appendChild(longPressTipSpan);

        document.body.appendChild(longPressTipWrap);
    }
    document.getElementById('longPressTipWrap').getElementsByTagName('span')[0].innerHTML = `将在 ${_laterTime} 秒后显示调试器`;
    _laterTime--;
}

function hideLonePressTip() {
    if (document.getElementById('longPressTipWrap')) {
        $(document.getElementById('longPressTipWrap')).animateCss('rollOut', true);
        _laterTime = 4;
    }
}

function getRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

function defaultEvent(e) {
    e.preventDefault();
}

/**
 * 扩展 JQuery 添加动画属性方法
 */
$.fn.extend({
    animateCss: function (animationName, removeFlag) {
        let that = this;
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        let animationEndPromise = new Promise(function (resolve) {
            that.addClass('animated ' + animationName).one(animationEnd, function () {
                resolve('移出属性动画执行完毕');
                $(that).removeClass('animated ' + animationName);
                if (removeFlag) {
                    $(that).remove();
                }
            });
        });
        return animationEndPromise;
    }
});