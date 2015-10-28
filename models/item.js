var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
    identity: 'item',
    connection: 'disk',
    attributes: {
        itemName: {
            type: 'string',
            required: true
        },
        itemPrice: {
            type: 'integer',
            defaultsTo: 0
        },
        itemDescription: 'string',
        user:{
            model: 'user'
        },
        category:{
            model: 'category'
        }
        
    }
});