var
	dispatcher = require('enyo/dispatcher'),
	Control = require('enyo/Control'),
	Spotlight = require('spotlight');

var
	enyo = global.enyo = global.enyo || {};

enyo.$ = dispatcher.$;
enyo.Control = Control;
enyo.Spotlight = Spotlight;

var
	kind = require('enyo/kind'),
	Application = require('enyo/Application');

var
	MainView = require('./views/MainView'),
	actionCreator = require('./actions/actionCreator'),
	CoreStore = require('./store/CoreStore');

module.exports = kind({
	name: "myapp.Application",
	kind: Application,
	view: MainView,

	create: function() {
		this.store = new CoreStore();

		this.inherited(arguments);

		// If we want to fetch data at launch time...
		//actionCreator.fetch(this.store);
	}
});
