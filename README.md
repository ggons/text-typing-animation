# Introduction

TextTypingAnimation is a library for typing effects.

## Install

### node.js
```bash
npm install text-typing-animation
```
```javascript
var TextTypingAnimation = require('text-typing-animation');
```

## Usage

```javascript
var tta = new TextTypingAnimation(document.getElementById('tta'));
tta
  .go({
    text: 'Hello World!',
    duration: 500
  })
  .go({
    text: '\nText Typing Animation',
    delay: 100
  })
  .back({
    text: 'Typing Animation'
    delay: 200
  });
```



## Option
* `repeat` - to be
* `start` - (Boolean) Whether to run immediately (default: true)


## API

### go({ text, [delay], [duration], [append] })
* `text` - (String) Text
* `delay` - (Number) Time entered per text (default: 100)
* `duration` - (Number) A Number determining how long the animation will run
* `append` - (Boolean) Whether to append to the string entered

### back({ text, [delay], [duration] })
* `text` - (String) Text to delete
* `delay` - (Number) Time deleted per text (default: 100)
* `duration` - (Number) A number determining how long the animation will run

### delay(delay)
* `delay` - (Number) Delay

### clear([duration])
* `duration` - Duration

### start()

### pause()

### restart()

### stop
to be