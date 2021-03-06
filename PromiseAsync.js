'use strict'

var events = require("events");

/**

  Promise to Async Events

  --> START ------------------------- COMPLETE -
    |                                          |
    |                                          |---- ERROR
    |                                          |
    |0----------------- Next ---------------100|

*/

// TODO
// .map() ?
// .filter() ?
// .progress() ?

// 发送之前
var START = "start";
//进度
var NEXT = "next";
//完成
var COMPLETE = "complete";
//错误
var ERROR = "__error"; //避免与 events.EventEmitter error事件重复



/**
 *  new PromiseAsync( request )
 *  @param {Promise} promise
 */

function PromiseAsync( promise ){

  //inherit events.EventEmitter
  events.EventEmitter.call(this);

  if(arguments.length > 1){
    this.promiseIterator = Array.prototype.slice.call(arguments);
  }else{
    this.promise = promise instanceof Promise ? promise : Promise.resolve(promise);
  }

  this.START = START;
  this.NEXT = NEXT;
  this.COMPLETE = COMPLETE;
  this.ERROR = ERROR;


}


//inherit events.EventEmitter
PromiseAsync.prototype = events.EventEmitter.prototype;
//fixed constructor to PromiseAsync
PromiseAsync.prototype.constructor = PromiseAsync;

/**
 * @param {Object|function}observer
 *  1. subscribe({
 *        onStart:()=>{}
 *        onComplete:()=>{}
 *        onProgress:()=>{}
 *        onError:()=>{}
 *      })
 *
 *  2. subscribe(()=>{ console.log("onComplete") })
 */

//TODO can use .subscribe(fn, fn) ?
PromiseAsync.prototype.subscribe = function(observer) {

  if(typeof observer === "function"){
    this.__on(this.COMPLETE, observer);
    return this;
  }

  if(typeof observer === "object"){
    observer.onStart && this.__on(this.START ,observer.onStart,observer);
    observer.onNext && this.__on(this.NEXT, observer.onNext,observer);
    observer.onComplete && this.__on(this.COMPLETE, observer.onComplete,observer);
    observer.onError && this.__on(this.ERROR, observer.onError,observer);
    return this;
  }

  throw new Error("observer must be 'function' or 'Object'");

}

/**
  * parallel promise
  * .mrege( Promise.resolve("hello") )
  * @param {Promise} promise
  * @return {this}
  */
PromiseAsync.prototype.merge = function(promise){

  //fix Android 5.1.1 下babel打包以后 promise instanceof Promise => false 
  //所以这里使用 promise.constructor
  if(!promise || !(promise instanceof Promise)){
    throw ".merge() must be Promise";
  }

  if(!this.promiseIterator){
    this.promiseIterator = [this.promise];
  }

  this.promiseIterator.push(promise);

  return this;
}

/**
  * @param {fn} fn(a,b,c)
  * @return {this}
*/
PromiseAsync.prototype.flat = function(fn){

  if(typeof fn !== "function"){
    throw ".flat(fn) muse be function, and return value or promise"
  }

  var promiseIterator = this.promiseIterator || [this.promise];

  this.promiseIterator = [new Promise(function(resolve, reject){
    Promise.all(promiseIterator)
    .then(function(datas){
      resolve(fn.apply(null, datas))
    })
    .catch(function(error){
      reject(error)
    })
  })];
  return this;
}

/**
 * 启动
 */
PromiseAsync.prototype.start = function(){

  var self = this;

  if(this.promiseIterator){
    //多个promise
    self.emit(self.START);
    var iterator = this.promiseIterator;
    Promise.all(self.promiseIterator)
    .then(function(datas){
      //datas = [1,2,3] = to onComplete(1,2,3)
      self.emit.apply(self, [self.COMPLETE].concat(datas));
    }).catch(function(error){
      self.emit(self.ERROR, error);
    })

  }else{
    //仅有一个promise
    this.emit(self.START);
    self.emit(self.PROGRESS, 0);
    this.promise.then(function(data){
      self.emit(self.PROGRESS, 100);
      self.emit(self.COMPLETE, data);
    })
    .catch(function(error){
      self.emit(self.PROGRESS, 100);
      self.emit(self.ERROR, error);
    })
  }
}

/**
 * toPromise
 */
PromiseAsync.prototype.toPromise = function(){

  var self = this;

  return new Promise(function(resolve, reject){

    self.subscribe({
      onComplete:function(){
        if(arguments.length > 1){
          resolve(arguments)
        }else{
          resolve(arguments[0])
        }
      },
      onError:reject
    });

    self.start();

  });

}

/**
 * __on
 * events.emitter `on`
 */
PromiseAsync.prototype.__on = function(type, fn, self){
  this.on(type, function(a,b,c){
    fn.apply(self, arguments)
  })
}


;(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.PromiseAsync = mod.exports;
  }
})(this, function (exports, module) {
  module.exports = PromiseAsync;
});
