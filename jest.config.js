//const base = require('../../tools/jest/config.base.js'); //Dunno where this it's placed
const pack = require("./package");

module.exports = {
  //...base,
  transform: {
      //'^.+\\.js$': '../../tools/jest/babel-jest-wrapper.js' Same, don't know where it's placed
  },
  displayName: pack.name,
  name: pack.name
};

//TODO i trully tried to use jest as test environment for the angularJS app but cannot managed to configure it
// usually for test browser based applications i use jasmine and for server ones i am so confotable with expect.js or just with mocha
