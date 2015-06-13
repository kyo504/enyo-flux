var
	kind = require('enyo/kind'),
	FluxDispatcher = require('enyo/FluxDispatcher'),
	utils = require('enyo/utils');

var
	Panels = require('moonstone/Panels'),
	Panel = require('moonstone/Panel'),
	IconButton = require('moonstone/IconButton'),
	InputDecorator = require('moonstone/InputDecorator'),
	Divider = require('moonstone/Divider'),
	BodyText = require('moonstone/BodyText'),
	Scroller = require('moonstone/Scroller'),
	Icon = require('moonstone/Icon'),
	Input = require('moonstone/Input');

var
	actionConstants = require('../data/actionConstants'),
	actionCreator = require('../actions/actionCreator');

module.exports = kind({
	name: "myapp.MainView",
	kind: Panels,
	classes: "moon enyo-fit",

	components: [
		{
			kind: Panel,
			title: "Flux Sample",
			headerComponents: [
				{ kind: InputDecorator, components: [
					{kind: Input, placeholder: 'Search term', onchange: 'handleChange'},
					{kind: Icon, icon: 'search'}
				]},
				{kind: IconButton, src: "assets/icon-like.png"}
			],
			components: [
				{ kind:Scroller, fit: true, components:[
					{ tag: 'br'},
					{ kind: Divider, content: 'Title' },
					{ name: 'title', kind: BodyText, allowHTML: true, content: ''},
					{ kind: Divider, content: 'URL' },
					{ name: 'url', kind: BodyText, allowHtml: true, content: ''},
					{ kind: Divider, content: 'Publish Date' },
					{ name: 'pubDate', kind: BodyText, allowHtml: true, content: ''},
					{ kind: Divider, content: 'Description' },
					{ name: 'desc', kind: BodyText, allowHtml: true, content: ''},
				]},
			]
		}
	],

	create: function() {
		this.inherited(arguments);

		// Why we don't need this?
		//this.subscriptionID = FluxDispatcher.subscribe(this.app.store.id, utils.bind(this, this.update));

		this._update = this.bindSafely(this.update);
		this.app.store.on('change', this._update);
	},

	update: function(sender, ev) {

		var data = sender.getData();

		this.$.title.set('content', data[0].title);
		this.$.url.set('content', data[0].link);
		this.$.pubDate.set('content', data[0].pubDate);
		this.$.desc.set('content', data[0].description);
	},

	handleChange: function(inSender, inEvent) {
		console.log('Input Changed....');

		// Fetch again with the given value via action creator
		actionCreator.fetch(this.app.store, inSender.value);
	}
});
