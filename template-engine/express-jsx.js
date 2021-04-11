const fs = require('fs')

function getRenderedContent(content, objectOptions) {

}

function expressJsx(filepath, options, callback) {
    fs.readFile(filepath, function(err, content) {

        if (err) return callback(err);

        const rendered = getRenderedContent(content, options);

        return callback(null, rendered)
    })
}

module.exports = expressJsx;