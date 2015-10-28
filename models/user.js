var Waterline = require('waterline');
var bcrypt = require('bcryptjs');

module.exports = Waterline.Collection.extend({
    identity: 'user',
    connection: 'disk',
    attributes: {
        username: {
            type: 'string',
            required: true,
            unique: true,
        },
        surname: {
            type: 'string',
        },
        forename: {
            type: 'string',
        },
        password: {
            type: 'string',
            required: true
        },
        email: 'email',
        role: {
            type: 'string',
            enum: ['user', 'operator'],
            required: true,
            defaultsTo: 'user'
        },
        items: {
            collection: 'item',
            via: 'user'
        },
        validPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        }
    },
    
    beforeCreate: function(values, next) {
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) {
                return next(err);
            }
            values.password = hash;
            next();
        });
    }
});