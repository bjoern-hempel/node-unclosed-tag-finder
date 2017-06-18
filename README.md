# node-unclosed-tag-finder

> A library that finds unclosed html5 tags, that are normally optional.

## Install

```
$ npm install unclosed-tag-finder
```

## Usage

```js
#!/usr/bin/env node

/* load some libraries */
var unclosedTagFinder = require('unclosed-tag-finder');
var fs = require('fs');

var finder = new unclosedTagFinder.builder();

/* check command line arguments */
if (process.argv.length < 3) {
    console.error('No file to validate was given. Abort..');
    process.exit(1);
}

/* read given file */
fs.readFile(process.argv[2], 'utf-8', function(err, html) {                                                                                                                                               
    if (err) {
        console.log(err);
        process.exit(1);
        return;
    }   

    var unclosedTags = finder.getUnclosedTags(html);

    finder.printUnclosedTags(unclosedTags);
});
```
