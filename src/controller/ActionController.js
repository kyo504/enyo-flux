var
	kind = require('enyo/kind'),
	Controller = require('enyo/Controller'),
	FluxDispatcher = require('enyo/FluxDispatcher'),
	utils = require('enyo/utils');

module.exports = kind({
	name: 'myapp.ActionController',
	kind: Controller,

	create: function() {
		this.inherited(arguments);

		this.subscriptionID = FluxDispatcher.subscribe(
			this.app.StoreA.id,
			utils.bind(this, this.update);
		);
	},

	// update: function(action) {
	// 	switch(action.actionType) {

	// 	}
	// }

});