var PromiseAsync = require("promise-to-async-events");

new PromiseAsync( Promise.resolve(1)).subscribe((data)=>{
  console.log("npm install test ok");
}).start();
