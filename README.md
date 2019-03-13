# Introduction

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


## API

### go
* `text` - Text
* `delay` - Time entered per text
* `duration` - A Number determining how long the animation will run
* `append` - Whether to append to the string entered

### back
* `text` - Text to delete
* `delay` - Time deleted per text
* `duration` - A number determining how long the animation will run

### delay
* `delay` - Delay

### clear