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

  let findVertexGremlinString = `g.V()`;
  const propsObj = Object.assign({}, props);
    for (key in propsObj){
      findVertexGremlinString += `.has('${key}', ${key})`
    }
    return client.submit(findVertexGremlinString, props)
}

/** Create method
 * @param {Object} schema - an object containing property names as keys; 
 * values are the constructor for the type of data contained at this key 
*/  

VertexModel.prototype.createVertex = function create(schema = {}) {
  if (typeof schema !== 'object') throw new Error (`Error: Schema must be an object!`)
    let gremlinString = `g.addV('${this.label}')`;
    const propsObject = Object.assign({}, schema);
        for (key in propsObject){
          gremlinString += `.property('${key}', ${key})`
        }
    return client.submit(gremlinString, propsObject)
}

/** findVertexByProps method
 * @param {Object} props - an object containing property names as keys and strings as values. 
 * The values should correlate to the key/value pairs of a particular node. 
 * 
*/  
VertexModel.prototype.findVertexByProps = function findVertexByProps(props) {
    if (typeof props !== 'object') throw new Error (`Error: Props must be an object!`)
    let findVertexGremlinString = `g.V('${this.label}')`;
    const propsObj = Object.assign(props, {});
        for (key in propsObj){
            findVertexGremlinString += `.has('${key}', ${key})`
        }
    return client.submit(findVertexGremlinString, propsObj)
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
  let gremlinString = findVertexByProps(props);
    //Declare typeof Object to match SCHEMA property values to their type
  const typeObj = {
    'string' : String,
    'number' : Number,
    'boolean' : Boolean,
    'undefined' : undefined,
  };
      //Assigns a new property to this.schema for every prop passed into the Prop Arg. 
  let propArray = Object.entries(props);
    for (let i = 0; i < propArray.length; i++){
      //if the Schema for that node DOES NOT have that property attached to it, then alter the schema to include that property as well. 
      let currentPair = propArray[i];
      if (!this.currentPair[0]){
        this[currentPair[0]] = typeObj[typeof currentPair[1]];
      }
  }
  // Adds a new line to the gremlinString for every prop in props object. 
  // The gremlin string will then be filled with the props when returning client.submit? I think? 
   for (key in props){
    gremlinString += `.property('${key}', ${props[key]})`
   }
  return client.submit(gremlinString, props);
}
  
/** deleteVertex method
 * @param {Object} node - a reference to the original node, 
 * used to find the corresponding Vertex and then remove it. 
*/ 

VertexModel.prototype.deleteVertex = function deleteVertex(props){
  if (typeof props !== 'object') throw new Error (`Error: Props must be an object!`)
  let gremlinString = findVertex(props);
  return client.submit(`(${gremlinString}).remove()`);
}

/** 
 * @param {Object\|String} relprops - A string containing the name of the relationship or an 
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
    Object.keys(relProps).forEach((key) => {
      if (key !== 'label') {
        qString += `.has('${key}', ${key})`;
      }
    });
    qString += `.inV().as('target')`;
    // g.V().match(__.as('source).outE(label).has('prop', prop).inV().as('target')
  } else throw new Error('First argument must be string or object');

  // validate the target props object
  if (Object.keys(targetProps).length > 0) {
    qObj = {...qObj, ...targetProps}
    qString += `, __.as('target')`
    Object.keys(targetProps).forEach((key) => {
      if (key !== 'label') {
        qString += `.has('${key}', ${key})`;
      }
    });
    // ', __.as('target').has('prop', prop)'
  }
  qString += `).select('source', 'target')`;

  return client.submit(qString, qObj);
}


module.exports = VertexModel;

/*
Notes 
 > change variable names to match MATCH- universal variable names will help with future iterations
*/