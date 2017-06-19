# node-unclosed-tag-finder

> A library that finds unclosed html5 tags, that are normally optional.

## Install

```
$ npm install unclosed-tag-finder
```

## Usage

```
user$ npm install unclosed-tag-finder
user$ vi listUnclosedTags.js
```

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

```
user$ chmod 775 listUnclosedTags.js
user$ ./listUnclosedTags.js test.html 
The following tags don't seem to be closed
line 7: <p>
line 8: <p>
line 10: <li>
```

## Example

Create a W3C valid html5 file (but with some unclosed tags):

```
user$ vi w3cValid.html
```

```
<!DOCTYPE html>
<html>
    <head>
        <title>test</title>
    </head>
    <body>
        <p>123
        <p>456
        <ul>
            <li>123                                                                                                                                                                                       
        </ul>
    </body>
</html>
```

Install a W3C checker and check the file:

```
user$ npm install html-validator-cli -g
user$ html-validator --file=w3cValid.html 
Page is valid
```

The page is valid. Now check the file with the listUnclosedTags.js script (see #Usage):

```
user$ ./listUnclosedTags.js test.html 
The following tags don't seem to be closed
line 7: <p>
line 8: <p>
line 10: <li>
```
