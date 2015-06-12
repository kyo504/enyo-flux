var
	kind = require('enyo/kind'),
	FluxStore = require('enyo/FluxStore'),
	JsonSource = require('enyo/JsonSource');

var
	Constants = require('./Constants');


var daumSource = kind({
	name: 'daum.Source',
	kind: JsonSource,
	urlRoot: "https://apis.daum.net/search/web/",
	fetch: function(rec, opts) {
		opts.callbackName = 'callback',
		opts.params = utils.clone(rec.params);
		opts.params.api_key = '63a19d5e0d7de47e398fcaf2b4d5f4f51723cd18';
		opts.params.format = "json";
		this.inherited(arguments);		
	}
});

module.exports = kind({
	name: 'myapp.MyFluxStore',
	kind: FluxStore,
	source: daumSource,

	handlers: {
		onUpdateContent: ""
	},

	fetch: function(opts) {

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
