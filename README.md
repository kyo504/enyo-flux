# enyo-flux

## Overview

이 애플리케이션은 Enyo 2.6을 기반으로하여 Flux 패턴을 적용한 샘플입니다.

## Flux 애플리케이션 구조란 무엇인가

Flux는 Facebook이 Javascript 애플리케이션을 만들기 위해서 사용하는 애플리케이션 구조입니다. Flux는 단방향 데이터 흐름에 기반하고 있습니다.

### Dispatcher는 Flux 데이터 흐름에서 어느 부분에 해당하는가

Dispatcher는 singleton이며 Flux에서 데이터 흐름의 중앙 허브 역할을 합니다. Disptcher는 일련의 callback 함수들로 이루어져 있으며 dispatcher에 의해서 수행됩니다. 각 Store는 dispatcher를 이용해서 callback을 등록합니다. 새로운 데이터가 dispatcher로 들어오게 되면 dispatcher는 해당 데이터를 모든 스토어에 전파하기 위해서 callback을 이용합니다. callback을 호출하는 단계는 dispatch 함수를 통해서 시작되며 이 함수는 argument로 데이터 payload 객체를 사용합니다

### Action 과 ActionCreator

사용자가 앱간의 인터렉션을 통해서든 web API 호출을 통해서든 새로운 데이터가 시스템에 전달 될 때 데이터는 하나의 Action으로 패키지화됩니다. 이 액션은 데이터와 데이터의 타입 정보를 포함하는 객체리터럴 입니다. ActionCreator라 불리는 helper 함수들의 집합을 생성하는데 이는 action 객체를 생성하는 것 뿐만 아니라 action을 disptcher로 전달하기 위해서 사용됩니다.

Action들은 타입 속성 따라 구분 수 있습니다 모든 Store가 Action을 받을 때 일반적으로 이 속성값을 이용해서 Store가 해당 Action에 대해서 어떻게 동작해야 할지를 결정하게 됩니다. Flux 애플리케이션에서 Store와 View는 스스로를 제어합니다. 이 말은 이 둘은 외부 객체에 의해서 동작하지 않음을 의미합니다. Action은 setter 함수가 아닌, Store가 정의하고 등록한 callback을 통해서 Store로 흘러갑니다.

Store가 스스로 업데이트하도록 하는 것은 흔히 MVC 애플리케이션에서 볼 수 있는 복잡하게 얽힌 부분을 제거합니다. 이는 모델 간의 연속적인 업데이트가 앱의 불안정한 상태를 유발하거나 정확한 테스팅을 어렵게 만드는 부분입니다. Flux 애플리 케이션 안에 있는 객체들은 결합도가 상당히 낮으며 Law of Demeter를 지향합니다. Law of Demeter는 시스템에서 각 객체는 시스템의 다른 객체들에 대해서 최소한의 정보를 알고 있어야 한다는 원칙입니다. (최소 지식의 원칙을 말하며 여기서 지식은 "객체간의 얼마나 많 정보를 가지고 있는 가"를 의미한다. 즉 이러한 지식을 최소한으로 가지며 Coupling 관계를 낮추는 것을 말한다). 이 결과 더욱 유지보수가 용이하고, 적용하기 쉽고, 테스트가 용이하고 새로운 엔지니어가 이해하기 쉬운 소프트웨어가 되게 됩니다

<img src="https://github.com/facebook/flux/blob/master/docs/img/flux-diagram-white-background.png" style="width: 100%;" />

### 왜 Dispatcher가 필요한가

애플리케이션의 규모가 커짐에 따라 서로 다른 Store간의 의존성은 늘어나게 됩니다. Store A가 스스로를 어떻게 업데이트 할지 알 수 있기 위해서는 Store A가 스스로를 업데이트 하기에 앞서 불가피하게 Store B가 필요할 것 입니다. 우리는 dispatcher가 Store B를 위한 callback을 실행할 수 있어야 하며 Store A로 진행하기 전에 해당 callback을 끝내야 합니다. 이 의존성을  주장(?)하기 위해서는 store가 dispatcher에게 "나는 이 action을 처리하기 위해서 Store B를 기다려야한다"라고 말할 수 있어야 합니다. Dispatcher는 기능을 waitFor() 함수를 통해서 전달합니다.

dispatcher() 함수는 callback을 통해서 간단하고 동기적인 반복 수행을 순차적으로 각 callback을 수행함으로서 제공합니다. waitFor()가 callback 중 하나와 만나게 되면 해당 callback의 수행은 멈추고 의존성에 대한 새로운 반복 사이클을 제공한다. 전체 의존성이 만족되면 원래 callback이 기존 작업을 계속 수행하게 됩니다.

더 나아가 waitFor() 함수는 동일한 store의 callback 안에서 서로 다른 action에 대해서 다른 방법으로 사용될 수 있습니다. 예를 들면 Store A가 Store B를 기다려야 합니다. 하지만 다른 경우 Store A가 Store C를 기다려야 할 수도 있습니다. 특정 Action에 대한 Code Block안에서 waitFor()를 사용하는 것은 우리가 이러한 의존성에 대한 세밀한 제어를 할 수 있도록 합니다.

하지만 Circular 의존성이 있다면 문제가 됩니다. 즉, Store A가 Store B를 기다려야 하고 Store B가 Store A를 기다려야 한다면 무한 루프 빠지게 됩니다. 현재 버전의 Flux에서 Dispatcher는 이를 문제가 발생 때 개발자에게 경고를 전달함으로써 미연에 방지하도록 합니다. 이 경우에 개발자는 세 번째 Store를 만들어서 Circular 의존성을 해결할 수 있습니다.

## Enyo에서는 Flux를 어떻게 이용할까

### 샘플 애플리케이션에 대한 설명

애플리케이션은 사용자가 웹검색, 이미지검색, 책검색 중 하나를 선택하고 검색어를 입력하면 Daum Open API를 통해서 검색어에 대해서 첫 번째 검색 결과를 화면에 보여줍니다. 

### 앱의 폴더 구성

```
root - assets
     - mock
     - src
          - actions     : ActionCreator
          - constants   : Action에 대한 정의
          - stores      : Store에 대한 정의
          - style       : CSS/LESS
          - views       
```

### Store 생성

검색 카테고리별로 별도의 Store를 가지며 각 Store는 CoreStore를 상속받아서 확장하는 형태로 되어 있습니다. 먼저 CoreStore를 살펴봅시다. CoreStore는 Enyo의 CoreObject를 상속하며 instance에 대한 고유 ID 부여를 위해 id 송성을 가집니다. 그리고 dispatcher로부터 notify를 받았을 때 view로 change event를 전달하기 위해서 EvenEmitter를 mixin으로 사용합니다. contructor 함수에서는 dispatcher로 부터 id를 부여받은 다음에 현재 store에 대해서 update함수를 subscribe를 걸어서 변경 사항이 발생할때 noti를 받을 수 있도록 합니다.

```javascript
module.exports = kind({
	name: 'myapp.FluxStore',
	kind: CoreObject,
	id: -1,
	mixins: [EventEmitter],
	constructor: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);

			// Unique ID is given by dispatcher
			this.id = FluxDispatcher.subscribe();

			// If the store has an update method, subscribe to payload updates
			if(this.update) 
				FluxDispatcher.subscribe(this.id, utils.bindSafely(this, this.update));
		};
	})
});
```

아래는 위에 언급한 3개의 Store 중 웹검색의 결과를 담고 있을 WebStore 입니다. 위에서 정의한 CoreStore를 상속하고 있으며 update와 getData 함수를 가지고 있습니다. update는 dispatcher를 통해 전달된 action을 이용해서 타입 속성에 따라서 적절한 내용을 수행합니다. 아래에서는 FETCH 즉, actionCreator가 Daum으로 부터 웹검색 결과를 받아서 dispatcher를 통해 WebStore에게 Noti를 전달하면 이를 update함수에서 데이터를 저장하고 View에게 change 이벤트를 전달하고 있습니다. getData는 View에서 change 이벤트를 받았을 때 Store에 접근해서 데이터를 얻기 위한 API 입니다. 마지막으로 WebStore는 singleton 객체를 유지하기 위해서 객체를 생성하고 생성된 객체를 export합니다.

```javascript
var WebStore = kind({
	name: 'myapp.WebStore',
	kind: CoreStore,

	update: function(action) {
		switch (action.actionType) {
			case actionConstants.ActionType.FETCH:
				this._data = action.payload;
				this.emit('change');
				break;
		}
	},

	getData: function() {
		return this._data;
	}	
});

module.exports = new WebStore();
```

### ActionCreator 생성

ActionCreator 에서는 먼저 back-end와 communication을 하기 위한 Source를 생성하고 enyo의 source 목록에 추가합니다.  ActionCreator는 fetch 함수를 통해서 검색을 요청한 후에 등록된 callback을 통해서 검색결과를 받습니다. 그리고 dispatcher를 통해서 이 결과를 Action 타입과 함께 Store에 notify를 보냅니다.

```javascript
Source.create({kind: JsonpSource, name: "SearchSource"});

module.exports = {
	source: 'SearchSource',
	fetch: function(store, searchType, searchQuery) {

		var opts = {};
		...
		opts.success = this._success.bind(this, store);
		opts.error = this._error.bind(this, store);
	
		FluxDispatcher.pending[store.id] = true;
		Source.execute('fetch', this, opts);
		FluxDispatcher.pending[store.id] = false;
	},

	_success: function(store, source, res, req) {
		FluxDispatcher.notify(store.id, {
			actionType: actionConstants.ActionType.FETCH,
			payload: res && res.channel && res.channel.item
		})		
	},

	_error: function(store, source, res, req) {
	},
}
```

### View 생성

View에서 중요한 부분은 세 가지 입니다.

1. 각 Store에 이벤트 listener를 등록
	
	View를 생성할 때 각 Store에 이벤트 listener를 등록하면 Store에서 View에 change 이벤트를 전달하면 update함수가 호출 됩니다.
	
	```javascript
		create: function() {
			this.inherited(arguments);
	
			this._update = this.bindSafely(this.update);
			
			// Add even listener to each store.
			WebStore.on('change', this._update);
			ImageStore.on('change', this._update);
			BookStore.on('change', this._update);
	
			this.$.scroller.createComponent(webContainer, {owner: this});
		},
	```

2. 검색어를 입력했을 때 fetch를 요청
	
	사용자가 검색어를 입력하면 검색 결과를 저장할 Store, 검색 타입 그리고 검색어 정보를 fetch 함수의 매개변수로 이용하여 함수 호출을 합니다.
	
	```javascript
		handleChange: function(inSender, inEvent) {
	
			var type = this.$.searchType.getActive().content.toLowerCase();
			var currentStore;
	
			// Fetch again with the given value via action creator
			switch(this.$.searchType.getActive().content) {
				case "Web":
		 			currentStore = WebStore; 
					break;
				...
			}
	
			actionCreator.fetch(currentStore, type, inSender.value);
		},
	```

3. 이벤트를 받았을 때 처리

	change 이벤트를 통해서 update 함수가 호출되면 View에서는 store로 부터 업데이트 된 데이터를 가져온 다음 관련된 정보를 업데이트 합니다.

	```javascript
		update: function(sender, ev) {
	
			var data = sender.getData();
	
			switch(this.$.searchType.getActive().content) {
				case 'Web':
					this.$.title.set('content', data[0].title);
					this.$.url.set('content', data[0].link);
					this.$.pubDate.set('content', data[0].pubDate);
					this.$.desc.set('content', data[0].description);
				break;
				...
			}
		},
	```

