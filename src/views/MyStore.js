var
	kind = require('enyo/kind'),
	FluxStore = require('enyo/FluxStore'),
	Source = require('enyo/Source');

var
	Constants = require('./Constants');


module.exports = kind({
	name: 'myapp.MyFluxStore',
	kind: FluxStore,
	source: Source,

	handlers: {
		onUpdateContent: ""
	},

	update: function(action) {

		switch(action.actionType) {
			case Constants.myAction:
				this.handleMyAction(action.payload);
			break;

			default:
		}
	},

	handleMyAction: function(data) {
		this.emit('change', data);
	}
});
