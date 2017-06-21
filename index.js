/**
 * An unclosed html tag finder.
 *
 * @author Björn Hempel <bjoern.hempel@ressourcenmangel.de>
 * @constructor
 */
exports.builder = function() { };

/* A list of self closing tags (do not add this tag to unclosed tags).
 *
 */
exports.builder.prototype.selfClosingTags = [
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'script',
    'source',
    'track',
    'wbr'
];

exports.builder.prototype.getUnclosedTags = function(html, filename) {

    var unclosedTags = [];

    var lines = html.split('\n');

    /* saves all tags that where found at the html variable */
    var tags = [];

    /* scan each line */
    for (var i = 0; i < lines.length; i++) {

        /* find opening and closing html tags */
        var matchedTags = lines[i].match(/<[^>]*[^/]>/g) || [];

        for (var j = 0; j < matchedTags.length; j++) {

            var matchedTag = matchedTags[j];

            var matches = matchedTag.match(/<\/?([a-z0-9]+)/i);

            if (matches) {
                tags.push({
                    tag: matchedTag,
                    name: matches[1],
                    line: i + 1,
                    closing: matchedTag[1] === '/'
                });
            }
        };
    };

    /* no html tags found */
    if (tags.length == 0) {
        return unclosedTags;
    }

    var openTags = [];

    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];

        /* we do have a closing tag element */
        if (tag.closing) {
            var closingTag = tag;

            /* do not check this tag */
            if (this.isSelfClosing(closingTag.name)) {
                continue;
            }

            /* noOpenTagFound: no open tags found */
            if (openTags.length == 0) {
                unclosedTags.push({
                    tag: closingTag.tag,
                    name: closingTag.name,
                    filename: filename ? filename : null,
                    line: closingTag.line,
                    hasNoCloseTag: false,
                    hasNoOpenTag: true
                });
                continue;
            }

            var openTag = openTags[openTags.length - 1];

            /* noOpenTagFound: close tag does not match with the last open tag */
            if (closingTag.name !== openTag.name) {

                var foundOpeningTag = false;

                for (var j = openTags.length - 1; j >= 0; j--) {
                    var currentOpenTag = openTags[j];

                    /* we found the open tag that matches with the closing tag element */
                    if (closingTag.name === currentOpenTag.name) {
                        foundOpeningTag = true;
                        openTags.pop();
                        break;
                    }

                    /* until we havn't found the opening element, all following tags are specified as unclosed */
                    unclosedTags.push({
                        tag: currentOpenTag.tag,
                        name: currentOpenTag.name,
                        filename: filename ? filename : null,
                        line: currentOpenTag.line,
                        hasNoCloseTag: true,
                        hasNoOpenTag: false
                    });

                    openTags.pop();
                }

                if (!foundOpeningTag) {
                    unclosedTags.push({
                        tag: closingTag.tag,
                        name: closingTag.name,
                        filename: filename ? filename : null,
                        line: closingTag.line,
                        hasNoCloseTag: false,
                        hasNoOpenTag: true
                    });
                }

                continue;

            /* openTagFound: remove last open tag */
            } else {
                openTags.pop();
            }

        /* we do have an opening tag element */
        } else {

            var openingTag = tag;

            /* do not check this tag */
            if (this.isSelfClosing(openingTag.name)) {
                continue;
            }

            /* add opening tag to our openTags list */
            openTags.push(openingTag);
        }
    }

    /* we do have some open tags over */
    if (openTags.length > 0) {
        for (var i = 0; i < openTags.length; i++) {
            var tag = openTags[i];

            unclosedTags.push({
                tag: tag.tag,
                name: tag.name,
                filename: filename ? filename : null,
                line: tag.line,
                hasNoCloseTag: true,
                hasNoOpenTag: false
            });
        }
    }

    /* sort unclosedTags list */
    unclosedTags.sort(
        function(a, b) {
            return (a.line > b.line) ? 1 : ((b.line > a.line) ? -1 : 0);
        }
    );

    return unclosedTags;
};

/**
 * Check, if given tag is self closing.
 *
 */
exports.builder.prototype.isSelfClosing = function(tagName) {

    for (var i = 0; i < this.selfClosingTags.length; i++) {
        if (this.selfClosingTags[i].localeCompare(tagName) == 0) {
            return true;
        }
    }

    return false;
};

/**
 * Prints the given unclosed tag variable.
 *
 * @param {Array} unclosedTags An array of unclosed tags.
 */
exports.builder.prototype.printUnclosedTags = function(unclosedTags) {

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
};
