var Picker = (function () {
  let that = this;
  var _SETTINGS = {};
  var _defaults = {
    headLeftBtnTxt: '取消',
    headRightBtnTxt: '确定',
    headTitleTxt: '选择开始时间',
    normalColor: '#292929',
    headLeftBtnColor: '#CACACA',
    headRightBtnColor: '#C74B07'
  };

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
        pickerShadePane.onclick = function () {
          pickerInstance.hide();
        };
        ////////////////////////////////////////////////////////// 添加Picker容器
        var pickerSelectWrap = document.createElement('div');
        pickerSelectWrap.id = 'pickerSelectWrap';
        pickerSelectWrap.style.width = '100vw';
        pickerSelectWrap.style.maxHeight = '300px';
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
        pickerHeadLeftBtn.onclick = function () {
          pickerInstance.hide();
        };
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
        pickerHeadTitle.innerHTML = _defaults.headTitleTxt;
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
        pickerBodyWrap.classList.add('pickerBodyWrap');
        pickerBodyWrap.innerHTML = '我是中间';
        pickerSelectWrap.appendChild(pickerBodyWrap);
        //////////////////// 选择底部
        var pickerFooterWrap = document.createElement('div');
        pickerFooterWrap.classList.add('pickerFooterWrap');
        pickerFooterWrap.innerHTML = '我是底部';
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
      pickerHeadTitle.text(_SETTINGS.headTitleTxt);
      // 计算调整整体bottom值
      var pickerSelect = document.getElementById('pickerSelectWrap');
      pickerSelect.style.bottom = `-${pickerSelect.clientHeight + 20}px`;
      // 绑定事件
      return pickerInstance;
    }
  };

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
    }`;
  }

  return picker;
}());
