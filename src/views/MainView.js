var
	kind = require('enyo/kind'),
	FluxDispatcher = require('enyo/FluxDispatcher'),
	utils = require('enyo/utils'),
	Group = require('enyo/Group');

var
	Panels = require('moonstone/Panels'),
	Panel = require('moonstone/Panel'),
	IconButton = require('moonstone/IconButton'),
	InputDecorator = require('moonstone/InputDecorator'),
	Divider = require('moonstone/Divider'),
	BodyText = require('moonstone/BodyText'),
	Scroller = require('moonstone/Scroller'),
	SelectableItem = require('moonstone/SelectableItem'),
	Icon = require('moonstone/Icon'),
	Input = require('moonstone/Input'),
	Image = require('moonstone/Image'),
	FittableColumns = require('layout/FittableColumns');

var
	actionConstants = require('../constants/actionConstants'),
	actionCreator = require('../actions/actionCreator'),
	WebStore = require('../stores/WebStore'),
	ImageStore = require('../stores/ImageStore'),
	BookStore = require('../stores/BookStore');

var
	webContainer = { name: "container", components:[
						{ kind: Divider, content: 'Title' },
						{ name: 'title', kind: BodyText, content: ''},
						{ kind: Divider, content: 'URL' },
						{ name: 'url', kind: BodyText, content: ''},
						{ kind: Divider, content: 'Publish Date' },
						{ name: 'pubDate', kind: BodyText, content: ''},
						{ kind: Divider, content: 'Description' },
						{ name: 'desc', kind: BodyText, content: ''},
					]};
	imageContainer = { name: "container", components:[
		{kind:FittableColumns, components: [
			{ name: "thumbnail", kind: Image, style: "width:200px;" },
			{ fit: true, components:[
				{ kind: Divider, content: 'Title' },
				{ name: 'title', kind: BodyText, content: ''},
				{ kind: Divider, content: 'URL' },
				{ name: 'url', kind: BodyText, content: ''},
				{ kind: Divider, content: 'Publish Date' },
				{ name: 'pubDate', kind: BodyText, content: ''},
			]}			
		]},
	]};
	bookContainer = { name: "container", components:[
		{kind:FittableColumns, components: [
			{ name: "cover", kind: Image, style: "width:200px;" },
			{ fit: true, components:[
				{ kind: Divider, content: 'Title' },
				{ name: 'title', kind: BodyText, content: ''},
				{ kind: Divider, content: 'Author' },
				{ name: 'author', kind: BodyText, content: ''},
				{ kind: Divider, content: 'Publisher' },
				{ name: 'pubName', kind: BodyText, content: ''},
				{ kind: Divider, content: 'Publish Date' },
				{ name: 'pubDate', kind: BodyText, content: ''},
				{ kind: Divider, content: 'Description' },
				{ name: 'desc', kind: BodyText, content: ''},
			]}			
		]},
	]};

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
				]}
			],
			components: [
				{kind: FittableColumns, components: [
					{ name: "searchType", kind:Group, style: "width: 400px;", defaultKind: SelectableItem, onActivate:'searchTypeChanged', components:[
						{kind: Divider, content:"Search Category"},
						{name:'websearch', selected: true, content:'Web'},
						{name:'imagesearch', content:'Image'},
						{name:'booksearch', content:'Book'}
					]},
					{ name: "scroller", kind:Scroller, fit: true },					
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

		this.$.scroller.createComponent(webContainer, {owner: this});
	},

	update: function(sender, ev) {

		var data = sender.getData();

		switch(this.$.searchType.getActive().content) {
			case 'Web':
				this.$.title.set('content', data[0].title);
				this.$.url.set('content', data[0].link);
				this.$.pubDate.set('content', data[0].pubDate);
				this.$.desc.set('content', data[0].description);
			break;

			case 'Image':
				this.$.thumbnail.set('src', data[0].thumbnail)
				this.$.title.set('content', data[0].title);
				this.$.url.set('content', data[0].link);
				this.$.pubDate.set('content', data[0].pubDate);
			break;

			case 'Book':
				this.$.cover.set('src', data[0].cover_l_url)
				this.$.title.set('content', data[0].title);
				this.$.author.set('content', data[0].author);
				this.$.pubName.set('content', data[0].pub_nm);
				this.$.pubDate.set('content', data[0].pub_date);
				this.$.desc.set('content', data[0].description);
			break;

			default:
		}
	},

	handleChange: function(inSender, inEvent) {
		console.log('Input Changed....');

		var type = this.$.searchType.getActive().content.toLowerCase();

		// Fetch again with the given value via action creator
		actionCreator.fetch(this.app.store, type, inSender.value);
	},

	searchTypeChanged: function(inSender, inEvent) {
		// Remove current sub section
		this.$.container.destroy();

		var containerType;

		switch(inSender.getActive().content) {
			case "Web":
	 			containerType = webContainer; 
	 			this.app.store = WebStore;
				this.app.store.on('change', this._update);
				break;
			case "Image":
				containerType = imageContainer;
	 			this.app.store = ImageStore;
				this.app.store.on('change', this._update);
				break;
			case "Book":
				containerType = bookContainer;
	 			this.app.store = BookStore;
				this.app.store.on('change', this._update);
				break;
			default:
				containerType = webContainer;
	 			this.app.store = WebStore;
				this.app.store.on('change', this._update);
		}

		this.$.scroller.createComponent(containerType, {owner: this}).render();
	}
});
