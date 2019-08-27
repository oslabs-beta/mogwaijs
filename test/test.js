const assert = require('assert');
const vertex = require('../functions/crud')
const EdgeModel = require('../functions/edgeModel')

// VertexModel Tests

describe('VertexModel', function() {
  it('should generate a gremlin string without modifying the model', function() {
    const modelBeforeRunningFunc = vertex.VertexModel(`test`);
    let copy = Object.assign({}, modelBeforeRunningFunc);
    modelBeforeRunningFunc.create({name: 'Tanner'})
    assert.equal(modelBeforeRunningFunc, copy)
  })
  it('should output an object', () => {
    let testModel = vertex.VertexModel('test')
    assert.equal(typeof testModel, "object")
  })
})

describe('createVertex', () => {
    it('should return a string', function() {
      let testGremlinSting = vertex.VertexModel.create('test')
      assert.equal(typeof testGremlinSting, "string")
    })
})

describe('findVertexByProps', () => {
  it('should return a promise', () => {
    let exampleFindVertedByProps = vertex.findVertexByProps();
    assert.equal(exampleFindVertedByProps instanceof Promise, true)
  })
})

// EdgeModel Tests

describe('EdgeModel', function() {
  describe('create Edge Model', () => {
    it('should output an object', () => {
      let testModel = EdgeModel.EdgeModel('test')
      assert.equal(typeof testModel, "object")
    })
  })
  describe('createEdge', () => {
    it('should output a string',function () {
      let testCreateEdge = EdgeModel.createEdge()
      assert.equal(typeof testCreateEdge, 'string')
    })
    it('should return a promise', () => {
      let exampleCreateEdge = EdgeModel.createEdge();
      assert.equal(exampleCreateEdge instanceof Promise, true)
    })
  })
  describe('addPropsToEdge', () => {
    it('should output a string',function () {
      let testAddPropsToEdge = EdgeModel.addPropsToEdge()
      assert.equal(typeof testAddPropsToEdge, 'string')
    })
    it('should return a promise', () => {
      let exampleaddPropsToEdge = EdgeModel.addPropsToEdge();
      assert.equal(exampleaddPropsToEdge instanceof Promise, true)
    })
  })
})