const h = require('hangul-js');

var TextTypingAnimation = (function () {
  var defaultOptions = {
    start: true,
    repeat: false
  };
  
  var defaultStep = {
    delay: 100,
    duration: null,
    append: false,
  };

  var TYPE_GO = 0;
  var TYPE_BACK = 1;
  var TYPE_DELAY = 2;
  var TYPE_CLEAR = 3;

  var STATUS_START = 'START';
  var STATUS_PAUSE = 'PAUSE';
  var STATUS_WAIT = 'WAIT';

  function TextTypingAnimation(element, options) {
    if (!element) {
      console.error('TypeTypingAnimation: not exist element');
      return false;
    }

    this._init(element, options);
  }

  function calcDelayByDuration(duration, textLen) {
    return duration / textLen;
  }

  function writeText(writeTextArr) {
    var that = this;
    var element = this.element;
    var step = this.activeStep;
    var delay = step.delay;
    var duration = step.duration;

    var writeTextArrLen = writeTextArr.length;
    if (writeTextArrLen > 0) {
      if (duration) {
        delay = calcDelayByDuration(duration, writeTextArrLen);
      }

      var count = 0;
      this.interval = setInterval(function () {
        if (that.status === STATUS_PAUSE) {
          return true;
        }
        
        that.status = STATUS_START;

        element.innerHTML = writeTextArr[count].replace(/\n/gi, '<br>');
        count++;
        
        if (count === writeTextArrLen) {
          clearInterval(that.interval);
          that.interval = null;
          that._isProcessing = false;
          that.text = element.innerHTML.replace(/(<br>)/gm, '\n');
          execute.call(that);
        }
      }, delay);
    }
  }

  function execute() {
    var _isProcessing = this._isProcessing;
    if (_isProcessing || this.steps.length === 0 || this.options.start === false) return false;

    this.activeIndex++;
    if (!this.steps[this.activeIndex]) {
      var initRepeat = this.initOptions.repeat;
      if (initRepeat === false) {
        return false;
      }

      if (initRepeat === true) {
        this.activeIndex = 0;
      } else if (typeof initRepeat === 'number') {
        if (this.options.repeat + 1 === initRepeat) {
          return false;
        }

        this.options.repeat++;
        this.activeIndex = 0;
      }
    }

    this.activeStep = this.steps[this.activeIndex];

    this._isProcessing = true;
    var type = this.activeStep.type;

    switch(type) {
      case TYPE_GO: 
        go.call(this);
        break;
      case TYPE_BACK:
        back.call(this);
        break;
      case TYPE_DELAY:
        delay.call(this);
        break;
      case TYPE_CLEAR:
        clear.call(this);
        break;
    }
  }

  function go() {
    var step = this.activeStep;
    var isAppend = step.append;
    var writeTextArr = [];
    var strs = step.text;

    var strSplit= strs.split('\n');
    var newStrList = [];
    strSplit.forEach(function (str) {
      newStrList.push(h.disassemble(str, true));
    });

    var newStr = isAppend === true ? this.text : '';
    for (var i = 0, newStrListLen = newStrList.length; i < newStrListLen; i++) {
      var cvsList = newStrList[i];

      if (i !== 0) {
        newStr += '<br>';
      }

      for (var j = 0, cvsListLen = cvsList.length; j < cvsListLen; j++) {
        var cvsItem = cvsList[j];
        var char = '';

        for (var k = 0, cvsItemLen = cvsItem.length; k < cvsItemLen; k++) {
          char = h.assemble(cvsItem.slice(0, k + 1));
          var tmpStr = newStr + char;
          writeTextArr.push(tmpStr);
        }
        
        newStr += char;
      }
    }

    writeText.call(this, writeTextArr);
  }

  function back() {
    var step = this.activeStep;
    var strs;
    var writeTextArr = [];
    if (typeof step === 'string')
      strs = step;
    else if (step.text !== undefined)
      strs = step.text;
    else
      strs = this.text;
    
    var strSplit = strs.split('\n');
    var newStrList = [];
    strSplit.forEach(function (str) {
      newStrList.push(h.disassemble(str, true));
    });

    for (var i = newStrList.length - 1; i >= 0; i--) {
      var maintainStr = this.text.substring(0, this.text.indexOf(strSplit[i]));
      var cvsList = newStrList[i];

      for (var j = cvsList.length - 1; j >= 0; j--) {
        var cvsItem = cvsList[j];
        var char = '';
        var substringText = strSplit[i].substring(0, j);

        for (var k = cvsItem.length - 1; k >= 0; k--) {
          char = h.assemble(cvsItem.slice(0, k));
          var tmpStr = maintainStr + substringText + char;

          if (i === newStrList.length - 1 && j === cvsList.length - 1)
            writeTextArr.push(tmpStr);
          else if (k === 0) {
            writeTextArr.push(tmpStr);
          }
        }
      }
    }

    writeText.call(this, writeTextArr);
  }

  function delay() {
    var that = this;
    var step = this.activeStep;
    var delay = step.delay;

    setTimeout(function () {
      that._isProcessing = false;
      execute.call(that);
    }, delay);
  }

  function clear() {
    this.text = '';
    this.element.innerHTML = '';
    this._isProcessing = false;
    execute.call(this);
  }

  TextTypingAnimation.prototype._init = function (element, options) {
    if (!options) { options = {}; }

    this.element = element;
    this.text = '';
    this.interval = null;
    this.status = STATUS_WAIT;
    this.steps = [];
    this.activeStep = null;
    this.activeIndex = -1;
    options.start = options.start === false ? options.start : defaultOptions.start;
    options.repeat = typeof options.repeat !== 'undefined' ? options.repeat : defaultOptions.repeat;
    this.initOptions = JSON.parse(JSON.stringify(options));
    this.options = options;
    this.options.repeat = 0;
    this._isProcessing = false;
  };

  TextTypingAnimation.prototype._initStep = function (obj) {
    if (!this.element) {
      return false;
    }

    var step = {
      delay: obj.delay || defaultStep.delay,
      duration: obj.duration || defaultStep.duration,
      append: obj.append || defaultStep.append,
      text: obj.text,
      type: obj.type
    };

    if (obj.type === TYPE_CLEAR && obj.duration) {
      step.type = TYPE_BACK;
    }

    this.steps.push(step);
    execute.call(this);
  };

  TextTypingAnimation.prototype.go = function (obj) {
    if (typeof obj === 'string') {
      obj = {
        text: obj
      };
    }

    obj.type = TYPE_GO;
    this._initStep(obj);
    return this;
  };

  TextTypingAnimation.prototype.back = function (obj) {
    obj.type = TYPE_BACK;
    this._initStep(obj);
    return this;
  };

  TextTypingAnimation.prototype.delay = function (delay) {
    obj = { 
      type: TYPE_DELAY,
      delay: delay
    };
    this._initStep(obj);
    return this;
  };

  TextTypingAnimation.prototype.clear = function (duration) {
    obj = { 
      type: TYPE_CLEAR,
      duration: duration ? duration : undefined
    };
    this._initStep(obj);
    return this;
  };

  TextTypingAnimation.prototype.start = function () {
    this.options.start = true;
    execute.call(this);
  };

  TextTypingAnimation.prototype.stop = function () {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this._isProcessing = false;
    this.activeIndex = -1;
    this.activeStep = null;
    this.status = STATUS_WAIT;
    this.options.start = false;
    execute.call(this);
  };

  TextTypingAnimation.prototype.pause = function () {
    this.status = STATUS_PAUSE;
  };

  TextTypingAnimation.prototype.restart = function () {
    this.status = STATUS_START;
  };

  return TextTypingAnimation;
})();

if (typeof define == 'function' && define.amd) {
  define(function(){
    return TextTypingAnimation;
  });
} else if (typeof module !== 'undefined') {
  module.exports = TextTypingAnimation;
} else {
  window.TextTypingAnimation = TextTypingAnimation;
}