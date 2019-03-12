const h = require('hangul-js');


var TextTypingAnimation = (function () {
  var defaultOptions = {
    delay: 100,
    duration: null,
    append: false
  };

  var TYPE_GO = 0;
  var TYPE_BACK = 1;
  var TYPE_DELAY = 2;
  var TYPE_CLEAR = 3;

  function TextTypingAnimation(element) {
    this._init(element);
  }

  function calcDelayByDuration(duration, textLen) {
    return duration / textLen;
  }

  function writeText(writeTextArr) {
    var that = this;
    var element = this.element;
    var step = this.step[0];
    var delay = step.delay;
    var duration = step.duration;

    var writeTextArrLen = writeTextArr.length;
    if (writeTextArrLen > 0) {
      if (duration) {
        delay = calcDelayByDuration(duration, writeTextArrLen);
      }

      var count = 0;
      var interval = setInterval(function () {
        element.innerHTML = writeTextArr[count].replace(/\n/gi, '<br>');
        count++;
        
        if (count === writeTextArrLen) {
          clearInterval(interval);
          that.step.shift();
          that._isProceccing = false;
          that.text = element.innerHTML.replace(/(<br>)/gm, '\n');
          execute.call(that);
        }
      }, delay);
    }
  }

  function execute() {
    var _isProceccing = this._isProceccing;
    if (_isProceccing || this.step.length === 0) return false;

    this._isProceccing = true;
    var type = this.step[0].type;

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
    var step = this.step[0];
    var isAppend = step.append;
    var strs;
    var writeTextArr = [];
    if (typeof step === 'string')
      strs = step;
    else {
      strs = step.text;
    }
    
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
    var step = this.step[0];
    var strs;
    var writeTextArr = [];
    if (typeof step === 'string')
      strs = step;
    else {
      strs = step.text;
    }
    
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
    var step = this.step[0];
    var delay = step.delay;

    setTimeout(function () {
      that.step.shift();
      that._isProceccing = false;
      execute.call(that);
    }, delay);
  }

  function clear() {
    this.step.shift();
    this.text = '';
    this.element.innerHTML = '';
    this._isProceccing = false;
    execute.call(this);
  }

  TextTypingAnimation.prototype._init = function (element) {
    this.element = element;
    this.step = [];
    this.text = '';
    this._isProceccing = false;
  };

  TextTypingAnimation.prototype._initStep = function (obj) {
    var step = {
      delay: obj.delay || defaultOptions.delay,
      duration: obj.duration || defaultOptions.duration,
      append: obj.append || defaultOptions.append,
      text: obj.text,
      type: obj.type
    };

    this.step.push(step);
    execute.call(this);
  };

  TextTypingAnimation.prototype.go = function (obj) {
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

  TextTypingAnimation.prototype.clear = function () {
    obj = { 
      type: TYPE_CLEAR
    };
    this._initStep(obj);
    return this;
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