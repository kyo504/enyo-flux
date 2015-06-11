var
	kind = require('enyo/kind');

var
	Panels = require('moonstone/Panels'),
	Panel = require('moonstone/Panel'),
	IconButton = require('moonstone/IconButton'),
	BodyText = require('moonstone/BodyText'),
	Marquee = require('moonstone/Marquee'),
	MarqueeDecorator = Marquee.Decorator,
	MarqueeItem = Marquee.Item,
	MarqueeSupport = Marquee.Support,
	MarqueeText = Marquee.Text;

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
				{kind: MarqueeDecorator, marqueeOnRender: true, components: [
					{name: 'marqueeStartOnRender1', kind: MarqueeText, style: 'width:200px;', content: 'This is first long text for marquee test which is starting marquee on page render'},
					{name: 'marqueeStartOnRender2', kind: MarqueeText, style: 'width:200px;', content: 'This is second long text for marquee test which is syncronized with first marquee text'}
				]},
			
				{mixins: [MarqueeSupport], marqueeOnRender: true, components: [
					{marqueeOnRender: true, mixins: [MarqueeItem], style: 'width:200px;', content: 'The quick brown fox jumped over the lazy dog.  The bean bird flies at sundown.'},
					{marqueeOnRender: true, mixins: [MarqueeItem], style: 'width:200px;', content: 'Η γρήγορη καφέ αλεπού πήδηξε πάνω από το μεσημέρι. Το πουλί πετά σε φασολιών δύση του ηλίου.'},
					{marqueeOnRender: true, mixins: [MarqueeItem], style: 'width:200px;', content: 'ਤੁਰੰਤ ਭੂਰਾ Fox ਆਲਸੀ ਕੁੱਤੇ ਨੂੰ ਵੱਧ ਗਈ. ਬੀਨ ਪੰਛੀ ਸੂਰਜ ਡੁੱਬਣ \'ਤੇ ਉਡਾਣ ਭਰਦੀ ਹੈ.'},
					{marqueeOnRender: true, mixins: [MarqueeItem], style: 'width:200px;', content: '速い茶色のキツネは、怠け者の犬を飛び越えた。豆の鳥は日没で飛ぶ。'},
					{marqueeOnRender: true, mixins: [MarqueeItem], style: 'width:200px;', content: '那只敏捷的棕色狐狸跃过那只懒狗。豆鸟飞日落。'},
					{marqueeOnRender: true, mixins: [MarqueeItem], style: 'width:200px;', content: '빠른 갈색 여우가 게으른 개를 뛰어 넘었다.콩 조류 일몰에 파리.'}
				]},
			]
		}
	]
});
