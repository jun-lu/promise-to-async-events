var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var PromiseAsync = require("../PromiseAsync");

// var  a = new PromiseAsync( Promise.resolve(1) )

describe('PromiseAsync', function() {


  describe('test status', function() {

    new PromiseAsync( Promise.resolve(1) )
    .subscribe((data)=>{
      expect(1).to.be.equal(data);
    })
    .start()

  });


  describe('test status', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .subscribe((data)=>{
      expect(1).to.be.equal(data[0]);
      expect(1).to.be.equal(data[1]);
    })
    .start()

  });

  describe('test status', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .flat((datas)=>{
      return datas[0] + datas[1];
    })
    .subscribe((data)=>{
      expect(3).to.be.equal(data);
    })
    .start()

  });



  describe('test status', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .flat((datas)=>{
      return Promise.resolve( datas[0] + datas[1] );
    })
    .subscribe((data)=>{
      expect(3).to.be.equal(data);
    })
    .start()

  });


  describe('test status', function() {

    new PromiseAsync( Promise.resolve(1), Promise.resolve(2) )
    .flat((datas)=>{
      return Promise.resolve( datas[0] + datas[1] );
    })
    .merge(Promise.resolve(4))
    .subscribe((datas)=>{
      expect(3).to.be.equal(data[0]);
      expect(4).to.be.equal(data[1]);
    })
    .start()

  });

});
