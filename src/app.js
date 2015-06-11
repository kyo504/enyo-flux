var
	kind = require('enyo/kind'),
	Application = require('enyo/Application');

var
	MainView = require('./views/MainView'),
	MyFluxStore = require('./views/MyStore');


module.exports = kind({
	name: "myapp.Application",
	kind: Application,
	view: MainView,

	create: function() {
		this.store = new MyFluxStore();

		this.inherited(arguments);
	}
});
