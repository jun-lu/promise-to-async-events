# promise-to-async-events


[![Build Status](https://travis-ci.org/jun-lu/promise-to-async-events.svg?branch=master)](https://travis-ci.org/jun-lu/promise-to-async-events)
[![npm version](https://badge.fury.io/js/promise-to-async-events.svg)](https://badge.fury.io/js/promise-to-async-events) [![npm downloads](https://img.shields.io/npm/dm/promise-to-async-events.svg?style=flat-square)](https://www.npmjs.com/package/promise-to-async-events)


`promise-to-async-events` 可以方便的包装多个Promise，并可添加多个观察者捕获其执行过程

### Example

````javascript

  new PromiseAsync(Promise.resolve("hello"))
  .subscribe({
    onStart:()=>{
      console.log("onStart")
    },
    onComplete:(data)=>{
      console.log("onComplete", data)
    },
    onError:()=>{
      //...
    }
  })
  .start();

  /**
    output:
      onStart
      onComplete, hello
  */

````


### 异步动作生命周期

````javascript

  promise to Async events `onStart, onComplete, onProgress, onError`

  --> START ------------------------- COMPLETE -
    |                                          |
    |                                          |---- ERROR
    |                                          |
    |0%------------- PROGRESS -------------100%|


````


### 使用 PromiseAsync

* 安装

````javascript

  npm install promise-to-async-events

  import PromiseAsync from "promise-to-async-events";

  new PromiseAsync( Promise.resolve("hello") )
  .merge(Promise.resolve("world"))
  .subscribe((data1, data2)=>{
    // data1 = hello, data2=world
  })
  .start();

````

### 方法


*  `mrege(promise)`

合并一个新的 promise 操作到队列中，start方法调用后并行执行队列中的promise

````javascript

    new PromiseAsync( JSONP("http://www.baidu.com") )
    .mrege(JSONP("xxxx"))
    .subscribe((data1, data2)=>{
      //...
    })
    .start()

````



* `flat(function)`

.flat方法的function参数接收，flat方法之前所有promise值，fn可返回一个值或promise对象

````javascript

  new PromiseAsync( Promise.resolve(1), Promise.resolve(2))
  .flat((n1, n2)=>{
    return Promise.resolve(n1 + n2);
  })
  .subscribe((data)=>{
    // data=3...
  })
  .start()

````

*  `.subscribe(function|observer)`

添加观察者,如果参数是函数，那么默认监听 onComplete 事件。如果参数是对象，可包含`onStart, onComplete, onProgress, onError` 4方法事件个事件

````javascript

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .subscribe({
      onStart:()=>{},
      onComplete:(a,b)=>{/*a=1,b=2*/},
      onProgress:{}=>{},
      onError:{}=>{}
    })
    .start()

````


* start()

开始执行
