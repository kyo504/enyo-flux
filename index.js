var
	ready = require('enyo/ready');

var
	App = require('./src/app');

ready(function(){
	new App({name: "app"});
});