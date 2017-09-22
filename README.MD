# promise-to-async-events

[![Build Status](https://travis-ci.org/jun-lu/promise-to-async-events.svg?branch=master)](https://travis-ci.org/jun-lu/promise-to-async-events)
[![npm version](https://badge.fury.io/js/promise-to-async-events.svg)](https://badge.fury.io/js/promise-to-async-events) [![npm downloads](https://img.shields.io/npm/dm/promise-to-async-events.svg?style=flat-square)](https://www.npmjs.com/package/promise-to-async-events)

`PromiseAsync` 可以方便的包装多个Promise，并最终作为异步时间发送给观察者

````javascript

  new PromiseAsync(Promise.resolve("hello"))
  .subscribe({
    onStart:()=>{
      console.log("onStartBefore")
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
      onStartBefore
      onComplete, hello
  */

````

### 异步动作生命周期

````javascript

  subscribe Async events life cycle

  --> START ------------------------- COMPLETE -
    |                                          |
    |                                          |---- ERROR
    |                                          |
    |0%------------- PROGRESS -------------100%|


````


### 使用 PromiseAsync

* 安装

````javascript

  npm install promise-async

  import PromiseAsync from "promise-async";

  new PromiseAsync( Promise.resolve("hello") )
  .merge(Promise.resolve("world"))
  .subscribe((text)=>{
    // text = [hello,world]
  })
  .start();

````

### 方法


*  .mrege(Promise)

合并Promise操作，与merge之前的Promise并行执行

````javascript

    new AsyncEventsEmitter( JSONP("http://www.baidu.com") )
    .mrege(JSONP("xxxx"))
    .subscribe((data1, data2)=>{
      //...
    })
    .start()

````



* .flat(fn)

接口 flat 之前的所有promise值，并可返回 promise对象或普通变量。

````javascript

  new AsyncEventsEmitter( Promise.resolve(1), Promise.resolve(2))
  .flat((n1, n2)=>{
    return Promise.resolve(n1 + n2);
  })
  .subscribe((data)=>{
    // data=3...
  })
  .start()

````

* start()

开始执行
