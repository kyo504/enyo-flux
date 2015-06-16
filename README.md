# enyo-flux

## Overview

This application is written based on Eyo 2.6 with Flux pattern. 

## Flux 애플리케이 구조란 무엇인가

Flux는 Facebook이 Javascript 애플리케이션을 만들디 위해서 사용하 애플리케이션 구조입니다. Flux는 단방향 데이터 흐름에 기반하고 있습니다.

### Dispatcher는 Flux 데이터 흐름에서 어느 부분에 해당하는가

Dispatcher는 singleton이며 Flux에서 데이터 흐름의 중앙 허브 역할을 합니다. Dispacher는 일련의 callback 함수들로 이루어져 있으며 dispacher에 의해서 수행됩니다. 각 Store는 dispatcher를 이요해서 callback을 등록합니다. 새로운 데이터가 dispatcher로 들어오게 되면 dispatcher는 해당 데이터를 모든 스토어에 전파하기 위해서 callback을 이용합니다. callback을 호출하는 단계는 dispatch 함수를 통해서 시작되며 이 함수는 argument로 데이터 payload 객체를 이용합니다

### Action 과 ActionCreator

사용자가 앱간의 인터렉션을 통해서든 web API 호출을 통해서든 새로운 데이터가 시스템에 전달 될 때 데이터는 하나의 Action으로 패키지화됩니다. 이 액션은 데이터와 데이터의 타 정보를 포함하는 객체리터럴 입니다. ActionCreator라 불리는 helper 함수들의 집합을 생성하는데 이는 action 객체를 생성하는  뿐만 아니라 action을 dispacher로 전달하기 위해서 사용됩니다.

Action들은 type 속성 따라 구분 수 있습니다 모든 Store가 Action을 받을 때 일반적으로 이 속성값을 이용해서 Store가 해당 Action에 대해서 어떻게 동작해야 할지를 결정하게 됩니다. Flux 애플리케이션에서 Store와 View는 스스로를 제어합니다. 이 말은 이 둘은 외부 객체에 의해서 동작하지 않음을 의미합니다. Action은 setter 함수가 아닌, Store가 정의하고 등록한 callback을 통해서 Store로 흘러갑니다.

Store가 스스로 업데이트하도록 하는 것은 일반적으로 MVC 애플리케이션에서 존재하는 복잡하게 얽힌 부분을 제거합니다. 이는 모델 간의 연속적인 업데이트가 불안정한 상태를 유발하거나 정확한 테스팅을 어렵게 만드는 부분입니다. Flux 애플리 케이션 안에있는 객체들은 결합도가 상당히 낮으며 Law of Demeter를 지향합니다. Law of Demeter는 시스템에서 각 객체는 시스템의 다른 객체들에 대해서 최소한의 정보를 알고 있어야 한다는 워칙입니다. (최소 지식의 원칙을 말하며 여기서 지식은 "객체간의 얼마나 많 정보를 가지고 있는 가"를 의미한다. 즉 이러한 지식을 최소한으로 가지며 Coupling 관계를 낮추는 것을 말한다). 이 결과 더욱 유지보수가 용이하고, 적용하기 쉽고, 테스트가 용이하고 새로운 엔지니어가 이해하기 쉬운 소프트웨어가 되게 됩니다

<img src="https://github.com/facebook/flux/blob/master/docs/img/flux-diagram-white-background.png" style="width: 100%;" />

### 왜 Dispatcher가 필요한

