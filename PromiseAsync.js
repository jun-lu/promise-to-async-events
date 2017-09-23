'use strict'

var events = require("events");

/**

  Promise to Async Events

  --> START ------------------------- COMPLETE -
    |                                          |
    |                                          |---- ERROR
    |                                          |
    |0-------------- PROGRESS --------------100|

*/

// 发送之前
var START = "start";
//进度
var PROGRESS = "progress";
//完成
var COMPLETE = "complete";
//错误
var ERROR = "error";



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
  this.PROGRESS = PROGRESS;
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

PromiseAsync.prototype.subscribe = function(observer) {

  if(typeof observer === "function"){
    this.__on(this.COMPLETE, observer);
    return this;
  }

  if(typeof observer === "object"){
    observer.onStart && this.__on(this.START ,observer.onStart,observer);
    observer.onProgress && this.__on(this.PROGRESS, observer.onProgress,observer);
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
  */
PromiseAsync.prototype.merge = function(promise){

  if(!promise || !(promise instanceof Promise)){
    throw ".merge() must be Promise";
  }

  if(!this.promiseIterator){
    this.promiseIterator = [this.promise]
  }

  this.promiseIterator.push(promise);

  return this;
}

/**
  * @param {fn} fn(a,b,c)
  *
*/
PromiseAsync.prototype.flat = function(fn){

  if(typeof fn !== "function"){
    throw ".flat(fn) muse be function, and return value|promise"
  }

  let promiseIterator = this.promiseIterator;
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
    self.emit(self.PROGRESS, 0);
    var iterator = this.promiseIterator;
    Promise.all(self.promiseIterator)
    .then(function(datas){
      self.emit(self.PROGRESS, 100);
      self.emit.apply(self, [self.COMPLETE].concat(datas));
    }).catch(function(error){
      self.emit(self.PROGRESS, 100);
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
 * __on
 * events.emitter `on`
 */
PromiseAsync.prototype.__on = function(type, fn, self){
  this.on(type, function(a,b,c){
    fn.apply(self, arguments)
  })
}


module.exports = PromiseAsync;
