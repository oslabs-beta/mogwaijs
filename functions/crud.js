const Edge = require('./edgeModel');
const Vertex = require('./vertexModel');

/**  Remote Connect
 * @param {String} db - the name of the Database. 
 * @param {String} coll - the name of the Collection in the Database.
 * @param {String} primaryKey - your API key to the Database.
 * @param {String} uri - Your Database's endpoint.
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
return client;
}

/**  Local Connect
 * @param {String} username - your Username passed in as a string
 * @param {String} password - your Password passed in as a string
 * @param {String} uri - Your Database's endpoint 
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
return client;
}

/* 

Notes
> Stretch goal - configure for DB hosts other than CosmosDB. 

> Try THIS for our local connection:

'use strict';

const gremlin = require ('gremlin');

const url = 'ws://localhost:8182/gremlin';
const Client  = gremlin.driver.Client;
const client = new Client (url, 'g');

async function f ()
{
  try
  {
    let data = await client.submit ('ConfiguredGraphFactory.create("mycustomgraph"); 0');
    console.log (data);
  }
  catch (err)
  {
    console.log (err);
  }
}
f ();
*/ 