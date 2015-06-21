var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	CoreObject = require('enyo/CoreObject'),
	EventEmitter = require('enyo/EventEmitter'),
	FluxDispatcher = require('enyo/FluxDispatcher');

var
	actionConstants = require('../constants/actionConstants');

var CHANGE_EVENT = 'change';

module.exports = kind({
	name: 'myapp.FluxStore',

	/**
	* @private
	*/
	kind: CoreObject,

	id: -1,

	mixins: [EventEmitter],

	/**
	* @private
	*/
	constructor: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);

			// get unique store id from dispatcher
			this.id = FluxDispatcher.subscribe();

			// if the store has an update method, subscribe to payload updates
			if(this.update) 
				FluxDispatcher.subscribe(this.id, utils.bindSafely(this, this.update));

			this._data = {};
		};
	}),

	/**
	* Add a callback fuction to this store
	* @param {function} callback
	* @public
	*/
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	* Remove a callback fuction from this store
	* @param {function} callback
	* @public
	*/
	removeChangeListener: function(callback) {
		this.off(CHANGE_EVENT, callback);
	},
});
