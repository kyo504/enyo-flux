var
	kind = require('enyo/kind'),
	Application = require('enyo/Application');

var
	MainView = require('./views/MainView');

module.exports = kind({
	name: "myapp.Application",
	kind: Application,
	view: MainView
});
