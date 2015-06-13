var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	CoreObject = require('enyo/CoreObject'),
	EventEmitter = require('enyo/EventEmitter'),
	FluxDispatcher = require('enyo/FluxDispatcher');

var
	actionConstants = require('../data/actionConstants');

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
			//id the store with the dispatcher
			this.id = FluxDispatcher.subscribe();

			//if the store has an update method, subscribe to payload updates
			if(this.update) this.updateID = FluxDispatcher.subscribe(this.id, utils.bindSafely(this, this.update));

			this._data = {};
		};
	}),

	update: function(action) {
		switch (action.actionType) {
			case actionConstants.FETCH:
				this._data = action.payload;
				this.emit('change');
				break;
		}
	},

	/**
	 * [getData description]
	 * @return {[type]} [description]
	 */
	getData: function() {
		return this._data;
	}	
});
