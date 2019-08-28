const util = require('util');

/**  Vertex Model
 * @param {String} label - the vertex 'type'; required;
 * @param {Object} schema - an object containing property names as keys; values are the constructor for the type of data contained at this key 
*/
function VertexModel(label, schema = {}) {
  if (!label || typeof label !== 'string') throw new Error (`Error: Label must be a string!`)
    this.label = label;
    Object.entries(schema).forEach((keyValuePair) => {
      this[keyValuePair[0]] = keyValuePair[1];
    });
}

// Helper Function
function findVertex(props){

  let qString = `g.V()`;
  qString += util.hasPropsFromObj(props);
  return client.submit(qString, props)
}

/** Create method
 * @param {Object} schema - an object containing property names as keys; 
 * values are the constructor for the type of data contained at this key 
*/  

VertexModel.prototype.createVertex = function create(schema = {}) {
  if (typeof schema !== 'object') throw new Error (`Error: Schema must be an object!`)
    let qString = `g.addV('${this.label}')`;
    qString += util.addPropsFromObj(props);
    return client.submit(qString, propsObject)
}

/** findVertexByProps method
 * @param {Object} props - an object containing property names as keys and strings as values. 
 * The values should correlate to the key/value pairs of a particular node. 
 * 
*/  
VertexModel.prototype.findVertexByProps = function findVertexByProps(props) {
    if (typeof props !== 'object') throw new Error (`Error: Props must be an object!`)
    let qString = `g.V('${this.label}')`;
    qString += util.hasPropsFromObj(props);
    return client.submit(qString, propsObj)
}

/** addPropsToVertex method
 * @param {Object} node - a reference to the original node, 
 * used to find the corresponding Vertex and add the k/v pairs in PROPS to it.
 * @param {Object} props - an object containing property names as keys and strings as values. 
 * The values should correlate to the key/value pairs of a particular node. 
 * 
*/  
VertexModel.prototype.addPropsToVertex = function addPropsToVertex(props) {
  if (typeof props !== 'object') throw new Error (`Error: Props must be an object!`)
  let qString = findVertexByProps(props);
    //Declare typeof Object to match SCHEMA property values to their type
  const typeObj = {
    'string' : String,
    'number' : Number,
    'boolean' : Boolean,
    'undefined' : undefined,
  };
  // Assigns a new property to this.schema for every prop passed into the Prop Arg. 
  // Adds a new line to the gremlinString for every prop in props object. 
  // The gremlin string will then be filled with the props when returning client.submit? I think? 
  qString += util.addPropsFromObj(props);
  return client.submit(qString, props);
}
  
/** deleteVertex method
 * @param {Object} node - a reference to the original node, 
 * used to find the corresponding Vertex and then remove it. 
*/ 

VertexModel.prototype.deleteVertex = function deleteVertex(props){
  if (typeof props !== 'object') throw new Error (`Error: Props must be an object!`)
  let qString = findVertex(props);
  return client.submit(`(${qString}).remove()`);
}

/** 
 * @param {Object\|String} relProps - A string containing the name of the relationship or an 
 * object containing a key 'label' containing the name of the relationship and other properties
 * of the relationship
 * @param {Object} [targetProps] - An object containing properties of the target vertices
 * for matching
 *
 */

VertexModel.prototype.match = function match(relProps = '', targetProps = {}) {
  let qString = `g.V().match(__.as('source')`;
  let qObj = {};
  // validate the relationship argument
  if (relProps === '') throw new Error('Relationship label cannot be undefined');
  if (typeof relProps === 'string') {
    qObj.label = relProps;
    qString += `.out(label).as('target')`;
    // full string so far would be 'g.V().match(__.as('source').out(label).as('target')'
  } else if (typeof relProps === 'object' && !Array.isArray(relProps)) {
    // if the edge has properties, then we select edges on those properties
    qObj = {...qObj, ...relProps}
    qString += `.outE(label)`
    
    if (!Object.keys(relProps).includes('label')) throw new Error('Relationship label cannot be undefined');
    
    qString += util.hasPropsFromObj(relProps, false);
    qString += `.inV().as('target')`;
    // example:
    // g.V().match(__.as('source).outE(label).has('prop', prop).inV().as('target')
  } else throw new Error('First argument must be string or object');

  // validate the target props object
  if (Object.keys(targetProps).length > 0) {
    qObj = {...qObj, ...targetProps}
    qString += `, __.as('target')`
    qString += util.hasPropsFromObj(targetProps, false);
    // example:
    // ', __.as('target').has('prop', prop)'
  }
  qString += `).select('source', 'target')`;

  return client.submit(qString, qObj);
}


module.exports = VertexModel;

