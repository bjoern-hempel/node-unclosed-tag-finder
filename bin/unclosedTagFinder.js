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
        console.info('Congratulations! No unclosed tags.');
    } else {
        if (unclosedTags.length == 1) {
            console.info('The following tag doesn\'t seem to be closed');
        } else {
            console.info('The following tags don\'t seem to be closed');
        }

        for (var i = 0; i < unclosedTags.length; i++) {
            console.info('line ' + unclosedTags[i].line + ': ' + unclosedTags[i].full);
        }
    }
});

