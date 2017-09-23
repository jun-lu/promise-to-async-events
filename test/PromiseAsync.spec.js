var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var PromiseAsync = require("../PromiseAsync");

describe('PromiseAsync', function() {


  PromiseAsync

  it('test START,COMPLETE,PROGRESS,ERROR )', function() {

    var promise = new PromiseAsync( Promise.resolve(1) )
    expect("start").to.be.equal(promise.START);
    expect("complete").to.be.equal(promise.COMPLETE);
    expect("progress").to.be.equal(promise.PROGRESS);
    expect("error").to.be.equal(promise.ERROR);

  });

  it('test constructor new PromiseAsync( Promise.resolve(1) )', function() {

    new PromiseAsync( Promise.resolve(1) )
    .subscribe(function(data){
      expect(1).to.be.equal(data);
    })
    .start()

  });

  it('test new PromiseAsync( Promise.reject(1) )', function() {

    new PromiseAsync( Promise.reject(1) )
    .subscribe({
      onError:function(err){
        expect(1).to.be.equal(err);
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


});
