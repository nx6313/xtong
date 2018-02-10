(function () {
  let that = this;

  function init() {
    // 创建Picker选取DOM
    if (!document.getElementById('pickerSelectWrap')) {
      var pickerSelectWrap = document.createElement('div');
      pickerSelectWrap.id = 'pickerSelectWrap';
      document.body.appendChild(pickerSelectWrap);
    }
  }

  function show() {

  }

  window.Picker = {
    init: init,
    show: show
  };
})();
