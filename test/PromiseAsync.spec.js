var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var PromiseAsync = require("../PromiseAsync");

// var  a = new PromiseAsync( Promise.resolve(1) )

describe('PromiseAsync', function() {


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

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .merge(Promise.resolve(3))
    .merge(Promise.resolve(4))
    .subscribe({
      onStart:function(){
        expect(1).to.be.equal(1);
      },
      onComplete:function(a,b,c,d){
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
        expect(1).to.be.equal(1);
      },
      onComplete:function(a,b,c,d){
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


});
