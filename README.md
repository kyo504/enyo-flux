# enyo-flux

## Overview

이 애플리케이션은 Enyo 2.6을 기반으로하여 Flux 패턴을 적용한 샘플입니다.

## 실행 방법

앱 실행을 위해서는 enyo-dev를 설치해야 합니다. 설치 방법은 다음을 참고하세요. <https://github.com/enyojs/enyo-dev>
enyo-dev를 설치한 후 앱의 루트 폴더에서 아래의 명령어를 실행합니다.

```
egen init
epack
```

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

### Store

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

### ActionCreator

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

### View

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

