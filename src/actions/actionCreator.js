var
	FluxDispatcher = require('enyo/FluxDispatcher'),
	JsonpSource = require('enyo/JsonpSource'),
	Source = require('enyo/Source');

var
	actionConstants = require('../constants/actionConstants');

// What is this for? Is this scoped to this file?
Source.create({kind: JsonpSource, name: "DaumSource"});

module.exports = {

	source: 'DaumSource',

	fetch: function(store, query) {

		var opts = {};
		opts.url = "https://apis.daum.net/search/web";
		opts.success = this._success.bind(this, store);
		opts.error = this._error.bind(this, store);

		opts.callbakName = 'callback'
		opts.params = {};
		opts.params.apikey = '63a19d5e0d7de47e398fcaf2b4d5f4f51723cd18';
		opts.params.output = 'json';
		opts.params.q = query;

		// What is the purpose of pending??
		FluxDispatcher.pending[store.id] = true;
		Source.execute('fetch', this, opts);
		FluxDispatcher.pending[store.id] = false;

	},

	_success: function(store, source, res, req) {
		console.log("Success...");

		FluxDispatcher.notify(store.id, {
			actionType: actionConstants.FETCH,
			payload: res && res.channel && res.channel.item
		})		
	},

	_error: function(store, source, res, req) {
		console.log("Error...");
	},

	setData: function(store, name, data) {
		console.log("Set Data...");

	}
}