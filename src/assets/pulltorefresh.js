var PullToRefresh = (function () {
  // "<div class=\"__PREFIX__box\"><div class=\"__PREFIX__content\"><div class=\"__PREFIX__icon animated\"></div><div class=\"__PREFIX__text\"></div></div></div>"
  var _ptrMarkup = function () {
    return "";
  };

  // height属性之后，transition: height 0.3s, min-height 0.3s;\n 
  var _ptrStyles = function () {
    return "_PAGE_ID_ABOUT_ .__PREFIX__ptr {\n __PULLWRAPBG__\n  __PULLWRAPBOXSHADOW__\n  pointer-events: none;\n  font-size: 0.85em;\n  font-weight: bold;\n  top: 0;\n  height: 0;\n   text-align: center;\n  width: 100%;\n  overflow: hidden;\n  display: flex;\n  align-items: flex-end;\n  align-content: stretch;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__box {\n  padding: 6px;\n  flex-basis: 100%;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__pull {\n  transition: none;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__text {\n  margin-top: .33em;\n  color: _REF_TXT_TIP_COLOR_;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__icon {\n color: rgba(252, 252, 252, 0.8);\n  transition: transform .3s;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__top {\n  touch-action: pan-x pan-down pinch-zoom;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__release .__PREFIX__icon {\n  transform: rotate(180deg);\n}\n_PAGE_ID_ABOUT_ .__PREFIX__ptr-after{\n box-shadow: none !important;\n __PULLAFTERBG__\n}";
  };

  /* eslint-disable import/no-unresolved */

  var _SETTINGS = {};
  let pageSettingsContainer = {}; // 存放所有页面的各自参数容器

  var _defaults = {
    distThreshold: 66,
    distMax: 74,
    distReload: 62,
    bodyOffset: 20,
    pullAreaBg: '',
    elasticityTopAreaBg: '',
    elasticityAreaBg: '',
    mainElement: 'body',
    triggerElement: 'body',
    ptrElement: '.ptr',
    ptrAfterElement: '.ptr-after',
    classPrefix: 'ptr--',
    pageIdName: '',
    pageRankName: '',
    cssProp: 'height',
    iconArrow: '&#8675;',
    iconRefreshing: '&hellip;',
    iconZoomRate: 0.1,
    refTxtColor: 'rgba(252, 252, 252, 0.8)',
    instructionsPullToRefresh: 'Pull down to refresh',
    instructionsReleaseToRefresh: 'Release to refresh',
    instructionsRefreshing: 'Refreshing',
    refreshTimeout: 200,
    getMarkup: _ptrMarkup,
    getStyles: _ptrStyles,
    ignoreElements: '',
    footerWaterMark: '',
    pageLoadFinish: function () {},
    onInit: function () {},
    onRefresh: function () {},
    onRefreshAfter: function () {},
    resistanceFunction: function (t) {
      return Math.min(1, t / 4.6);
    },
    shouldPullToRefresh: function () {
      return !window.scrollY;
    },
    shouldUpToElasticity: function () {
      return !window.scrollY;
    },
    canUpToRef: function () {
      return true;
    },
    onlyElasticity: true,
    upLoadMore: false,
    upLoadShowTipDis: 10,
    upLoadShowReleaseTipDis: 30,
    upLoadRefingDis: 50,
    upLoadTip: '往上再拉一点',
    upLoadReleaseToRefTip: '释放加载更多',
    upLoadRefingIcon: '&hellip;',
    scrollViewHeight: -1,
    titleBarHeight: 0,
    footerBarHeight: 0,
    otherElmHeight: 0,
    offsetWidth: -1,
    offsetTop: 0,
    offsetLeft: 0,
    canSwitchSlide: false,
    switchPageRate: 0.4
  };
  var splitPageShowNum = 5; // 分屏显示的显示数量

  var pullStartY = null;
  var pullMoveY = null;
  var dist = 0;
  var distResisted = 0;

  var startTramformX = null;
  var pullStartX = null;
  var pullMoveX = null;
  var distX = 0;
  var switchDirect = null;

  var fingerDistancePriority = null;

  var _setup = false;
  var _enable = false;
  var _timeout = null;

  var canPull = false;
  var canElasticity = false;

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

  function getCurPageIdName() {
    let curPageIdName = '';
    // 先判断是否存在模态页面
    // 不存在再从tabs中寻找当前页面
    let ionModal = document.getElementsByTagName('ion-modal');
    if (ionModal && ionModal.length > 0) {
      curPageIdName = $(ionModal[ionModal.length - 1]).find('ion-content').parent().get(0).localName;
    } else {
      let showTabsContentPages = $('ion-nav').find('.show-page').find('ion-content');
      for (let pageIndex = 0; pageIndex < showTabsContentPages.length; pageIndex++) {
        if ($(showTabsContentPages[pageIndex]).parent().is(':visible')) {
          curPageIdName = $(showTabsContentPages[pageIndex]).parent().get(0).localName;
        }
      }
    }
    return curPageIdName;
  }

  function getCurPageRankName(e) {
    let curPageRankName = '';
    let curScrollViewClassName = $(e.target).parents('scrollview').find('div').first().attr('class');
    if (curScrollViewClassName) {
      curPageRankName = curScrollViewClassName;
    }
    return curPageRankName;
  }

  function getPtrElement(e, classPrefix) {
    let ptrElement = $(e.target).parents('scrollview').find('div.' + classPrefix + 'ptr').get(0);
    return ptrElement;
  }

  function getPtrAfterElement(e, classPrefix) {
    let ptrAfterElement = $(e.target).parents('scrollview').find('div.' + classPrefix + 'ptr-after').get(0);
    return ptrAfterElement;
  }

  function getTriggerElement(e) {
    let triggerElement = $(e.target).parents('scrollview').find('div.pullRefWrap').get(0);
    return triggerElement;
  }

  function getSwitchPageCount(e) {
    let switchPageCount = $(e.target).parents('switch-page').parent().find('switch-page').length;
    return switchPageCount;
  }

  function getCurSwitchPageIndex(e) {
    let curSwitchPageIndex = $(e.target).parents('switch-page').index();
    return curSwitchPageIndex;
  }

  function getSwitchPageWrapElement(e) {
    let switchPageWrapElement = $(e.target).parents('switch-page').parent().get(0);
    return switchPageWrapElement;
  }

  function getSwitchTabSlideRailElement(e) {
    let switchTabSlideRailElement = $(e.target).parents('switch-pages').find('div.switchTabSlideRail').get(0);
    return switchTabSlideRailElement;
  }

  function getSwitchPageIndicatorElement(e) {
    let switchPageIndicatorElement = $(e.target).parents('switch-pages').find('span.switchTabIndicator').get(0);
    return switchPageIndicatorElement;
  }

  function getSwitchCurTabElement(e, index) {
    let switchCurTabElement = $(e.target).parents('switch-pages').find('div.switchTabSlideRail').find('span.switchTabItem:eq(' + index + ')').get(0);
    return switchCurTabElement;
  }

  function getSwitchTabSlideRailCurTransform(e, index) {
    var switchTabSlideRailCurTransform = 0;
    if (index >= 0 && index <= 3) {
      let switchTabSlideRailElement = getSwitchTabSlideRailElement(e);
      var switchTabSlideRailTransform = switchTabSlideRailElement.style.transform.trim() || '';
      var switchTabSlideRailTransformGet = switchTabSlideRailTransform.substr('translate3d('.length, switchTabSlideRailTransform.length - 'translate3d('.length - 1).split(',')[index].trim();
      switchTabSlideRailCurTransform = switchTabSlideRailTransformGet.substr(0, switchTabSlideRailTransformGet.length - 2).trim();
    }
    return switchTabSlideRailCurTransform;
  }

  function getSwitchPageWrapCurTransform(e, index) {
    var switchPageWrapCurTransform = 0;
    if (index >= 0 && index <= 3) {
      let switchPageWrapElement = getSwitchPageWrapElement(e);
      var switchPageWrapTransform = switchPageWrapElement.style.transform.trim() || '';
      var switchPageTransformGet = switchPageWrapTransform.substr('translate3d('.length, switchPageWrapTransform.length - 'translate3d('.length - 1).split(',')[index].trim();
      switchPageWrapCurTransform = switchPageTransformGet.substr(0, switchPageTransformGet.length - 2).trim();
    }
    return switchPageWrapCurTransform;
  }

  function getLoadMoreElem() {
    let $loadMore = null;
    // 先判断是否存在模态页面
    // 不存在再从tabs中寻找当前页面
    let ionModal = document.getElementsByTagName('ion-modal');
    if (ionModal && ionModal.length > 0) {
      $loadMore = $(ionModal[ionModal.length - 1]).find('ion-content').find('scrollview').find('div.ionic-ptr-after').find('div.loadMore');
    } else {
      let showTabsContentPages = $('ion-tabs').find('ion-tab.show-tab').find('ion-content');
      for (let pageIndex = 0; pageIndex < showTabsContentPages.length; pageIndex++) {
        if ($(showTabsContentPages[pageIndex]).parent().is(':visible')) {
          $loadMore = $(showTabsContentPages[pageIndex]).find('scrollview').find('div.ionic-ptr-after').find('div.loadMore');
        }
      }
    }
    return $loadMore;
  }

  function _update(e) {
    let curPageIdName = getCurPageIdName();
    var pageRankName = getCurPageRankName(e);
    var onlyElasticity = pageSettingsContainer[curPageIdName + '_' + pageRankName].onlyElasticity;
    if (!onlyElasticity) {
      var classPrefix = _SETTINGS.classPrefix;
      var ptrElement = getPtrElement(e, classPrefix); // _SETTINGS.ptrElement;
      var ptrAfterElement = getPtrAfterElement(e, classPrefix); // _SETTINGS.ptrAfterElement;
      var iconArrow = _SETTINGS.iconArrow;
      var iconRefreshing = _SETTINGS.iconRefreshing;
      var iconZoomRate = _SETTINGS.iconZoomRate;
      var instructionsRefreshing = pageSettingsContainer[curPageIdName + '_' + pageRankName].instructionsRefreshing;
      var instructionsPullToRefresh = pageSettingsContainer[curPageIdName + '_' + pageRankName].instructionsPullToRefresh;
      var instructionsReleaseToRefresh = pageSettingsContainer[curPageIdName + '_' + pageRankName].instructionsReleaseToRefresh;

      var iconEl = ptrElement.querySelector(("." + classPrefix + "icon"));
      var textEl = ptrElement.querySelector(("." + classPrefix + "text"));

      if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'refreshing') {
        iconEl.classList.add('rotate');
        iconEl.innerHTML = '<img style="width: ' + (iconZoomRate * 100) + '%;" src="' + iconRefreshing + '"/>';
      } else {
        iconEl.classList.remove('rotate');
        iconEl.innerHTML = '<img style="width: ' + (iconZoomRate * 100) + '%;" src="' + iconArrow + '"/>';
      }

      if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'releasing') {
        textEl.innerHTML = instructionsReleaseToRefresh;
      }

      if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'pulling' || pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'pending') {
        textEl.innerHTML = instructionsPullToRefresh;
      }

      if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'refreshing') {
        textEl.innerHTML = instructionsRefreshing;
      }
    }
  }

  function _setupEvents() {
    function onReset(e) {
      let curPageIdName = getCurPageIdName();
      var pageRankName = getCurPageRankName(e);
      var classPrefix = _SETTINGS.classPrefix;
      var cssProp = _SETTINGS.cssProp;
      var ptrElement = getPtrElement(e, classPrefix); // _SETTINGS.ptrElement;
      var triggerElement = getTriggerElement(e); // _SETTINGS.mainElement

      ptrElement.classList.remove((classPrefix + "refresh"));
      //ptrElement.style[cssProp] = '0px';
      triggerElement.style.transform = 'translate3d(0px, 0px, 0px)';

      pageSettingsContainer[curPageIdName + '_' + pageRankName]._state = 'pending';
      _update(e);
    }

    function onUpLoadMoreReset(triggerElement, e) {
      triggerElement.style.transform = 'translate3d(0px, 0px, 0px)';
      let curPageIdName = getCurPageIdName();
      var pageRankName = getCurPageRankName(e);
      var upLoadTip = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadTip;
      var $loadMore = getLoadMoreElem();
      var loadMoreElement = $loadMore.get(0);
      loadMoreElement.innerHTML = upLoadTip;
      $loadMore.hide();
      // 移除正在获取新数据loading
      if (document.getElementById('upRefDataLoadingWrap')) {
        $(document.getElementById('upRefDataLoadingWrap')).fadeOut(() => {
          $(document.getElementById('upRefDataLoadingWrap')).remove();
        });
      }
      pageSettingsContainer[curPageIdName + '_' + pageRankName]._upload_more_state = 'pending';
    }

    function _onTouchStart(e) {
      let curPageIdName = getCurPageIdName();
      var pageRankName = getCurPageRankName(e);
      if (!pageSettingsContainer[curPageIdName + '_' + pageRankName]) {
        return;
      }
      var shouldPullToRefresh = pageSettingsContainer[curPageIdName + '_' + pageRankName].shouldPullToRefresh;
      var shouldUpToElasticity = pageSettingsContainer[curPageIdName + '_' + pageRankName].shouldUpToElasticity;
      var triggerElement = getTriggerElement(e); // _SETTINGS.mainElement
      var upLoadMore = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadMore;
      var canUpToRef = pageSettingsContainer[curPageIdName + '_' + pageRankName].canUpToRef;
      var canSwitchSlide = pageSettingsContainer[curPageIdName + '_' + pageRankName].canSwitchSlide;

      if (!triggerElement.contains(e.target)) {
        return;
      }

      canPull = false;
      canElasticity = false;
      if (canSwitchSlide) {
        pullStartX = e.touches[0].screenX;
        startTramformX = getSwitchPageWrapCurTransform(e, 0);
      }
      if (shouldPullToRefresh() || shouldUpToElasticity()) {
        pullStartY = e.touches[0].screenY;
        if (shouldPullToRefresh() && !shouldUpToElasticity()) {
          canPull = true;
        } else if (!shouldPullToRefresh() && shouldUpToElasticity()) {
          canElasticity = true;
        } else {
          canPull = true;
          canElasticity = true;
        }
      }

      if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._state !== 'pending') {
        return;
      }
      if (upLoadMore && canUpToRef() && pageSettingsContainer[curPageIdName + '_' + pageRankName]._upload_more_state !== 'pending') {
        return;
      }
      if (triggerElement !== document.body) {
        triggerElement.style.transition = '';
      }

      clearTimeout(_timeout);

      _enable = triggerElement.contains(e.target);
      pageSettingsContainer[curPageIdName + '_' + pageRankName]._state = 'pending';
      _update(e);
    }

    function _onTouchMove(e) {
      let curPageIdName = getCurPageIdName();
      var pageRankName = getCurPageRankName(e);
      if (!pageSettingsContainer[curPageIdName + '_' + pageRankName]) {
        return;
      }
      var classPrefix = _SETTINGS.classPrefix;
      var cssProp = _SETTINGS.cssProp;
      var distMax = _SETTINGS.distMax;
      var distThreshold = _SETTINGS.distThreshold;
      var ptrElement = getPtrElement(e, classPrefix); // _SETTINGS.ptrElement;
      var ptrAfterElement = getPtrAfterElement(e, classPrefix); // _SETTINGS.ptrAfterElement;
      var triggerElement = getTriggerElement(e); // _SETTINGS.mainElement
      var resistanceFunction = _SETTINGS.resistanceFunction;
      var onlyElasticity = pageSettingsContainer[curPageIdName + '_' + pageRankName].onlyElasticity;
      var upLoadMore = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadMore;
      var canUpToRef = pageSettingsContainer[curPageIdName + '_' + pageRankName].canUpToRef;
      var upLoadShowTipDis = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadShowTipDis;
      var upLoadShowReleaseTipDis = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadShowReleaseTipDis;
      var upLoadTip = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadTip;
      var upLoadReleaseToRefTip = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadReleaseToRefTip;
      var ignoreElements = pageSettingsContainer[curPageIdName + '_' + pageRankName].ignoreElements;
      var canSwitchSlide = pageSettingsContainer[curPageIdName + '_' + pageRankName].canSwitchSlide;
      var switchPageRate = pageSettingsContainer[curPageIdName + '_' + pageRankName].switchPageRate;

      if (!triggerElement.contains(e.target)) {
        return;
      }
      if (ignoreElements) {
        var ignoreElem = document.getElementsByClassName(ignoreElements)[0];
        if (ignoreElem.contains(e.target)) {
          return;
        }
      }

      if (canSwitchSlide) {
        if (typeof startTramformX == 'string' && !startTramformX) {
          startTramformX = getSwitchPageWrapCurTransform(e, 0);
        }
        if (!pullStartX) {
          pullStartX = e.touches[0].screenX;
        } else {
          pullMoveX = e.touches[0].screenX;
        }
      }
      if (!pullStartY) {
        if (canPull || canElasticity) {
          pullStartY = e.touches[0].screenY;
        }
      } else {
        pullMoveY = e.touches[0].screenY;
      }

      if (!_enable || pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'refreshing' || pageSettingsContainer[curPageIdName + '_' + pageRankName]._upload_more_state === 'refreshing') {
        if (canPull && pullStartY < pullMoveY) {
          e.preventDefault();
        }
        if (canElasticity && pullStartY > pullMoveY) {
          e.preventDefault();
        }
        if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._upload_more_state === 'refreshing') {
          e.preventDefault();
        }
        return;
      }

      if (pullStartX && pullMoveX) {
        distX = pullMoveX - pullStartX;
      }
      if (pullStartY && pullMoveY) {
        dist = pullMoveY - pullStartY;
      }

      if (!fingerDistancePriority) {
        if (Math.abs(distX) > 8 && Math.abs(distX) > Math.abs(dist)) {
          fingerDistancePriority = 'horizontal';
        } else {
          fingerDistancePriority = 'vertical';
        }
      }
      if (canSwitchSlide && fingerDistancePriority == 'horizontal') {
        e.preventDefault();
        // 获取当前分屏的序号
        var switchPageCount = getSwitchPageCount(e);
        var curSwitchPageIndex = getCurSwitchPageIndex(e);
        var switchPageWrapElement = getSwitchPageWrapElement(e);
        var switchPageScreenWidth = document.body.clientWidth;
        if (switchPageCount > 1) {
          if (!startTramformX) {
            startTramformX = 0;
          }
          if (distX < 0 && curSwitchPageIndex + 1 <= switchPageCount - 1) {
            // 下翻页
            switchDirect = 'next';
            var transformTo = Number(startTramformX) - Math.abs(distX) * switchPageRate < -((switchPageCount - 1) * switchPageScreenWidth) ? -((switchPageCount - 1) * switchPageScreenWidth) : Number(startTramformX) - Math.abs(distX) * switchPageRate;
            switchPageWrapElement.style.transform = 'translate3d(' + transformTo + 'px, 0px, 0px)';
          } else if (distX > 0 && curSwitchPageIndex > 0 && curSwitchPageIndex - 1 <= switchPageCount - 1) {
            // 上翻页
            switchDirect = 'pre';
            var transformTo = Number(startTramformX) + Math.abs(distX) * switchPageRate > 0 ? 0 : Number(startTramformX) + Math.abs(distX) * switchPageRate;
            switchPageWrapElement.style.transform = 'translate3d(' + transformTo + 'px, 0px, 0px)';
          }
        }
        return;
      }
      if (canPull && dist > 0) {
        if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'pending') {
          ptrElement.classList.add((classPrefix + "pull"));
          pageSettingsContainer[curPageIdName + '_' + pageRankName]._state = 'pulling';
          _update(e);
        }

        e.preventDefault();

        ptrElement.style[cssProp] = (distResisted + 4) + "px";
        triggerElement.style.transform = 'translate3d(0px, ' + distResisted + 'px, 0px)';

        if (!onlyElasticity) {
          distResisted = resistanceFunction(dist / distThreshold) * Math.min(distMax, dist);
        } else {
          distResisted = Math.min(1, dist / 80 / 6.5) * Math.min(100, dist) * 0.5;
        }

        if (!onlyElasticity) {
          if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'pulling' && distResisted > distThreshold) {
            ptrElement.classList.add((classPrefix + "release"));
            pageSettingsContainer[curPageIdName + '_' + pageRankName]._state = 'releasing';
            _update(e);
          }

          if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'releasing' && distResisted < distThreshold) {
            ptrElement.classList.remove((classPrefix + "release"));
            pageSettingsContainer[curPageIdName + '_' + pageRankName]._state = 'pulling';
            _update(e);
          }
        }
      } else if (canElasticity && dist < 0) {
        if (triggerElement !== document.body) {
          ptrElement.style[cssProp] = '0px';
          if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'pending' && onlyElasticity) {
            ptrAfterElement.classList.add((classPrefix + "pull"));
            pageSettingsContainer[curPageIdName + '_' + pageRankName]._state = 'pulling';
            _update(e);
          }

          e.preventDefault();

          triggerElement.style.transform = 'translate3d(0px, ' + (-distResisted) + 'px, 0px)';

          distResisted = Math.abs(dist) * 0.12;
          if (upLoadMore && canUpToRef()) {
            var $loadMore = getLoadMoreElem();
            var loadMoreElement = $loadMore.get(0);
            if (loadMoreElement) {
              if (distResisted > upLoadShowTipDis) {
                if ($loadMore.is(':hidden')) {
                  $loadMore.fadeIn();
                }
                pageSettingsContainer[curPageIdName + '_' + pageRankName]._upload_more_state = 'pulling';
                if (distResisted > upLoadShowReleaseTipDis) {
                  loadMoreElement.innerHTML = upLoadReleaseToRefTip;
                  pageSettingsContainer[curPageIdName + '_' + pageRankName]._upload_more_state = 'releasing';
                } else {
                  loadMoreElement.innerHTML = upLoadTip;
                }
              } else {
                $loadMore.hide();
                pageSettingsContainer[curPageIdName + '_' + pageRankName]._upload_more_state = 'pending';
              }
            }
          }
        }
      }
    }

    function _onTouchEnd(e) {
      let curPageIdName = getCurPageIdName();
      var pageRankName = getCurPageRankName(e);
      if (!pageSettingsContainer[curPageIdName + '_' + pageRankName]) {
        return;
      }
      var classPrefix = _SETTINGS.classPrefix;
      var ptrElement = getPtrElement(e, classPrefix); // _SETTINGS.ptrElement;
      var ptrAfterElement = getPtrAfterElement(e, classPrefix); // _SETTINGS.ptrAfterElement;
      var triggerElement = getTriggerElement(e); // _SETTINGS.mainElement
      var onRefresh = pageSettingsContainer[curPageIdName + '_' + pageRankName].onRefresh;
      var onRefreshAfter = pageSettingsContainer[curPageIdName + '_' + pageRankName].onRefreshAfter;
      var refreshTimeout = _SETTINGS.refreshTimeout;
      var distThreshold = _SETTINGS.distThreshold;
      var distReload = _SETTINGS.distReload;
      var cssProp = _SETTINGS.cssProp;
      var onlyElasticity = pageSettingsContainer[curPageIdName + '_' + pageRankName].onlyElasticity;
      var upLoadMore = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadMore;
      var canUpToRef = pageSettingsContainer[curPageIdName + '_' + pageRankName].canUpToRef;
      var upLoadShowReleaseTipDis = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadShowReleaseTipDis;
      var upLoadRefingDis = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadRefingDis;
      var upLoadRefingIcon = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadRefingIcon;
      var upLoadTip = pageSettingsContainer[curPageIdName + '_' + pageRankName].upLoadTip;
      var canSwitchSlide = pageSettingsContainer[curPageIdName + '_' + pageRankName].canSwitchSlide;

      if (!triggerElement.contains(e.target)) {
        return;
      }

      if (canSwitchSlide) {
        var switchPageCount = getSwitchPageCount(e);
        var curSwitchPageIndex = getCurSwitchPageIndex(e);
        var switchPageWrapCurTransform = getSwitchPageWrapCurTransform(e, 0);
        var switchPageScreenWidth = document.body.clientWidth;
        var switchPageWrapYu = Math.abs(switchPageWrapCurTransform) % switchPageScreenWidth;
        if (switchPageWrapYu != 0) {
          var switchPageWrapElement = getSwitchPageWrapElement(e);
          var switchTabSlideRailElement = getSwitchTabSlideRailElement(e);
          var switchPageIndicatorElement = getSwitchPageIndicatorElement(e);
          switchPageWrapElement.style.transition = '0.4s ease';
          setTimeout(function () {
            switchPageWrapElement.style.transition = '0s';
          }, 0.4 * 1000);
          if (switchPageCount > 1) {
            if ((curSwitchPageIndex + 1 <= switchPageCount - 1) ||
              (curSwitchPageIndex > 0 && curSwitchPageIndex - 1 <= switchPageCount - 1)) {
              if (switchDirect == 'next') {
                if (switchPageWrapYu > 10) {
                  startTramformX = Number(-((curSwitchPageIndex + 1) * switchPageScreenWidth));
                  switchPageWrapElement.style.transform = 'translate3d(' + startTramformX + 'px, 0px, 0px)';
                  // 滑动指示器到下一页
                  // 判断是否需要将指示器选项卡轨道进行位置移动
                  var switchTabSlideRailCurTransform = getSwitchTabSlideRailCurTransform(e, 0);
                  switchTabSlideRailCurTransform = switchTabSlideRailCurTransform ? switchTabSlideRailCurTransform : 0;
                  if (switchPageCount > splitPageShowNum && switchTabSlideRailCurTransform > -((switchPageCount - splitPageShowNum) * Number(switchPageIndicatorElement.clientWidth))) {
                    let railTramformX = Number(switchTabSlideRailCurTransform) - Number(switchPageIndicatorElement.clientWidth) < -((switchPageCount - splitPageShowNum) * Number(switchPageIndicatorElement.clientWidth)) ? -((switchPageCount - splitPageShowNum) * Number(switchPageIndicatorElement.clientWidth)) : Number(switchTabSlideRailCurTransform) - Number(switchPageIndicatorElement.clientWidth);
                    switchTabSlideRailElement.style.transform = 'translate3d(' + railTramformX + 'px, 0px, 0px)';
                  } else {
                    let indicatorTramformX = 0;
                    if (switchPageCount > splitPageShowNum) {
                      indicatorTramformX = (curSwitchPageIndex + 1 - (switchPageCount - splitPageShowNum)) * switchPageIndicatorElement.clientWidth;
                    } else {
                      indicatorTramformX = (curSwitchPageIndex + 1) * switchPageIndicatorElement.clientWidth;
                    }
                    switchPageIndicatorElement.style.transform = 'translate3d(' + indicatorTramformX + 'px, 0px, 0px)';
                  }
                  var switchCurTabElement = getSwitchCurTabElement(e, curSwitchPageIndex + 1);
                  $(switchCurTabElement).siblings().removeClass('switchTabItemSelected');
                  $(switchCurTabElement).addClass('switchTabItemSelected');
                  $(switchCurTabElement).click();
                } else {
                  startTramformX = Number(-(curSwitchPageIndex * switchPageScreenWidth));
                  switchPageWrapElement.style.transform = 'translate3d(' + startTramformX + 'px, 0px, 0px)';
                }
              } else if (switchDirect == 'pre') {
                if (switchPageScreenWidth - switchPageWrapYu > 10) {
                  startTramformX = Number(-((curSwitchPageIndex - 1) * switchPageScreenWidth));
                  switchPageWrapElement.style.transform = 'translate3d(' + startTramformX + 'px, 0px, 0px)';
                  // 滑动指示器到上一页
                  // 判断是否需要将指示器选项卡轨道进行位置移动
                  var switchTabSlideRailCurTransform = getSwitchTabSlideRailCurTransform(e, 0);
                  if (switchPageCount > splitPageShowNum && switchTabSlideRailCurTransform < 0) {
                    let railTramformX = Number(switchTabSlideRailCurTransform) + Number(switchPageIndicatorElement.clientWidth) > 0 ? 0 : Number(switchTabSlideRailCurTransform) + Number(switchPageIndicatorElement.clientWidth);
                    switchTabSlideRailElement.style.transform = 'translate3d(' + railTramformX + 'px, 0px, 0px)';
                  } else {
                    let indicatorTramformX = (curSwitchPageIndex - 1) * switchPageIndicatorElement.clientWidth;
                    switchPageIndicatorElement.style.transform = 'translate3d(' + indicatorTramformX + 'px, 0px, 0px)';
                  }
                  var switchCurTabElement = getSwitchCurTabElement(e, curSwitchPageIndex - 1);
                  $(switchCurTabElement).siblings().removeClass('switchTabItemSelected');
                  $(switchCurTabElement).addClass('switchTabItemSelected');
                  $(switchCurTabElement).click();
                } else {
                  startTramformX = Number(-(curSwitchPageIndex * switchPageScreenWidth));
                  switchPageWrapElement.style.transform = 'translate3d(' + startTramformX + 'px, 0px, 0px)';
                }
              }
            }
          }
          distX = 0;
          pullStartX = null;
          switchDirect = null;
        }
      }
      if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'releasing' && distResisted > distThreshold) {
        pageSettingsContainer[curPageIdName + '_' + pageRankName]._state = 'refreshing';

        ptrElement.style[cssProp] = (distReload + 4) + "px";
        triggerElement.style.transform = 'translate3d(0px, 0px, 0px)';
        ptrElement.classList.add((classPrefix + "refresh"));

        _timeout = setTimeout(function () {
          var retval = onRefresh();

          if (retval && typeof retval.then === 'function') {
            retval.then(function (thenReturn) {
              onReset(e);
              return onRefreshAfter(thenReturn);
            });
          }

          if (!retval && !onRefresh.length) {
            onReset(e);
            onRefreshAfter();
          }
        }, refreshTimeout);
      } else {
        if (pageSettingsContainer[curPageIdName + '_' + pageRankName]._state === 'refreshing' || pageSettingsContainer[curPageIdName + '_' + pageRankName]._upload_more_state === 'refreshing') {
          return;
        }

        //ptrElement.style[cssProp] = '0px';
        if (triggerElement !== document.body) {
          triggerElement.style.transition = '0.3s ease';
          if (upLoadMore && canUpToRef() && pageSettingsContainer[curPageIdName + '_' + pageRankName]._upload_more_state === 'releasing' && distResisted > upLoadShowReleaseTipDis) {
            triggerElement.style.transform = 'translate3d(0px, 0px, 0px)';
            pageSettingsContainer[curPageIdName + '_' + pageRankName]._upload_more_state = 'refreshing';
            var $loadMore = getLoadMoreElem();
            // var loadMoreElement = $loadMore.get(0);
            // loadMoreElement.innerHTML = '<img src="' + upLoadRefingIcon + '"/>';
            // 显示正在获取新数据loading
            $loadMore.hide();
            let upRefDataLoadingElement = document.createElement('div');
            upRefDataLoadingElement.id = 'upRefDataLoadingWrap';
            upRefDataLoadingElement.style.position = 'absolute';
            upRefDataLoadingElement.style.width = '100%';
            upRefDataLoadingElement.style.bottom = '6px';
            upRefDataLoadingElement.style.textAlign = 'center';
            let upRefDataLoadingImg = document.createElement('img');
            upRefDataLoadingImg.src = 'assets/imgs/loadMore.gif';
            upRefDataLoadingImg.style.width = '40px';
            upRefDataLoadingElement.appendChild(upRefDataLoadingImg);
            triggerElement.parentNode.appendChild(upRefDataLoadingElement);
            // 开始执行加载更多操作
            _timeout = setTimeout(function () {
              var retval = onRefresh();

              if (retval && typeof retval.then === 'function') {
                retval.then(function (thenReturn) {
                  onUpLoadMoreReset(triggerElement, e);
                  return onRefreshAfter(thenReturn);
                });
              }

              if (!retval && !onRefresh.length) {
                onUpLoadMoreReset(triggerElement, e);
                onRefreshAfter();
              }
            }, refreshTimeout);
          } else {
            triggerElement.style.transform = 'translate3d(0px, 0px, 0px)';
            if (upLoadMore && canUpToRef()) {
              var $loadMore = getLoadMoreElem();
              var loadMoreElement = $loadMore.get(0);
              if (loadMoreElement) {
                loadMoreElement.innerHTML = upLoadTip;
                $loadMore.hide();
                // 移除正在获取新数据loading
                if (document.getElementById('upRefDataLoadingWrap')) {
                  $(document.getElementById('upRefDataLoadingWrap')).fadeOut(() => {
                    $(document.getElementById('upRefDataLoadingWrap')).remove();
                  });
                }
              }
              pageSettingsContainer[curPageIdName + '_' + pageRankName]._upload_more_state = 'pending';
            }
          }
        }

        pageSettingsContainer[curPageIdName + '_' + pageRankName]._state = 'pending';
      }

      _update(e);

      ptrElement.classList.remove((classPrefix + "release"));
      ptrElement.classList.remove((classPrefix + "pull"));
      if (onlyElasticity) {
        ptrAfterElement.classList.remove((classPrefix + "release"));
        ptrAfterElement.classList.remove((classPrefix + "pull"));
      }

      pullStartY = pullMoveY = null;
      dist = distResisted = 0;
      fingerDistancePriority = null;
    }

    function _onScroll(e) {
      let curPageIdName = getCurPageIdName();
      var pageRankName = getCurPageRankName(e);
      var mainElement = getTriggerElement(e); // _SETTINGS.mainElement
      var classPrefix = _SETTINGS.classPrefix;
      var shouldPullToRefresh = pageSettingsContainer[curPageIdName + '_' + pageRankName].shouldPullToRefresh;
      var triggerElement = mainElement;
      mainElement = $(triggerElement).find('div.mainContent').get(0);

      mainElement.classList.toggle((classPrefix + "top"), shouldPullToRefresh());
    }

    window.addEventListener('touchend', _onTouchEnd);
    window.addEventListener('touchstart', _onTouchStart);
    window.addEventListener('touchmove', _onTouchMove, supportsPassive ? {
        passive: _SETTINGS.passive || false
      } :
      undefined);

    window.addEventListener('scroll', _onScroll);

    // Store event handlers to use for teardown later
    return {
      onTouchStart: _onTouchStart,
      onTouchMove: _onTouchMove,
      onTouchEnd: _onTouchEnd,
      onScroll: _onScroll,
    };
  }

  function _run() {
    var mainElement = _SETTINGS.mainElement
    var getMarkup = _SETTINGS.getMarkup;
    var getStyles = _SETTINGS.getStyles;
    var classPrefix = _SETTINGS.classPrefix;
    var pageIdName = _SETTINGS.pageIdName;
    var pageRankName = _SETTINGS.pageRankName;
    var onInit = _SETTINGS.onInit;
    var pullAreaBg = _SETTINGS.pullAreaBg;
    var elasticityTopAreaBg = _SETTINGS.elasticityTopAreaBg;
    var elasticityAreaBg = _SETTINGS.elasticityAreaBg;
    var onlyElasticity = _SETTINGS.onlyElasticity;
    var upLoadMore = _SETTINGS.upLoadMore;
    var titleBarHeight = _SETTINGS.titleBarHeight;
    var footerBarHeight = _SETTINGS.footerBarHeight;
    var otherElmHeight = _SETTINGS.otherElmHeight;
    var offsetWidth = _SETTINGS.offsetWidth;
    var offsetTop = _SETTINGS.offsetTop;
    var offsetLeft = _SETTINGS.offsetLeft;
    var scrollViewHeight = _SETTINGS.scrollViewHeight;
    var refTxtColor = _SETTINGS.refTxtColor;
    var triggerElement = mainElement;
    var canSwitchSlide = _SETTINGS.canSwitchSlide;
    var switchPageRate = _SETTINGS.switchPageRate;
    mainElement = $(triggerElement).find('div.mainContent').get(0);
    if (footerBarHeight == 'auto') {
      footerBarHeight = $('div.tabbar').height();
    }
    var upLoadShowTipDis = _SETTINGS.upLoadShowTipDis;
    var upLoadShowReleaseTipDis = _SETTINGS.upLoadShowReleaseTipDis;
    var upLoadRefingDis = _SETTINGS.upLoadRefingDis;
    var upLoadTip = _SETTINGS.upLoadTip;
    var upLoadReleaseToRefTip = _SETTINGS.upLoadReleaseToRefTip;
    var upLoadRefingIcon = _SETTINGS.upLoadRefingIcon;
    // 保存各页面参数
    if (pageIdName) {
      let curPageSettings = {};

      var instructionsRefreshing = _SETTINGS.instructionsRefreshing;
      curPageSettings['instructionsRefreshing'] = instructionsRefreshing;
      var instructionsPullToRefresh = _SETTINGS.instructionsPullToRefresh;
      curPageSettings['instructionsPullToRefresh'] = instructionsPullToRefresh;
      var instructionsReleaseToRefresh = _SETTINGS.instructionsReleaseToRefresh;
      curPageSettings['instructionsReleaseToRefresh'] = instructionsReleaseToRefresh;
      curPageSettings['onlyElasticity'] = onlyElasticity;
      var shouldPullToRefresh = _SETTINGS.shouldPullToRefresh;
      var shouldUpToElasticity = _SETTINGS.shouldUpToElasticity;
      curPageSettings['shouldPullToRefresh'] = shouldPullToRefresh;
      curPageSettings['shouldUpToElasticity'] = shouldUpToElasticity;
      var canUpToRef = _SETTINGS.canUpToRef;
      curPageSettings['canUpToRef'] = canUpToRef;
      var onRefresh = _SETTINGS.onRefresh;
      var onRefreshAfter = _SETTINGS.onRefreshAfter;
      curPageSettings['onRefresh'] = onRefresh;
      curPageSettings['onRefreshAfter'] = onRefreshAfter;

      curPageSettings['upLoadMore'] = upLoadMore;
      curPageSettings['upLoadShowTipDis'] = upLoadShowTipDis;
      curPageSettings['upLoadShowReleaseTipDis'] = upLoadShowReleaseTipDis;
      curPageSettings['upLoadRefingDis'] = upLoadRefingDis;
      curPageSettings['upLoadTip'] = upLoadTip;
      curPageSettings['upLoadReleaseToRefTip'] = upLoadReleaseToRefTip;
      curPageSettings['upLoadRefingIcon'] = upLoadRefingIcon;
      curPageSettings['canSwitchSlide'] = canSwitchSlide;
      curPageSettings['switchPageRate'] = switchPageRate;

      var ignoreElements = _SETTINGS.ignoreElements;
      curPageSettings['ignoreElements'] = ignoreElements;

      var footerWaterMark = _SETTINGS.footerWaterMark;
      curPageSettings['footerWaterMark'] = footerWaterMark;

      curPageSettings['_state'] = 'pending';
      if (upLoadMore && canUpToRef()) {
        curPageSettings['_upload_more_state'] = 'pending';
      }

      pageSettingsContainer[pageIdName + '_' + pageRankName] = curPageSettings;
    }

    if (!triggerElement.querySelector(("." + classPrefix + "ptr"))) {
      var ptr = document.createElement('div');
      ptr.style.position = 'absolute';
      var ptrAfter = document.createElement('div');

      triggerElement.parentNode.insertBefore(ptr, triggerElement);
      ptrAfter.style.position = 'absolute';
      ptrAfter.style.left = offsetLeft + 'px';
      ptrAfter.style.zIndex = -1;
      ptrAfter.style.display = 'none';
      if (offsetWidth > 0 && offsetLeft > 0) {
        ptrAfter.style.width = offsetWidth + 'px';
      }
      let pageHeight = $(triggerElement).parents('ion-content').get(0).clientHeight;
      if (canSwitchSlide) {
        let switchPageHeight = $(triggerElement).parents('switch-page').get(0).clientHeight;
        ptrAfter.style.height = (switchPageHeight) + 'px';
      } else {
        if (scrollViewHeight > 0 && scrollViewHeight < pageHeight) {
          ptrAfter.style.height = (scrollViewHeight) + 'px';
        } else {
          if ($.inArray(pageIdName, ['page-task', 'page-about']) >= 0) {
            ptrAfter.style.height = (pageHeight - titleBarHeight - offsetTop - Number(otherElmHeight)) - footerBarHeight + 'px';
          } else {
            ptrAfter.style.height = (pageHeight - titleBarHeight - offsetTop - Number(otherElmHeight)) + 'px';
          }
        }
      }
      // 在底部背景区域增加加载更多的文本提示
      if (upLoadMore) {
        var loadMore = document.createElement('div');
        loadMore.style.position = 'absolute';
        loadMore.classList.add('loadMore');
        loadMore.innerHTML = upLoadTip;
        loadMore.style.width = '100%';
        loadMore.style.textAlign = 'center';
        loadMore.style.fontSize = '1.38rem';
        loadMore.style.fontWeight = 'normal';
        loadMore.style.bottom = '1rem';
        loadMore.style.display = 'none';
        loadMore.style.color = '#4B4B4B';
        loadMore.style.textShadow = '0px 0px 2px rgba(77, 77, 77, .4)';
        ptrAfter.appendChild(loadMore);
      }
      // 在底部背景区域增加水印
      if (!upLoadMore && pageIdName && pageSettingsContainer[pageIdName + '_' + pageRankName].footerWaterMark) {
        var footerWaterMark = document.createElement('div');
        footerWaterMark.style.position = 'absolute';
        footerWaterMark.classList.add('footerWaterMark');
        footerWaterMark.innerHTML = pageSettingsContainer[pageIdName + '_' + pageRankName].footerWaterMark;
        footerWaterMark.style.width = '100%';
        footerWaterMark.style.textAlign = 'center';
        footerWaterMark.style.fontSize = '1.2rem';
        footerWaterMark.style.fontWeight = 'normal';
        footerWaterMark.style.bottom = '2rem';
        footerWaterMark.style.color = '#9d9d9d';
        footerWaterMark.style.textShadow = '0px 0px 2px rgba(88, 88, 88, .2)';
        ptrAfter.appendChild(footerWaterMark);
      }
      mainElement.parentNode.parentNode.appendChild(ptrAfter);
      $(ptrAfter).fadeIn();
      if (triggerElement !== document.body) {
        triggerElement.style.transition = '';
        triggerElement.style.transform = 'translate3d(0px, 0px, 0px)';
      }
      if (canSwitchSlide) {
        let switchPageHeight = $(triggerElement).parents('switch-page').get(0).clientHeight;
        triggerElement.style.height = (switchPageHeight) + 'px';
      } else {
        if (scrollViewHeight > 0 && scrollViewHeight < pageHeight) {
          triggerElement.style.height = (scrollViewHeight) + 'px';
        } else {
          if ($.inArray(pageIdName, ['page-task', 'page-about']) >= 0) {
            triggerElement.style.height = (pageHeight - titleBarHeight - offsetTop - Number(otherElmHeight)) - footerBarHeight + 'px';
          } else {
            triggerElement.style.height = (pageHeight - titleBarHeight - offsetTop - Number(otherElmHeight)) + 'px';
          }
        }
      }
      triggerElement.style.overflowX = 'hidden';
      triggerElement.style.overflowY = 'auto';
      triggerElement.parentNode.style.position = 'relative';
      triggerElement.parentNode.style.overflow = 'hidden';

      if (!onlyElasticity) {
        ptr.innerHTML = getMarkup()
          .replace(/__PREFIX__/g, classPrefix);
      }

      ptr.classList.add((classPrefix + "ptr"));
      ptrAfter.classList.add(classPrefix + "ptr");
      ptrAfter.classList.add(classPrefix + "ptr-after");
      _SETTINGS.ptrAfterElement = ptrAfter;

      _SETTINGS.ptrElement = ptr;

      // 绑定事件
      if (canSwitchSlide) {
        if ($('switch-pages').find('div.switchTabSlideRail').find('span.switchTabItem').length > 0) {
          $('switch-pages').find('div.switchTabSlideRail').off('click');
          $('switch-pages').find('div.switchTabSlideRail').on('click', 'span.switchTabItem', function () {
            switchRailItemClickFn(this);
          });
        }
      }
    }

    // 点击切换页选项卡项目
    var switchRailItemClickFn = function (e) {
      var switchCurTabElement = getSwitchCurTabElement({
        target: $(e).get(0)
      }, $(e).index());
      var curSelectSwitchTabIndex = $('switch-pages:visible').find('div.switchTabSlideRail').find('span.switchTabItemSelected').index();
      var switchPageCount = $('switch-pages:visible').find('switch-page').length;
      var switchPageWrapCurTransform = getSwitchPageWrapCurTransform({
        target: $($(e).parents('switch-pages:visible').find('scrollview')[0]).get(0)
      }, 0);
      var switchPageScreenWidth = document.body.clientWidth;
      var switchPageWrapElement = $('switch-pages:visible').find('div.switchTabsWrap').get(0);
      var switchTabSlideRailElement = getSwitchTabSlideRailElement({
        target: $(e).get(0)
      });
      var switchPageIndicatorElement = getSwitchPageIndicatorElement({
        target: $(e).get(0)
      });
      if ($(e).index() > curSelectSwitchTabIndex) {
        switchPageWrapElement.style.transition = '0.4s ease';
        setTimeout(function () {
          switchPageWrapElement.style.transition = '0s';
        }, 0.4 * 1000);
        startTramformX = Number(-($(e).index() * switchPageScreenWidth));
        switchPageWrapElement.style.transform = 'translate3d(' + startTramformX + 'px, 0px, 0px)';
        // 滑动指示器向下
        // 判断是否需要将指示器选项卡轨道进行位置移动
        var switchTabSlideRailCurTransform = getSwitchTabSlideRailCurTransform({
          target: $(e).get(0)
        }, 0);
        switchTabSlideRailCurTransform = switchTabSlideRailCurTransform ? switchTabSlideRailCurTransform : 0;
        if (switchPageCount > splitPageShowNum && switchTabSlideRailCurTransform > -((switchPageCount - splitPageShowNum) * Number(switchPageIndicatorElement.clientWidth))) {
          let railTramformX = Number(switchTabSlideRailCurTransform) - ($(e).index() - curSelectSwitchTabIndex) * Number(switchPageIndicatorElement.clientWidth) < -((switchPageCount - splitPageShowNum) * Number(switchPageIndicatorElement.clientWidth)) ? -((switchPageCount - splitPageShowNum) * Number(switchPageIndicatorElement.clientWidth)) : Number(switchTabSlideRailCurTransform) - ($(e).index() - curSelectSwitchTabIndex) * Number(switchPageIndicatorElement.clientWidth);
          switchTabSlideRailElement.style.transform = 'translate3d(' + railTramformX + 'px, 0px, 0px)';
          if ($(e).index() - curSelectSwitchTabIndex > switchPageCount - splitPageShowNum) {
            let indicatorTramformX = ($(e).index() - curSelectSwitchTabIndex - (switchPageCount - splitPageShowNum)) * switchPageIndicatorElement.clientWidth;
            switchPageIndicatorElement.style.transform = 'translate3d(' + indicatorTramformX + 'px, 0px, 0px)';
          }
        } else {
          let indicatorTramformX = 0;
          if (switchPageCount > splitPageShowNum) {
            indicatorTramformX = ($(e).index() - (switchPageCount - splitPageShowNum)) * switchPageIndicatorElement.clientWidth;
          } else {
            indicatorTramformX = $(e).index() * switchPageIndicatorElement.clientWidth;
          }
          switchPageIndicatorElement.style.transform = 'translate3d(' + indicatorTramformX + 'px, 0px, 0px)';
        }
      } else if ($(e).index() < curSelectSwitchTabIndex) {
        switchPageWrapElement.style.transition = '0.4s ease';
        setTimeout(function () {
          switchPageWrapElement.style.transition = '0s';
        }, 0.4 * 1000);
        startTramformX = Number(-($(e).index() * switchPageScreenWidth));
        switchPageWrapElement.style.transform = 'translate3d(' + startTramformX + 'px, 0px, 0px)';
        // 滑动指示器向上
        // 判断是否需要将指示器选项卡轨道进行位置移动
        var switchTabSlideRailCurTransform = getSwitchTabSlideRailCurTransform({
          target: $(e).get(0)
        }, 0);
        if (switchPageCount > splitPageShowNum && switchTabSlideRailCurTransform < 0) {
          let railTramformX = Number(switchTabSlideRailCurTransform) + (curSelectSwitchTabIndex - $(e).index()) * Number(switchPageIndicatorElement.clientWidth) > 0 ? 0 : Number(switchTabSlideRailCurTransform) + (curSelectSwitchTabIndex - $(e).index()) * Number(switchPageIndicatorElement.clientWidth);
          switchTabSlideRailElement.style.transform = 'translate3d(' + railTramformX + 'px, 0px, 0px)';
          if (curSelectSwitchTabIndex - $(e).index() > switchPageCount - splitPageShowNum) {
            let indicatorTramformX = ($(e).index() + splitPageShowNum - curSelectSwitchTabIndex) * switchPageIndicatorElement.clientWidth;
            switchPageIndicatorElement.style.transform = 'translate3d(' + indicatorTramformX + 'px, 0px, 0px)';
          }
        } else {
          let indicatorTramformX = $(e).index() * switchPageIndicatorElement.clientWidth;
          switchPageIndicatorElement.style.transform = 'translate3d(' + indicatorTramformX + 'px, 0px, 0px)';
        }
      }
      $(switchCurTabElement).siblings().removeClass('switchTabItemSelected');
      $(switchCurTabElement).addClass('switchTabItemSelected');
    };

    // Add the css styles to the style node, and then
    // insert it into the dom
    // ========================================================
    var styleEl;
    let pageIdNameForStyle = '';
    pageIdName != '' ? pageIdNameForStyle = pageIdName + '-' : {};
    let styleId = pageIdNameForStyle + 'pull-to-refresh-js-style';
    if (!document.querySelector('#' + styleId)) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('id', styleId);

      document.head.appendChild(styleEl);
    } else {
      styleEl = document.querySelector('#' + styleId);
    }

    styleEl.textContent = getStyles()
      .replace(/_PAGE_ID_ABOUT_/g, pageIdName)
      .replace(/__PREFIX__/g, classPrefix)
      .replace(/\s+/g, ' ');
    if (refTxtColor) {
      styleEl.textContent = styleEl.textContent.replace(/_REF_TXT_TIP_COLOR_/g, refTxtColor);
    } else {
      styleEl.textContent = styleEl.textContent.replace(/_REF_TXT_TIP_COLOR_/g, 'rgba(252, 252, 252, 0.8)');
    }
    if (!onlyElasticity && pullAreaBg && pullAreaBg != '') {
      styleEl.textContent = styleEl.textContent.replace(/__PULLWRAPBG__/g, 'background: ' + pullAreaBg + ';');
    } else {
      if (onlyElasticity && elasticityTopAreaBg && elasticityTopAreaBg != '') {
        styleEl.textContent = styleEl.textContent.replace(/__PULLWRAPBG__/g, 'background: ' + elasticityTopAreaBg + ';');
      } else {
        styleEl.textContent = styleEl.textContent.replace(/__PULLWRAPBG__/g, '');
      }
    }
    if (elasticityAreaBg && elasticityAreaBg != '') {
      styleEl.textContent = styleEl.textContent.replace(/__PULLAFTERBG__/g, 'background: ' + elasticityAreaBg + ' !important;');
    } else {
      styleEl.textContent = styleEl.textContent.replace(/__PULLAFTERBG__/g, 'background: none !important;');
    }
    if (onlyElasticity) {
      styleEl.textContent = styleEl.textContent.replace(/__PULLWRAPBOXSHADOW__/g, '');
    } else {
      styleEl.textContent = styleEl.textContent.replace(/__PULLWRAPBOXSHADOW__/g, 'box-shadow: inset 0 -3px 10px rgba(0, 0, 0, 0.12);');
    }

    if (typeof onInit === 'function') {
      onInit(_SETTINGS);
    }

    // 页面加载完成
    _SETTINGS.pageLoadFinish();

    return {
      styleNode: styleEl,
      ptrElement: _SETTINGS.ptrElement,
      ptrAfterElement: _SETTINGS.ptrAfterElement
    };
  }

  var pulltorefresh = {
    init: function init(options) {
      if (options === void 0) options = {};

      var handlers;
      Object.keys(_defaults).forEach(function (key) {
        if (typeof _defaults[key] == 'boolean' && typeof options[key] != 'undefined') {
          _SETTINGS[key] = options[key];
        } else {
          _SETTINGS[key] = options[key] || _defaults[key];
        }
      });

      var methods = ['mainElement', 'ptrElement', 'triggerElement'];
      methods.forEach(function (method) {
        if (typeof _SETTINGS[method] === 'string') {
          _SETTINGS[method] = document.querySelector(_SETTINGS[method]);
        }
      });

      if (!_setup) {
        handlers = new _setupEvents();
        _setup = true;
      }

      var ref = _run();
      var styleNode = ref.styleNode;
      var ptrElement = ref.ptrElement;

      return {
        destroy: function destroy() {
          // Teardown event listeners
          window.removeEventListener('touchstart', handlers.onTouchStart);
          window.removeEventListener('touchend', handlers.onTouchEnd);
          window.removeEventListener('touchmove', handlers.onTouchMove, supportsPassive ? {
              passive: _SETTINGS.passive || false
            } :
            undefined);
          window.removeEventListener('scroll', handlers.onScroll);

          // Remove ptr element and style tag
          styleNode.parentNode.removeChild(styleNode);
          ptrElement.parentNode.removeChild(ptrElement);

          // Enable setupEvents to run again
          _setup = false;

          // null object references
          handlers = null;
          styleNode = null;
          ptrElement = null;
          _SETTINGS = {};
        },
      };
    }
  };
  return pulltorefresh;
}());
