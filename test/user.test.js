describe('Models, User tesztek', function() {

    var expect = require("chai").expect;

    var Waterline = require('waterline');
    var waterlineConfig = require('../config/waterline');
    var bcrypt = require('bcryptjs');

    var User;

    before(function(done) {
        // ORM indítása
        var orm = new Waterline();

        orm.loadCollection(require('../models/category'));
        orm.loadCollection(require('../models/item'));
        orm.loadCollection(require('../models/user'));
        waterlineConfig.connections.default.adapter = 'memory';


        orm.initialize(waterlineConfig, function(err, models) {
            if (err) throw err;
            User = models.collections.user;
            done();
        });
    });
    after(function() { /* ... */ });
    beforeEach(function() { /* ... */ });
    afterEach(function() { /* ... */ });

    /*it('should do something', function() { });
    it('should do something', function(done) { 
        done();
    }); //Aszinkron tesztek
    */

    // Egymásba ágyazhatóak
    /*describe('Valami2', function() {
        it('should work', function() { });
    });*/

    describe('UserModel Tesztek', function() {
        //mindegyik "it" elött végrehajtani
        beforeEach(function(done) {
            //törölni a usereket minden teszt elött
            try {
                User.destroy({}, function(err) {
                    done();
                });
            }
            catch (error) {

            }
        });

        it('should work, alapteszt nem csinál semmit', function() {
            expect(true).to.be.true;
        });

        it('should be able to create a user', function() {
            return User.create({
                    username: 'abcdef',
                    password: 'jelszo',
                    surname: 'Gipsz',
                    forename: 'Jakab',
                    avatar: '',
                    email: '',
                })
                .then(function(user) {
                    expect(user.username).to.equal('abcdef');
                    expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
                    expect(user.surname).to.equal('Gipsz');
                    expect(user.forename).to.equal('Jakab');
                    expect(user.email).to.equal('');
                    expect(user.avatar).to.equal('');
                });
        });

        function getUserData() {
            return {
                username: 'abcdef',
                password: 'jelszo',
                surname: 'Gipsz',
                forename: 'Jakab',
                avatar: '',
                email: '',
            };
        }

        it('should be able to find a user', function() {
            return User.create(getUserData())
                .then(function(user) {
                    return User.findOneByUsername(user.username);
                })
                .then(function(user) {
                    expect(user.username).to.equal('abcdef');
                    expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
                    expect(user.surname).to.equal('Gipsz');
                    expect(user.forename).to.equal('Jakab');
                    expect(user.email).to.equal('');
                    expect(user.avatar).to.equal('');
                });
        });

        it('should be able to update a user', function() {

            return User.create(getUserData())
                .then(function(user) {
                    var id = user.id;
                    return User.update(id, {
                        email: 'xyz@yahoo.com'
                    });
                })
                .then(function(userArray) {
                    var user = userArray.shift();
                    expect(user.username).to.equal('abcdef');
                    expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
                    expect(user.surname).to.equal('Gipsz');
                    expect(user.forename).to.equal('Jakab');
                    expect(user.email).to.equal('xyz@yahoo.com');
                    expect(user.avatar).to.equal('');
                });
        });

        describe('#validPassword', function() {
            it('should return true with right password', function() {
                return User.create(getUserData()).then(function(user) {
                    expect(user.validPassword('jelszo')).to.be.true;
                })
            });
            it('should return false with wrong password', function() {
                return User.create(getUserData()).then(function(user) {
                    expect(user.validPassword('titkos')).to.be.false;
                })
            });
        });

    });

});