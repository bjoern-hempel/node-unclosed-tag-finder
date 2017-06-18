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
    'meta',
    'param',
    'source',
    'track',
    'wbr'
];

/**
 * Finds unclosed tag and returns them (validation).
 *
 * @param {String} html The html string to validate.
 */
exports.builder.prototype.getUnclosedTags = function(html) {

    var unclosedTags = [];

    var lines = html.split('\n');

    for (var i = 0; i < lines.length; i++) {
        var matchedTags = lines[i].match(/<(\/{1})?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)>/g);

        if (matchedTags) {
            for (var j = 0; j < matchedTags.length; j++) {
                /* remove already closed tags from unclosedTags */
                if (matchedTags[j].indexOf('</') >= 0) {
                    var closeTagName = matchedTags[j].substr(2, matchedTags[j].length - 3);
                    closeTagName = closeTagName.replace(/ /g, '');

                    for (var k = unclosedTags.length - 1; k >= 0; k--) {
                        if (unclosedTags[k].element === closeTagName) {
                            /* remove tag */
                            unclosedTags.splice(k, 1);

                            if (closeTagName !== 'html') {
                                break;
                            }
                        }
                    }

                /* add open tags to unclosedTags */
                } else {
                    var unclosedTag = {};

                    unclosedTag.full = matchedTags[j];
                    unclosedTag.line = i + 1;

                    if (unclosedTag.full.indexOf(' ') > 0) {
                        unclosedTag.element = unclosedTag.full.substr(1, unclosedTag.full.indexOf(' ') - 1);
                    } else {
                        unclosedTag.element = unclosedTag.full.substr(1, unclosedTag.full.length - 2);
                    }

                    if (this.isSelfClosing(unclosedTag.element) === false) {
                        unclosedTags.push(unclosedTag);
                    }
                }
            }
        }
    }

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
};
