const Edge = require('./edgeModel');
const Vertex = require('./vertexModel');


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