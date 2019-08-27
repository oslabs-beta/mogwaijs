var assert = require('assert');
const vertex = require('../functions/crud')

describe('VertexModel', function() {
  it('should generate a gremlin string without modifying the model', function() {
    const modelBeforeRunningFunc = vertex.VertexModel(`test`);
    let copy = Object.assign({}, modelBeforeRunningFunc);
    modelBeforeRunningFunc.create({name: 'Tanner'})
    assert.equal(modelBeforeRunningFunc, copy)
  })
})

describe('VertexModel.create', () => {
    it('should return a string', function() {
      let testGremlinSting = vertex.VertexModel.create('test')
      assert.equal(typeof testGremlinSting, "string")
    })
})

describe('EdgeModel', function() {
  it('should create an Edge Model',function () {
    let testModel = vertex.EdgeModel('test')
    assert.equal(typeof(testModel), "object")
  })
})

describe('Validate Props', function() {
  it('should create Edge Model constructor',function () {
    
  })
})