var Picker = (function () {
  let that = this;
  var _SETTINGS = {};
  var _defaults = {
    headLeftBtnTxt: '取消',
    headRightBtnTxt: '确定',
    normalColor: '#292929',
    headLeftBtnColor: '#CACACA',
    headRightBtnColor: '#C74B07',
    shadeClose: true,
    cancelFn: function () {},
    confirmFn: function () {},
    onChangeFn: function () {},
    title: 'Picker标题',
    clos: [], // [ { textAlign: 'center', values: [ '', '', ... ], displayValues: [ '', '', ... ] } ]
    pickerItemHeight: 36,
    pickerHighlightRadio: 0.5,
    pickerHighlightOffsetTop: -6,
    pickerItemRate: 0.7,
    pickerItemMaxsScaleAdd: 0.6
  };

  var pickerItemChangeAudio = null;
  var transformToRange = [];

  var supportsPassive = false;

  try {
    window.addEventListener('test', null, {
      get passive() {
        supportsPassive = true;
      },
    });
  } catch (e) {
    // do nothing
  }

  var pickerInstance = {
    show: function () {
      var pickerSelect = document.getElementById('pickerSelectWrap');
      if (pickerSelect) {
        var pickerShadePane = document.getElementById('pickerShadePane');
        $(pickerShadePane).show();
        $(pickerShadePane).animateCss('fadeIn');
        $(pickerSelect).animate({
          bottom: 0
        }, 300, 'swing');
      }
    },
    hide: function () {
      var pickerSelect = document.getElementById('pickerSelectWrap');
      if (pickerSelect) {
        var pickerShadePane = document.getElementById('pickerShadePane');
        $(pickerShadePane).animateCss('fadeOut').then(() => {
          $(pickerShadePane).hide();
        });
        $(pickerSelect).animate({
          bottom: `-${pickerSelect.clientHeight + 20}px`
        }, 300, 'swing');
      }
    }
  };

  var curSelectIndexs = null;
  var curSelectObj = [];

  function _setupEvents(index, pickerItem) {
    var pullStartY, pullMoveY, startTranslate, transformTo, curSelectedIndex;

    function _onTouchStart(e) {
      var triggerElement = null;
      if ($(e.target).hasClass('pickerItemsWrap')) {
        triggerElement = $(e.target).find('div.pickerItemsCol').get(0);
      } else if ($(e.target).hasClass('pickerItemsCol')) {
        triggerElement = $(e.target).get(0);
      } else {
        triggerElement = $(e.target).parents('div.pickerItemsCol').get(0);
      }
      pullStartY = e.targetTouches[0].clientY;
      startTranslate = transformTo = getCurTransform(e, 1);
      triggerElement.style.transition = '0s';
    }

    function _onTouchMove(e) {
      var triggerElement = null;
      if ($(e.target).hasClass('pickerItemsWrap')) {
        triggerElement = $(e.target).find('div.pickerItemsCol').get(0);
      } else if ($(e.target).hasClass('pickerItemsCol')) {
        triggerElement = $(e.target).get(0);
      } else {
        triggerElement = $(e.target).parents('div.pickerItemsCol').get(0);
      }
      pullMoveY = e.targetTouches[0].clientY;
      if (!pullStartY) {
        pullStartY = e.targetTouches[0].clientY;
        startTranslate = transformTo = getCurTransform(e, 1);
        triggerElement.style.transition = '0s';
      }
      e.preventDefault();
      var dist = pullMoveY - pullStartY;
      transformTo = Number(startTranslate) + dist;
      if (transformTo < transformToRange[index].min) {
        transformTo = transformToRange[index].min - Math.pow(transformToRange[index].min - transformTo, _defaults.pickerItemRate);
      }
      if (transformTo > transformToRange[index].max) {
        transformTo = transformToRange[index].max + Math.pow(transformTo - transformToRange[index].max, _defaults.pickerItemRate);
      }
      triggerElement.style.transform = 'translate3d(0px, ' + transformTo + 'px, 0px)';
      // 更新Picker Item
      var newSelectedIndex = Math.round((transformToRange[index].max - transformTo) / _defaults.pickerItemHeight);
      if (newSelectedIndex < 0) {
        newSelectedIndex = 0;
      } else if (newSelectedIndex > $(triggerElement).find('div.pickerItem').length - 1) {
        newSelectedIndex = $(triggerElement).find('div.pickerItem').length - 1;
      }
      if (curSelectedIndex === null || (curSelectedIndex !== null && curSelectedIndex != newSelectedIndex)) {
        // 切换到新的item的时候，播放音效
        pickerItemChangeAudio.play();
        // 更改文字缩放排布
        $(triggerElement).find('div.pickerItem:eq(' + newSelectedIndex + ')').css('transform', `scale(${1 + _defaults.pickerItemMaxsScaleAdd}, ${1 + _defaults.pickerItemMaxsScaleAdd})`);
        var itemPreIndex = newSelectedIndex - 1;
        var itemPreI = 0;
        while (itemPreIndex >= 0) {
          itemPreI++;
          $(triggerElement).find('div.pickerItem:eq(' + itemPreIndex + ')').css('transform', `scale(${1 + _defaults.pickerItemMaxsScaleAdd - itemPreI * 0.1}, ${1 + _defaults.pickerItemMaxsScaleAdd - itemPreI * 0.1})`);
          itemPreIndex--;
        }
        var itemNextIndex = newSelectedIndex + 1;
        var itemNextI = 0;
        while (itemNextIndex <= $(triggerElement).find('div.pickerItem').length - 1) {
          itemNextI++;
          $(triggerElement).find('div.pickerItem:eq(' + itemNextIndex + ')').css('transform', `scale(${1 + _defaults.pickerItemMaxsScaleAdd - itemNextI * 0.1}, ${1 + _defaults.pickerItemMaxsScaleAdd - itemNextI * 0.1})`);
          itemNextIndex++;
        }
      }
      curSelectedIndex = newSelectedIndex;
      $(triggerElement).find('div.pickerItem:eq(' + curSelectedIndex + ')').siblings().removeClass('pickerItemSelected');
      $(triggerElement).find('div.pickerItem:eq(' + curSelectedIndex + ')').addClass('pickerItemSelected');
    }

    function _onTouchEnd(e) {
      var triggerElement = null;
      if ($(e.target).hasClass('pickerItemsWrap')) {
        triggerElement = $(e.target).find('div.pickerItemsCol').get(0);
      } else if ($(e.target).hasClass('pickerItemsCol')) {
        triggerElement = $(e.target).get(0);
      } else {
        triggerElement = $(e.target).parents('div.pickerItemsCol').get(0);
      }
      triggerElement.style.transition = '300ms';
      var currentTransf = getCurTransform(e, 1);
      if (currentTransf < transformToRange[index].min) {
        triggerElement.style.transform = 'translate3d(0px, ' + transformToRange[index].min + 'px, 0px)';
      }
      if (currentTransf > transformToRange[index].max) {
        triggerElement.style.transform = 'translate3d(0px, ' + transformToRange[index].max + 'px, 0px)';
      }
      if (currentTransf >= transformToRange[index].min && currentTransf <= transformToRange[index].max) {
        var tansformEnd = transformToRange[index].max - curSelectedIndex * _defaults.pickerItemHeight;
        triggerElement.style.transform = 'translate3d(0px, ' + tansformEnd + 'px, 0px)';
      }
      // 获取当前选中文本
      var allPickerItems = $(triggerElement).parents('div.pickerBodyWrap').find('div.pickerItemsWrap');
      var curSeleIndexNew = '';
      for (let i = 0; i < allPickerItems.length; i++) {
        curSeleIndexNew += $(allPickerItems[i]).find('div.pickerItemSelected').index();
        if (i < allPickerItems.length - 1) {
          curSeleIndexNew += ' ';
        }
        curSelectObj[i] = {
          index: $(allPickerItems[i]).find('div.pickerItemSelected').index(),
          value: $(allPickerItems[i]).find('div.pickerItemSelected').text(),
          displayVal: $(allPickerItems[i]).find('div.pickerItemSelected').attr('data-picker-value')
        };
      }
      if (!curSelectIndexs) {
        curSelectIndexs = curSeleIndexNew;
        _SETTINGS.onChangeFn(curSelectObj);
      } else if (curSelectIndexs && curSelectIndexs != curSeleIndexNew) {
        curSelectIndexs = curSeleIndexNew;
        _SETTINGS.onChangeFn(curSelectObj);
      }
    }

    pickerItem.addEventListener('touchend', _onTouchEnd);
    pickerItem.addEventListener('touchstart', _onTouchStart);
    pickerItem.addEventListener('touchmove', _onTouchMove, supportsPassive ? {
        passive: _SETTINGS.passive || false
      } :
      undefined);
    return {
      onTouchStart: _onTouchStart,
      onTouchMove: _onTouchMove,
      onTouchEnd: _onTouchEnd
    };
  };

  var picker = {
    init: function () {
      //////////////////// 创建Picker选取DOM
      if (!document.getElementById('pickerSelectWrap')) {
        //////////////////// 添加遮罩层
        var pickerShadePane = document.createElement('div');
        pickerShadePane.id = 'pickerShadePane';
        pickerShadePane.style.position = 'absolute';
        pickerShadePane.style.top = 0;
        pickerShadePane.style.left = 0;
        pickerShadePane.style.right = 0;
        pickerShadePane.style.bottom = 0;
        pickerShadePane.style.background = 'rgba(0, 0, 0, .8)';
        pickerShadePane.style.zIndex = '9999999999998';
        pickerShadePane.style.display = 'none';
        document.body.appendChild(pickerShadePane);
        ////////////////////////////////////////////////////////// 添加Picker容器
        var pickerSelectWrap = document.createElement('div');
        pickerSelectWrap.id = 'pickerSelectWrap';
        pickerSelectWrap.style.width = '100vw';
        pickerSelectWrap.style.maxHeight = '360px';
        pickerSelectWrap.style.background = '#ffffff';
        pickerSelectWrap.style.zIndex = '9999999999999';
        pickerSelectWrap.style.position = 'absolute';
        document.body.appendChild(pickerSelectWrap);
        //////////////////// 选择头部
        var pickerHeaderWrap = document.createElement('div');
        pickerHeaderWrap.classList.add('pickerHeaderWrap');
        pickerHeaderWrap.style.position = 'relative';
        pickerHeaderWrap.style.height = '48px';
        pickerHeaderWrap.style.lineHeight = '48px';
        pickerSelectWrap.appendChild(pickerHeaderWrap);
        // 头部左边按钮
        var pickerHeadLeftBtn = document.createElement('span');
        pickerHeadLeftBtn.classList.add('headLeftBtn');
        pickerHeadLeftBtn.classList.add('ripple');
        pickerHeadLeftBtn.innerHTML = _defaults.headLeftBtnTxt;
        pickerHeadLeftBtn.style.color = _defaults.headLeftBtnColor;
        pickerHeadLeftBtn.style.display = 'inline-block';
        pickerHeadLeftBtn.style.textAlign = 'center';
        pickerHeadLeftBtn.style.position = 'absolute';
        pickerHeadLeftBtn.style.top = '0';
        pickerHeadLeftBtn.style.left = '0';
        pickerHeadLeftBtn.style.bottom = '0';
        pickerHeadLeftBtn.style.fontSize = '1.3rem';
        pickerHeadLeftBtn.style.padding = '0 1.4rem';
        pickerHeadLeftBtn.style.zIndex = 2;
        pickerHeaderWrap.appendChild(pickerHeadLeftBtn);
        // 头部右边按钮
        var pickerHeadRightBtn = document.createElement('span');
        pickerHeadRightBtn.classList.add('headRightBtn');
        pickerHeadRightBtn.classList.add('ripple');
        pickerHeadRightBtn.innerHTML = _defaults.headRightBtnTxt;
        pickerHeadRightBtn.style.color = _defaults.headRightBtnColor;
        pickerHeadRightBtn.style.display = 'inline-block';
        pickerHeadRightBtn.style.textAlign = 'center';
        pickerHeadRightBtn.style.position = 'absolute';
        pickerHeadRightBtn.style.top = '0';
        pickerHeadRightBtn.style.right = '0';
        pickerHeadRightBtn.style.bottom = '0';
        pickerHeadRightBtn.style.fontSize = '1.3rem';
        pickerHeadRightBtn.style.padding = '0 1.4rem';
        pickerHeadRightBtn.style.zIndex = 2;
        pickerHeaderWrap.appendChild(pickerHeadRightBtn);
        // 头部中间标题
        var pickerHeadTitle = document.createElement('span');
        pickerHeadTitle.classList.add('headTitle');
        pickerHeadTitle.innerHTML = _defaults.title;
        pickerHeadTitle.style.display = 'inline-block';
        pickerHeadTitle.style.textAlign = 'center';
        pickerHeadTitle.style.color = _defaults.normalColor;
        pickerHeadTitle.style.position = 'absolute';
        pickerHeadTitle.style.top = '0';
        pickerHeadTitle.style.left = '0';
        pickerHeadTitle.style.right = '0';
        pickerHeadTitle.style.bottom = '0';
        pickerHeadTitle.style.fontSize = '1.4rem';
        pickerHeadTitle.style.zIndex = 1;
        pickerHeaderWrap.appendChild(pickerHeadTitle);
        //////////////////// 选择中间主体部分
        var pickerBodyWrap = document.createElement('div');
        pickerBodyWrap.style.position = 'relative';
        pickerBodyWrap.classList.add('pickerBodyWrap');
        pickerBodyWrap.style.height = '240px';
        pickerBodyWrap.style.textAlign = 'center';
        pickerBodyWrap.style.fontSize = '0';
        pickerSelectWrap.appendChild(pickerBodyWrap);
        //////////////////// 选择底部
        var pickerFooterWrap = document.createElement('div');
        pickerFooterWrap.classList.add('pickerFooterWrap');
        pickerSelectWrap.appendChild(pickerFooterWrap);
        //////////////////// 最终计算整体bottom值
        pickerSelectWrap.style.bottom = `-${pickerSelectWrap.clientHeight + 20}px`;
        //////////////////// 添加样式代码
        var styleEl;
        let styleId = 'picker-js-style';
        if (!document.querySelector('#' + styleId)) {
          styleEl = document.createElement('style');
          styleEl.setAttribute('id', styleId);
          document.head.appendChild(styleEl);
        } else {
          styleEl = document.querySelector('#' + styleId);
        }
        styleEl.textContent = getStyles().replace(/\s+/g, ' ');
      }
    },
    instance: function (options) {
      _SETTINGS.clos = [];
      if (options === void 0) options = {};
      Object.keys(_defaults).forEach(function (key) {
        if (typeof _defaults[key] == 'boolean' && typeof options[key] != 'undefined') {
          _SETTINGS[key] = options[key];
        } else {
          _SETTINGS[key] = options[key] || _defaults[key];
        }
      });
      // 修改picker UI
      var pickerHeadTitle = $('div#pickerSelectWrap').find('div.pickerHeaderWrap').find('span.headTitle');
      pickerHeadTitle.text(_SETTINGS.title);
      // -> 添加选择内容
      var pickerBody = $('div#pickerSelectWrap').find('div.pickerBodyWrap');
      pickerBody.html('');
      if (_SETTINGS.clos && _SETTINGS.clos.length > 0) {
        // 循环添加内容
        for (let colItem in _SETTINGS.clos) {
          var pickerItemsWrap = document.createElement('div');
          pickerItemsWrap.classList.add('pickerItemsWrap');
          pickerItemsWrap.style.width = `calc(100% * ${1 / _SETTINGS.clos.length})`;
          pickerBody.append(pickerItemsWrap);
          var pickerItemObj = _SETTINGS.clos[colItem];
          var pickerItemsCol = document.createElement('div');
          pickerItemsCol.classList.add('pickerItemsCol');
          if (pickerItemObj.textAlign) {
            pickerItemsCol.classList.add('pickerItemsCol-' + pickerItemObj.textAlign);
          } else {
            pickerItemsCol.classList.add('pickerItemsCol-center');
          }
          pickerItemsWrap.appendChild(pickerItemsCol);
          pickerItemsCol.style.transform = `translate3d(0px, ${pickerBody.height() * _defaults.pickerHighlightRadio - _defaults.pickerItemHeight + _defaults.pickerHighlightOffsetTop}px, 0px)`;
          if (pickerItemObj.values && pickerItemObj.values.length > 0) {
            for (let itemVal in pickerItemObj.values) {
              var itemValObj = pickerItemObj.values[itemVal];
              var pickerItem = document.createElement('div');
              pickerItem.classList.add('pickerItem');
              if (itemVal == 0) {
                pickerItem.classList.add('pickerItemSelected');
              }
              pickerItem.style.transform = `scale(${1 + _defaults.pickerItemMaxsScaleAdd - itemVal * 0.1}, ${1 + _defaults.pickerItemMaxsScaleAdd - itemVal * 0.1})`;
              pickerItem.innerHTML = itemValObj;
              let displayVal = $.isArray(pickerItemObj.displayValues) ? (pickerItemObj.displayValues[itemVal] || itemValObj) : itemValObj;
              pickerItem.setAttribute('data-picker-value', displayVal);
              pickerItemsCol.appendChild(pickerItem);
            }
          }
          // 添加滑动距离限定范围
          transformToRange[colItem] = {
            min: pickerBody.height() * _defaults.pickerHighlightRadio + _defaults.pickerHighlightOffsetTop - pickerItemsCol.clientHeight,
            max: pickerBody.height() * _defaults.pickerHighlightRadio - _defaults.pickerItemHeight + _defaults.pickerHighlightOffsetTop
          };
          // 初始化选定内容
          if (pickerItemObj.values && pickerItemObj.values.length > 0) {
            let selDisplayVal = $.isArray(pickerItemObj.displayValues) ? (pickerItemObj.displayValues[0] || pickerItemObj.values[0]) : pickerItemObj.values[0];
            curSelectObj[colItem] = {
              index: 0,
              value: pickerItemObj.values[0],
              displayVal: selDisplayVal
            };
          }
          // 添加滑动事件
          new _setupEvents(colItem, pickerItemsWrap);
        }
        // 添加高亮选中区域
        var pickerHighlight = document.createElement('div');
        pickerHighlight.classList.add('pickerHighlight');
        pickerBody.append(pickerHighlight);
      } else {
        var noCols = document.createElement('span');
        noCols.style.fontSize = '1.2rem';
        noCols.innerHTML = '未指定Picker内容，请设置参数 cols';
        pickerBody.append(noCols);
        pickerBody.css({
          background: '#EBF0F2',
          color: '#343B4C',
          lineHeight: `${pickerBody.height()}px`
        });
      }
      // 计算调整整体bottom值
      var pickerSelect = document.getElementById('pickerSelectWrap');
      pickerSelect.style.bottom = `-${pickerSelect.clientHeight + 20}px`;
      // 初始化音效播放组件
      pickerItemChangeAudio = new Audio('assets/musics/picker_change.mp3');
      pickerItemChangeAudio.volume = 0.2;
      // 绑定事件
      var pickerShadePane = $('#pickerShadePane');
      pickerShadePane.off('click');
      if (_SETTINGS.shadeClose) {
        pickerShadePane.on('click', function () {
          pickerInstance.hide();
        });
      }
      var pickerHeadCancelBtn = $('div#pickerSelectWrap').find('div.pickerHeaderWrap').find('span.headLeftBtn');
      pickerHeadCancelBtn.off('click');
      pickerHeadCancelBtn.on('click', function () {
        if (_SETTINGS.cancelFn && typeof _SETTINGS.cancelFn == 'function') {
          _SETTINGS.cancelFn();
        }
        pickerInstance.hide();
      });
      var pickerHeadConfirmBtn = $('div#pickerSelectWrap').find('div.pickerHeaderWrap').find('span.headRightBtn');
      pickerHeadConfirmBtn.off('click');
      pickerHeadConfirmBtn.on('click', function () {
        if (_SETTINGS.confirmFn && typeof _SETTINGS.confirmFn == 'function') {
          // 获取选定项内容
          _SETTINGS.confirmFn(curSelectObj);
        }
        pickerInstance.hide();
      });
      return pickerInstance;
    },
    isShow: function () {
      var pickerSelect = document.getElementById('pickerSelectWrap');
      if (pickerSelect.style.bottom === '0px' || pickerSelect.style.bottom === '0') {
        return {
          show: true,
          hideFn: pickerInstance.hide
        };
      } else {
        return {
          show: false,
          showFn: pickerInstance.show
        };
      }
    }
  };

  function getCurTransform(e, index) {
    var curTransform = 0;
    if (index >= 0 && index <= 3) {
      var pickerItemElement = null;
      if ($(e.target).hasClass('pickerItemsWrap')) {
        pickerItemElement = $(e.target).find('div.pickerItemsCol').get(0);
      } else if ($(e.target).hasClass('pickerItemsCol')) {
        pickerItemElement = $(e.target).get(0);
      } else {
        pickerItemElement = $(e.target).parents('div.pickerItemsCol').get(0);
      }
      var pickerItemTransform = pickerItemElement.style.transform.trim() || '';
      var pickerItemTransformGet = pickerItemTransform.substr('translate3d('.length, pickerItemTransform.length - 'translate3d('.length - 1).split(',')[index].trim();
      curTransform = pickerItemTransformGet.substr(0, pickerItemTransformGet.length - 2).trim();
    }
    return curTransform;
  }

  function getStyles() {
    return `div#pickerSelectWrap::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: -1px;
      background-image: url(https://raw.githubusercontent.com/nx6313/project_resources/master/imgs/border-shade.png);
      background-repeat: repeat-x;
      height: 1px;
    }
    div#pickerSelectWrap .pickerHeaderWrap::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: 1px solid #F3F3F3;
    }
    div#pickerShadePane {
      animation-duration: 0.5s;
      -webkit-animation-duration: 0.5s;
    }
    div#pickerSelectWrap div.pickerBodyWrap div.pickerItemsWrap {
      display: inline-block;
      height: 100%;
      overflow: hidden;
      -webkit-mask-box-image: -webkit-linear-gradient(bottom, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent);
      -webkit-mask-box-image: linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent);
    }
    div#pickerSelectWrap div.pickerBodyWrap div.pickerItemsWrap div.pickerItemsCol {
      -webkit-transition: 300ms;
      transition: 300ms;
      -webkit-transition-timing-function: ease-out;
      transition-timing-function: ease-out;
    }
    div#pickerSelectWrap div.pickerBodyWrap div.pickerItemsWrap div.pickerItemsCol-left {
      text-align: left;
    }
    div#pickerSelectWrap div.pickerBodyWrap div.pickerItemsWrap div.pickerItemsCol-right {
      text-align: right;
    }
    div#pickerSelectWrap div.pickerBodyWrap div.pickerItemsWrap div.pickerItemsCol-center {
      text-align: center;
    }
    div#pickerSelectWrap div.pickerBodyWrap div.pickerItemsWrap div.pickerItemsCol div.pickerItem {
      height: ${_defaults.pickerItemHeight}px;
      line-height: ${_defaults.pickerItemHeight}px;
      padding: 0 10px;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #9b9b9b;
      left: 0;
      top: 0;
      width: 100%;
      box-sizing: border-box;
      -webkit-transition: 100ms;
      transition: 100ms;
      font-size: 1.2rem;
    }
    div#pickerSelectWrap div.pickerBodyWrap div.pickerItemsWrap div.pickerItemsCol div.pickerItemSelected {
      color: #3d4145;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      -webkit-transform: rotateX(0deg);
      transform: rotateX(0deg);
    }
    div#pickerSelectWrap div.pickerBodyWrap div.pickerHighlight {
      height: ${_defaults.pickerItemHeight}px;
      box-sizing: border-box;
      position: absolute;
      left: 0;
      width: 100%;
      top: calc(${_defaults.pickerHighlightRadio * 100}% - ${_defaults.pickerItemHeight}px);
      margin-top: ${_defaults.pickerHighlightOffsetTop}px;
      pointer-events: none;
    }
    div#pickerSelectWrap div.pickerBodyWrap div.pickerHighlight:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: auto;
      right: auto;
      height: 1px;
      width: 100%;
      background-color: #D9D9D9;
      display: block;
      z-index: 15;
      -webkit-transform-origin: 50% 0%;
      transform-origin: 50% 0%;
    }
    div#pickerSelectWrap div.pickerBodyWrap div.pickerHighlight:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      right: auto;
      top: auto;
      height: 1px;
      width: 100%;
      background-color: #D9D9D9;
      display: block;
      z-index: 15;
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
    }`;
  }

  return picker;
}());
