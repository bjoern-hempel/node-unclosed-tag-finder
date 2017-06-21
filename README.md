# Unclosed Tag Finder

A library that finds unclosed html5 tags that are normally optional (via W3C check). These optional tags could be:

- html
- head
- body
- p
- dt
- dd
- li
- option
- thead
- th
- tbody
- tr
- td
- tfoot
- colgroup

## Installation

```
user$ npm install unclosed-tag-finder -g
```

## Usage (the command line version)

### Create a valid html5 file (but with some unclosed tags)

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

### Check the html5 file with a w3c checker of your choice

```
user$ npm install html-validator-cli -g
user$ html-validator --file=w3cValid.html 
Page is valid
```

or

```
user$ xmllint --html --noout w3cValid.html
```

The page is valid.

### Find unclosed tags within this valid html5 file

```
user$ unclosed-tag-finder w3cValid.html                                                                  
codequality/valid-utf8-unclosed.html:7 (missing close tag: <p/>)
<p>

codequality/valid-utf8-unclosed.html:8 (missing close tag: <p/>)
<p>

codequality/valid-utf8-unclosed.html:10 (missing close tag: <li/>)
<li>
```

Although the html file is valid, we found some unclosed html5 tags.

## Use this library inside your own scripts

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

    if (unclosedTags.length == 0) {
        return;
    }   

    /* prints out missing close tag issues */
    for (var i = 0; i < unclosedTags.length; i++) {
        if (unclosedTags[i].hasNoCloseTag) {
            console.info(unclosedTags[i].filename + ':' + unclosedTags[i].line + ' (missing close tag: <' + unclosedTags[i].name + '/>)');
            console.info(unclosedTags[i].tag);
            console.info('');
        }
    }

    /* prints out missing open tag issues */
    for (var i = 0; i < unclosedTags.length; i++) {
        if (unclosedTags[i].hasNoOpenTag) {
            console.info(unclosedTags[i].filename + ':' + unclosedTags[i].line + ' (missing open tag: <' + unclosedTags[i].name + '>)');
            console.info(unclosedTags[i].tag);
            console.info('');
        }
    }
});
```

```
user$ chmod 775 listUnclosedTags.js
```

Now check the file with the listUnclosedTags.js script:

```
user$ ./listUnclosedTags.js w3cValid.html
codequality/valid-utf8-unclosed.html:7 (missing close tag: <p/>)
<p>

codequality/valid-utf8-unclosed.html:8 (missing close tag: <p/>)
<p>

codequality/valid-utf8-unclosed.html:10 (missing close tag: <li/>)
<li>
```

## More informations and source code

More informations and the source code you will find at [GitHub](https://github.com/bjoern-hempel/node-unclosed-tag-finder)

## License

ISC © [Björn Hempel](https://www.ixno.de)

