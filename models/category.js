var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
    identity: 'category',
    connection: 'disk',
    attributes: {
        categoryName: {
            type: 'string',
            required: true
        }

        
    }
});