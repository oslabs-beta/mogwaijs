const Gremlin = require('gremlin');

const mogwai = {
  client: undefined,
  Vertex: VertexModel,
  Edge: EdgeModel,
  remoteConnect: remoteConnect,
  localConnect: localConnect,
}

/**  Remote Connect
 * @param {String} db - the name of the database. 
 * @param {String} coll - the name of the collection in the database.
 * @param {String} primaryKey - The API key provided by the remote server
 * @param {String} uri - Database's endpoint.
*/

function remoteConnect(db, coll, primaryKey, uri){
    const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${db}/colls/${coll}`, primaryKey)

const client = new Gremlin.driver.Client(
    uri, 
    { 
        authenticator,
        traversalsource : "g",
        rejectUnauthorized : true,
        mimeType : "application/vnd.gremlin-v2.0+json"
    }
);
mogwai.client = client;
return client;
}

/**  Local Connect
 * @param {String} username - Database username
 * @param {String} password - Database password
 * @param {String} uri - The database's endpoint 
*/

function localConnect(username, password, uri){
  const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`'${username}', '${password}'`)

  const client = new Gremlin.driver.Client(
    uri, 
    { 
        authenticator,
        traversalsource : "g",
        rejectUnauthorized : true,
        mimeType : "application/vnd.gremlin-v2.0+json"
    }
  );
  mogwai.client = client;
  return client;
}

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

/** Create method
 * @param {Object} schema - an object containing property names as keys; 
 * values are the constructor for the type of data contained at this key 
*/  

VertexModel.prototype.createVertex = function create(props = {}) {
  if (typeof props !== 'object') throw new Error (`Error: Schema must be an object!`);

    let qString = `g.addV('${this.label}')`;
    qString += this.addPropsFromObj(props);

    return mogwai.client.submit(qString, props);
}

/**
 * @param {Object} props - an object containing property names as keys and strings as values. 
 * The values should correlate to the key/value pairs of a particular node. 
 * 
*/  
VertexModel.prototype.findVertexByProps = function findVertexByProps(props) {
    if (typeof props !== 'object') throw new Error (`Error: Props must be an object!`);

    let qString = `g.V()`;
    qString += this.hasPropsFromObj(props);

    return mogwai.client.submit(qString, props);
}

/** 
 * @param {Object} node - a reference to the original node, 
 * used to find the corresponding Vertex and add the k/v pairs in PROPS to it.
 * @param {Object} props - an object containing property names as keys and strings as values. 
 * The values should correlate to the key/value pairs of a particular node. 
 * 
*/  
VertexModel.prototype.addPropsToVertex = async function addPropsToVertex(findProps, addProps) {
  if (typeof findProps !== 'object') throw new Error (`Error: findProps must be an object!`);
  if (typeof addProps !== 'object') throw new Error (`Error: addProps must be an object!`);

  let vertex = await this.findVertexByProps(findProps);
  if (vertex.length === 0) return new Promise((resolve, reject)=>{
    return reject(new Error(`Error: vertex not found!`));
  });
  vertex = vertex['_items'][0].id;

  let qString = `g.V(id)`;
  qString += this.addPropsFromObj(addProps);

  return mogwai.client.submit(qString, {...addProps, id: vertex});
}
  
/** 
 * @param {Object} node - a reference to the original node, 
 * used to find the corresponding Vertex and then remove it. 
*/ 

VertexModel.prototype.deleteVertex = async function deleteVertex(props) {
  if (typeof props !== 'object') throw new Error (`Error: Props must be an object!`);

  let vertex = await this.findVertexByProps(props);
  if (vertex.length === 0) return new Promise((resolve, reject)=>{
    return reject(new Error(`Error: vertex not found!`));
  });
  vertex = vertex['_items'][0].id;

  return mogwai.client.submit(`g.V(id).drop()`, {id:vertex});
}

/** 
 * @param {Object\|String} relProps - A string containing the name of the relationship or an 
 * object containing a key 'label' containing the name of the relationship and other properties
 * of the relationship
 * @param {Object} [targetProps] - An object containing properties of the target vertices
 * for matching
 *
 */

/*
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
    
    qString += this.hasPropsFromObj(relProps, false);
    qString += `.inV().as('target')`;
    // example:
    // g.V().match(__.as('source).outE(label).has('prop', prop).inV().as('target')
  } else throw new Error('First argument must be string or object');

  // validate the target props object
  if (Object.keys(targetProps).length > 0) {
    qObj = {...qObj, ...targetProps}
    qString += `, __.as('target')`
    qString += this.hasPropsFromObj(targetProps, false);
    // example:
    // ', __.as('target').has('prop', prop)'
  }
  qString += `).select('source', 'target')`;

  return mogwai.client.submit(qString, qObj);
}
*/

VertexModel.prototype.match = function match(relProps, targetProps) {
  let qString = `g.V()`;
  let qObj = {};
  
  if (typeof targetProps !== 'object') {
    return Promise.reject(new Error('Target properties must be an object'));
  }

  qString += this.hasPropsFromObj(targetProps);
  qString += `.as("target")`;
  Object.assign(qObj, targetProps);

  if(typeof relProps === 'string') {
    qObj.label = relProps;
    qString += '.inE(label)';
  } else if (typeof relProps === 'object') {
    if(!relProps.label) return Promise.reject(new Error('Relationship must have label'));
    qString += this.hasPropsFromObj(relProps);
  }

  qString += '.outV().as("source").select("source", "target")';

  return mogwai.client.submit(qString, qObj);
}

VertexModel.prototype.addPropsFromObj = (propsObj, checkModel = true) => {
  let qString = '';

  const typeObj = {
    'string' : String,
    'number' : Number,
    'boolean' : Boolean,
    'undefined' : undefined,
  };

  Object.keys(propsObj).forEach((key) => {
    if (key !== 'label') {
      qString += `.property('${key}', ${key})`;
    } 
    if (checkModel) {
      if (!this[key]){
          this[key] = typeObj[typeof propsObj[key]];
      }
    }
  });

  return qString;
}

VertexModel.prototype.hasPropsFromObj = (propsObj, checkModel = true) => {
  let qString = '';

  const typeObj = {
    'string' : String,
    'number' : Number,
    'boolean' : Boolean,
    'undefined' : undefined,
  };
  
  Object.keys(propsObj).forEach((key) => {
    if (key !== 'label') {
      qString += `.has('${key}', ${key})`;
    } 
    if (checkModel) {
      if (!this[key]){
          this[key] = typeObj[typeof propsObj[key]];
      }
    }
    });
  return qString;
}

/** Edge Model
 * @param {String} label - "the edge type: required;" 
 * @param {Object} props - "an object containing property names as keys; values are the constructor for the type of data contained at this key"
 */

function EdgeModel(label, props = {}) {
  if (typeof label === 'string') throw new Error('Edge label must be a string.');
  this.label = label;

  Object.entries(props).forEach(keyValuePair => {
    this[keyValuePair[0]] = keyValuePair[1];
  });
}

EdgeModel.prototype.findVertex = function findVertex(props){
  let qString = `g.V()`;
  qString += this.hasPropsFromObj(props);
  return mogwai.client.submit(qString, props);
}

EdgeModel.prototype.delete = async function deleteEdge(fromNode, toNode) {
  let qString = '';
  if (!(fromNode && toNode)) { 
    qString = `g.E('${this.label}').drop()`;
  }
   else {
    if (typeof fromNode !== 'object') throw new Error (`Error: fromNode must be a string!`);
    if (typeof toNode !== 'object') throw new Error (`Error: toNode must be a string!`);

    let fromV = await this.findVertex(fromNode);
    let toV = await this.findVertex(toNode);

    if (fromV.length === 0) return new Promise((resolve, reject)=> {
      return reject(new Error(`Error: From-vertex not found!`));
    });
    fromV = fromV['_items'][0].id;

    if (toV.length === 0) return new Promise((resolve, reject)=> {
      return reject(new Error(`Error: To-vertex not found!`));
    });
    toV = toV['_items'][0].id;

    qString += `g.V(from).bothE().where(otherV().is(to)).drop()`;
    return mogwai.client.submit(qString, {from: fromV, to: toV});
  }
  return mogwai.client.submit(qString, {});
}

/**
 * @param {Object} fromNode - the name of the source node in the relationship which points to the target node
 * @param {Object} toNode - the name of the target node in the relationship; this node is pointed to
 * @param {Object} props - an object containing property names as keys; values are the constructor for the type of data contained at this key
 * @return {Object} promise - the object returned from the client.submit method. 
 */
EdgeModel.prototype.createEdge = async function createEdge(fromNode, toNode, props) {
  let fromV = await this.findVertex(fromNode);
  if (fromV.length === 0) return new Promise((resolve, reject)=>{
    return reject(new Error(`Error: From-vertex not found!`))
  });
  fromV = fromV['_items'][0].id;

  let toV = await this.findVertex(toNode);
  if (toV.length === 0) return new Promise((resolve, reject)=>{
    return reject(new Error(`Error: To-vertex not found!`))
  });
  toV = toV['_items'][0].id;

  let qString = `g.V(from).addE('${this.label}').to(g.V(to))`;
  qString += this.addPropsFromObj(props);

  return mogwai.client.submit(qString, {from: fromV, to: toV, ...props});
};

/** 
 * @param {String} fromNode - the name of the source node in the relationship which points to the target node
 * @param {String} toNode - the name of the target node in the relationship; this node is pointed to
 * @param {Object} props - an object containing property names as keys; values are the constructor for the type of data contained at this key 
 * @return {Object} promise - the object returned from the client.submit method. 
 */
EdgeModel.prototype.addPropsToEdge = async function addPropsToEdge(fromNode, toNode, props) {
  if (typeof fromNode !== 'object') throw new Error (`Error: fromNode must be a string!`);
  if (typeof toNode !== 'object') throw new Error (`Error: toNode must be a string!`);
  if (typeof props !== 'object') throw new Error (`Error: props must be an object!`);

  let qString = ``;
  let fromV = await this.findVertex(fromNode);
  let toV = await this.findVertex(toNode);

  if(!(fromNode && toNode)){
    qString = `g.E(id)` + this.addPropsFromObj(props);
  } else {
    if (fromV.length === 0) return new Promise((resolve, reject)=>{
      return reject(new Error(`Error: From-vertex not found!`))
    })
    fromV = fromV['_items'][0].id;
    
    if (toV.length === 0) return new Promise((resolve, reject)=>{
      return reject(new Error(`Error: To-vertex not found!`))
    })
    toV = toV['_items'][0].id;

    qString += `g.V(from).outE('${this.label}').as('a').inV().has('id', to).select('a')` + this.addPropsFromObj(props);
  }

  return mogwai.client.submit(qString, {from: fromV, to: toV, ...props});
}

EdgeModel.prototype.addPropsFromObj = (propsObj, checkModel = true) => {
  let qString = '';

  const typeObj = {
    'string' : String,
    'number' : Number,
    'boolean' : Boolean,
    'undefined' : undefined,
  };

  Object.keys(propsObj).forEach((key) => {
    if (key !== 'label') {
      qString += `.property('${key}', ${key})`;
    } 
    if (checkModel) {
      if (!this[key]){
          this[key] = typeObj[typeof propsObj[key]];
      }
    }
  });

  return qString;
}

EdgeModel.prototype.hasPropsFromObj = (propsObj, checkModel = true) => {
  let qString = '';
  
  const typeObj = {
    'string' : String,
    'number' : Number,
    'boolean' : Boolean,
    'undefined' : undefined,
  };

  Object.keys(propsObj).forEach((key) => {
    if (key !== 'label') {
      qString += `.has('${key}', ${key})`;
    } 
    if (checkModel) {
      if (!this[key]){
          this[key] = typeObj[typeof propsObj[key]];
      }
    }
    });

  return qString;
}
module.exports = mogwai;
