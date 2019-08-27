/**
 * 
 * @param {String} label - "the edge type: required;" 
 * @param {Object} schema - "an object containing property names as keys; values are the constructor for the type of data contained at this key"
 */

function EdgeModel(label, schema = {}) {
  this.label = label;


  Object.entries(schema).forEach(keyValuePair => {
    this[keyValuePair[0]] = keyValuePair[1];
  })
}

/**
  * @param {Object} firstNode -"the name of the first node in the relationship which points to the second node"
 * @param {Object} secondNode-"the name of the second node in the relationship; this node is pointed to"
 * @param {Object} props-"an object containing property names as keys; values are the constructor for the type of data contained at this key"
 */
EdgeModel.prototype.createEdge = function createEdge(fromNode, toNode, props) {

  const typeObj = {
    'string' : String,
    'number' : Number,
    'boolean' : Boolean,
    'undefined' : undefined,
  };

  const qString = `g.V(from).addE('${this.label}').to(g.V(to))`;

  const created = Object.assign({}, props);
  Object.keys(props).forEach((prop) => {
    created[prop] = created[prop][props[prop]];

    qString += `.property('${prop}', ${prop})`
  })

  if(!this[prop]){
    this[prop] = typeObj[typeof prop];
  }
  
  return client.submit(qString, {from: fromNode, to: toNode, ...props})
  };

/** 
 * @param {Object} fromNode
 * @param {Object} toNode
 * @param {Object} props
 * @param {String} edgeLabel
 */

EdgeModel.prototype.addPropsToEdge = function addPropsToEdge(fromNode, toNode, props, err, callback, edgeLabel) {
  let qString = ``;
  const typeObj = {
    'string' : String,
    'number' : Number,
    'boolean' : Boolean,
    'undefined' : undefined,
  };

  if(!this[prop]){
    this[prop] = typeObj[typeof prop];
  }

  if(!(fromNode && toNode)){
    qString += `g.E(edgeLabel)`;
    const created = Object.assign({}, props);
    Object.keys(props).forEach((prop) => {
      created[prop] = created[prop][props[prop]];

      qString += `.property('${prop}', ${prop})`
    })
  }
  else {
    qString = `g.V(from).outE(edgeLabel).as('a').inV(to).select('a')`

    const created = Object.assign({}, props);
    Object.keys(props).forEach((prop) => {
      created[prop] = created[prop][props[prop]];

      qString += `.property('${prop}', ${prop})`
    })
  }


  return client.submit(qString, {from: fromNode, to: toNode, ...props, edgeLabel: edgeLabel})
}



module.exports = EdgeModel;
