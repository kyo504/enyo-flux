var
	kind = require('enyo/kind'),
	FluxDispatcher = require('enyo/FluxDispatcher'),
	utils = require('enyo/utils');

var
	Panels = require('moonstone/Panels'),
	Panel = require('moonstone/Panel'),
	IconButton = require('moonstone/IconButton'),
	Button = require('moonstone/Button');

var
	Constants = require('./Constants'),
	MyStore = require('./MyStore');

module.exports = kind({
	name: "myapp.MainView",
	kind: Panels,
	classes: "moon enyo-fit",

	components: [
		{
			kind: Panel,
			title: "Hello World",
			headerComponents: [
				{kind: IconButton, src: "assets/icon-like.png"}
			],
			components: [
				{kind: Button, content: "Update1", ontap: "tapHandler"},
				{kind: Button, content: "Update2", ontap: "tapHandler"},
				{kind: Button, content: "Update3", ontap: "tapHandler"},
				{name: "result", content: "Nothing"}
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

	update: function(sender, ev, args) {
		if(args.fooNode) {
			this.$.result.set('content', args.fooNode);
		}
	},

	tapHandler: function(inSender, inEvent) {
		FluxDispatcher.notify(
			this.app.store.id,
			{
				actionType: Constants.myAction,
				payload: {
					'fooNode': inSender.content + ' button is clicked'
				}
			}
		)
	},
});
