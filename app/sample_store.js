var AppDispatcher = require('./appdispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var SampleStore = assign({}, EventEmitter.prototype, {
});

module.exports = SampleStore;