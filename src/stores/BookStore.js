var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	EventEmitter = require('enyo/EventEmitter'),
	FluxDispatcher = require('enyo/FluxDispatcher');

var
	CoreStore = require('./CoreStore'),
	actionConstants = require('../constants/actionConstants');

var BookStore = kind({
	name: 'myapp.BookStore',
	kind: CoreStore,

	update: function(action) {
		switch (action.actionType) {
			case actionConstants.ActionType.FETCH:
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

module.exports = new BookStore();