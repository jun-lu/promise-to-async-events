var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var PromiseAsync = require("../PromiseAsync");


function mockFetch(text){
  return new Promise(function(resolve, reject){
    resolve({
      json:function(){
        return new Promise(function(resolve, reject){
          resolve(text)
        })
      }
    })
  });
}


describe('PromiseAsync', function() {


  it('test START,COMPLETE,NEXT,ERROR', function() {

    var promise = new PromiseAsync( Promise.resolve(1) )
    expect("start").to.be.equal(promise.START);
    expect("complete").to.be.equal(promise.COMPLETE);
    expect("next").to.be.equal(promise.NEXT);
    expect("__error").to.be.equal(promise.ERROR);

  });

  it('test new PromiseAsync( 1 ) )', function() {
    new PromiseAsync( 1 )
    .subscribe(function(a){
      expect(1).to.be.equal(a);
    })
    .start()
  });


  it('test new PromiseAsync( 1, 2 ) )', function() {
    new PromiseAsync( 1,2 )
    .subscribe(function(a,b){
      expect(1).to.be.equal(a);
      expect(2).to.be.equal(b);
    })
    .start()
  });


  it('test constructor new PromiseAsync( Promise.resolve(1) )', function() {

    new PromiseAsync( Promise.resolve(1) )
    .subscribe(function(data){
      expect(1).to.be.equal(data);
    })
    .start()

  });

  it('test new PromiseAsync( Promise.reject(1), Promise.reject(2) )', function() {

    new PromiseAsync( Promise.reject(1),Promise.reject(2) )
    .subscribe({
      onError:function(a){
        expect(1).to.be.equal(a);
      }
    })
    .start()

  });


  it('test new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .subscribe(function(a,b){
      expect(1).to.be.equal(a);
      expect(2).to.be.equal(b);
    })
    .start()

  });


  it('test new PromiseAsync( Promise.reject(1), Promise.resolve(2) )', function() {

    new PromiseAsync( Promise.reject(1), Promise.resolve(2) )
    .subscribe({
      onError:function(error){
        expect(1).to.be.equal(error);
      }
    })
    .start()

  });

  it('test new PromiseAsync( Promise.resolve(2), Promise.reject(1) )', function() {

    new PromiseAsync( Promise.resolve(2), Promise.reject(1) )
    .subscribe({
      onError:function(error){
        expect(1).to.be.equal(error);
      }
    })
    .start()

  });

  it('test new PromiseAsync( 1 ).flat()', function() {

    new PromiseAsync( 1 )
    .flat(function(a){
      return a + 1;
    })
    .subscribe(function(c){
      expect(2).to.be.equal(c);
    })
    .start()

  });

  it('test flat return value', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .flat(function(a,b){
      return a + b;
    })
    .subscribe(function(c){
      expect(3).to.be.equal(c);
    })
    .start()

  });

  it('test flat return promise', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .flat(function(a,b){
      return Promise.resolve(a + b);
    })
    .subscribe(function(c){
      expect(3).to.be.equal(c);
    })
    .start()

  });




  it('test .flat().merge()', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .flat(function(a, b){
      return Promise.resolve( a + b );
    })
    .merge(Promise.resolve(4))
    .subscribe(function(a, b){
      expect(3).to.be.equal(a);
      expect(4).to.be.equal(b);
    })
    .start()

  });

  it('test .flat().flat().merge()', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .flat(function(a, b){
      return Promise.resolve( a + b );
    })
    .flat(function(a){
      return a+1;
    })
    .merge(Promise.resolve(4))
    .subscribe(function(a, b){
      expect(4).to.be.equal(a);
      expect(4).to.be.equal(b);
    })
    .start()

  });


  it('test .flat().merge().flat()', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .flat(function(a, b){
      return Promise.resolve( a + b );
    })
    .merge(Promise.resolve(5))
    .flat(function(a, b){
      return Promise.resolve( a + b );
    })
    .subscribe(function(a){
      expect(8).to.be.equal(a);
    })
    .start()

  });

  it('test .flat() return reject', function() {

    new PromiseAsync( 1 )
    .flat(function(a, b){
      return Promise.reject(2);
    })
    .merge(Promise.resolve(5))
    .flat(function(a, b){
      return Promise.resolve( a + b );
    })
    .subscribe({
      onError:function(a){
        expect(2).to.be.equal(a);
      }
    })
    .start()

  });

  it('test .flat() throw error', function() {

    new PromiseAsync( 1 )
    .flat(function(a, b){
      throw 3;
      return Promise.reject(2);
    })
    .merge(Promise.resolve(5))
    .flat(function(a, b){
      return Promise.resolve( a + b );
    })
    .subscribe({
      onError:function(a){
        expect(3).to.be.equal(a);
      }
    })
    .start()

  });


  it('test .merge().merge()', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .merge(Promise.resolve(3))
    .merge(Promise.resolve(4))
    .subscribe(function(a, b, c, d){
      expect(1).to.be.equal(a);
      expect(2).to.be.equal(b);
      expect(3).to.be.equal(c);
      expect(4).to.be.equal(d);
    })
    .start()

  });


  it('test .merge().flat()', function() {

    new PromiseAsync( Promise.resolve(1) )
    .merge(Promise.resolve(3))
    .subscribe(function(a, b){
      expect(1).to.be.equal(a);
      expect(3).to.be.equal(b);
    })
    .start()

  });


  it('test .merge(Promise.reject(2)).merge()', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .merge(Promise.reject(3))
    .merge(Promise.reject(4))
    .subscribe({
      onError:function(a){
        expect(3).to.be.equal(a);
      }
    })
    .start()

  });


  it('test .merge(Promise.reject(1)).merge(Promise.reject(2)).toPormiseStart()', function() {

    var promiseAsync = new PromiseAsync( Promise.resolve(1) ).merge(Promise.resolve(2))
    promiseAsync.subscribe(function(a, b){
      expect(1).to.be.equal(a);
      expect(2).to.be.equal(b);
    });

    promiseAsync.toPromise().then(function(result){
      expect(1).to.be.equal(result[0]);
      expect(2).to.be.equal(result[1]);
    })

  });


  it('test .merge(Promise.reject(1)).toPormiseStart()', function() {

    var promiseAsync = new PromiseAsync( Promise.resolve(1) );//.merge(Promise.resolve(2))
    promiseAsync.subscribe(function(a, b){
      expect(1).to.be.equal(a);
    });

    promiseAsync.toPromise().then(function(result){
      expect(1).to.be.equal(result);
    })

  });


  it('test .subscribe().subscribe()', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .merge(Promise.resolve(3))
    .merge(Promise.resolve(4))
    .subscribe(function(a, b, c, d){
      expect(1).to.be.equal(a);
      expect(2).to.be.equal(b);
      expect(3).to.be.equal(c);
      expect(4).to.be.equal(d);
    })
    .subscribe(function(a, b, c, d){
      expect(1).to.be.equal(a);
      expect(2).to.be.equal(b);
      expect(3).to.be.equal(c);
      expect(4).to.be.equal(d);
    })
    .start()

  });

  it('test .subscribe({}).subscribe({})', function() {

    var start1 = 0;
    var start2 = 0;

    var progress1 = 0;
    var progress2 = 0;

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .merge(Promise.resolve(3))
    .merge(Promise.resolve(4))
    .subscribe({
      onStart:function(){
        start1 = 1;
      },
      onProgress:function(){
        progress1 = 1;
      },
      onComplete:function(a,b,c,d){
        expect(1).to.be.equal(start1);
        expect(1).to.be.equal(progress1);
        expect(1).to.be.equal(a);
        expect(2).to.be.equal(b);
        expect(3).to.be.equal(c);
        expect(4).to.be.equal(d);
      },
      onError:function(){

      }
    })
    .subscribe({
      onStart:function(){
        start2 = 1;
      },
      onProgress:function(){
        progress2 = 1;
      },
      onComplete:function(a,b,c,d){
        expect(1).to.be.equal(start2);
        expect(1).to.be.equal(progress2);
        expect(1).to.be.equal(a);
        expect(2).to.be.equal(b);
        expect(3).to.be.equal(c);
        expect(4).to.be.equal(d);
      },
      onError:function(){

      }
    })
    .start()

  });



  it('test .subscribe({}).subscribe({})', function() {

    var eventCount = 0;
    new PromiseAsync( Promise.reject(1), Promise.reject(1) )
    .subscribe({
      onStart:function(){
        eventCount++;
      },
      onComplete:function(a,b,c,d){
        eventCount++;
        expect(2).to.be.equal(eventCount);
      },
      onError:function(){
        eventCount++;
        expect(2).to.be.equal(eventCount);
      }
    })
    .start()

  });


  it('test link fetch() api', function() {



    new PromiseAsync( mockFetch(1) )
    .flat(function(res){
      return res.json()
    })
    .subscribe(function(a){
      expect(1).to.be.equal(a);
    })
    .start()




  });

  it('test link fetch() api 2', function() {

    new PromiseAsync( mockFetch(2).then(function(res){ return res.json() }))
    .subscribe(function(a){
      expect(2).to.be.equal(a);
    })
    .start()

  });





  // Promise.all([
  //   new Promise((resolve, reject)=>{
  //     setTimeout(()=>{
  //       console.log(1)
  //       resolve(1)
  //     }, 1000)
  //   }),
  //   new Promise((resolve, reject)=>{
  //     setTimeout(()=>{
  //       console.log(2)
  //       resolve(2)
  //     })
  //   })
  // ]).then((a, b)=>{ console.log(a,b) }).catch((e)=>{console.log(e)})


/***

  推荐使用 https://github.com/jun-lu/promise-to-async-events

  可以并行，串行，并行+串行的多种组合方式

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
*/

});
