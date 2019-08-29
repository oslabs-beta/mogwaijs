const assert = require('assert');
const vertex = require('../functions/vertexModel')
const EdgeModel = require('../functions/edgeModel')
const crud = require('../functions/crud')


// add instance of promise check to each and every function
// cannot output a string if it outputs a promise
// figure out to how check what output would be at a break point
// figure out what is returned when a test is completed
// add test for match function

// VertexModel Tests
describe('VertexTests', function() {
  describe('VertexModel', () => {
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
    it('should return a promise', () => {
      let exampleCreateModel = vertex.createModel();
      assert.equal(exampleCreateModel instanceof Promise, true)
    })
  })
  describe('createVertex', () => {
      it('should return a string', function() {
        let testGremlinSting = vertex.VertexModel.create('test')
        assert.equal(typeof testGremlinSting, "string")
      })
      it('should return a promise', () => {
        let examplecreateVertex = vertex.createVertex();
        assert.equal(examplecreateVertex instanceof Promise, true)
      })
  })
  describe('findVertexByProps', () => {
    it('should return a promise', () => {
      let exampleFindVertedByProps = vertex.findVertexByProps();
      assert.equal(exampleFindVertedByProps instanceof Promise, true)
    })
  })
  describe('addPropsToVertex', () => {
    it('should return a promise', () => {
      let exampleAddPropsToVertex = vertex.addPropsToVertex();
      assert.equal(exampleAddPropsToVertex instanceof Promise, true)
    })
  })
  describe('deleteVertex', () => {
    it('should return a promise', () => {
      let exampleDeleteVertex = vertex.deleteVertex();
      assert.equal(exampleDeleteVertex instanceof Promise, true)
    })
  })
  describe('match', () => {
    it('should return a promise', () => {
      let exampleMatch = vertex.match();
      assert.equal(exampleMatch instanceof Promise, true)
    })
  })
})

// EdgeModel Tests

describe('EdgeModel', function() {
  describe('EdgeModel', () => {
    it('should output an object', () => {
      let testModel = EdgeModel.EdgeModel('test')
      assert.equal(typeof testModel, "object")
    })
    it('should return a promise', () => {
      let exampleEdgeModel = vertex.EdgeModel();
      assert.equal(exampleEdgeModel instanceof Promise, true)
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