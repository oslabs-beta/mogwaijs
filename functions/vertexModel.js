/**  Vertex Model
 * @param {String} label - the vertex 'type'; required;
 * @param {Object} schema - an object containing property names as keys; values are the constructor for the type of data contained at this key 
*/

function VertexModel(label, schema = {}) {
    this.label = label;
    Object.entries(schema).forEach((keyValuePair) => {
      this[keyValuePair[0]] = keyValuePair[1];
    });
  }

function findVertex(props){

  let findVertexGremlinString = `g.V()`;
  const propsObj = Object.assign(props, {});

    for (key in propsObj){
      findVertexGremlinString += `.has('key', key)`
    }
  
    return client.submit(findVertexGremlinString, props)
}

/** Create method
 * @param {Object} schema - an object containing property names as keys; values are the constructor for the type of data contained at this key 
*/  

VertexModel.prototype.createVertex = function create(schema = {}) {
    let gremlinString = `g.addV('${this.label}')`;
    const propsObject = Object.assign(schema, {});
        for (key in propsObject){
        gremlinString += `.property('key', key)`
        }
    return client.submit(gremlinString, variablesObject)
}

// Test logs for Create Method
/*
const User = new VertexModel('User', {name: String, age: Number});
const eric = User.create({'eric': 'Eric', 'age' : 30})
*/

/** findVertexByProps method
 * @param {Object} props - an object containing property names as keys and strings as values. 
 * The values should correlate to the key/value pairs of a particular node. 
 * 
*/  
VertexModel.prototype.findByProps = function findVertexByProps(props) {
    let findVertexGremlinString = `g.V()`;
    const propsObj = Object.assign(props, {});
        for (key in propsObj){
            findVertexGremlinString += `.has('key', key)`
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
VertexModel.prototype.findVAndAddProps = function findVAndAddProps(node, props) {

  let gremlinString = findVertexByProps(node);
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
      if (!this[propArray[i][0]]){
        this[propArray[i][0]] = typeObj[typeof propArray[i][0]];
      }
  }
  // Adds a new line to the gremlinString for every prop in props object. 
  // The gremlin string will then be filled with the props when returning client.submit? I think? 
   for (key in props){
    gremlinString += `.property('${key}', ${props[key]})`
   }
  
  // return client.submit(gremlinString, props);
console.log(gremlinString);
}


//REFACTORED fVBP method

/** addPropsToVertex method
 * @param {Object} node - a reference to the original node, 
 * used to find the corresponding Vertex and add the k/v pairs in PROPS to it.
 * @param {Object} props - an object containing property names as keys and strings as values. 
 * The values should correlate to the key/value pairs of a particular node. 
 * 
*/ 
VertexModel.prototype.findVertexByProps = function findVertexByProps(props) {
    let findVertexGremlinString = `g.V()`;
    const propsObj = Object.assign(props, {});
  
   for (key in propsObj){
     findVertexGremlinString += `.has('key', key)`
   }
  
    return client.submit(findVertexGremlinString, propsObj)
    // console.log(findVertexGremlinString)
  }
  
/** deleteVertex method
 * @param {Object} node - a reference to the original node, 
 * used to find the corresponding Vertex and then remove it. 
*/ 
VertexModel.prototype.deleteVertex = function deleteVertex(node){
  let gremlinString = findVertex(node);

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
    Object.keys(relProps).forEach((key) => {
      if (key !== 'label') {
        qString += `.has('${key}', ${key})`;
      }
    });
    qString += `.inV().as('target)'`;
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

  return qString;
}


module.exports = VertexModel;
  