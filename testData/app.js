"use strict";

const Gremlin = require('gremlin');

const config = require("./config");
const cohort = require('./cohortMembers');
const groups = require('./seniorGroups');
const teams = require('./teammembers');

const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${config.database}/colls/${config.collection}`, config.primaryKey)

const client = new Gremlin.driver.Client(
    config.endpoint, 
    { 
        authenticator,
        traversalsource : "g",
        rejectUnauthorized : true,
        mimeType : "application/vnd.gremlin-v2.0+json"
    }
);


function dropGraph()
{
    console.log('Running Drop');
    return client.submit('g.V().outE().drop()', { })
        .then(()=> client.submit('g.V().drop()', { }))
        .then(function (result) {
            console.log("Result: %s\n", JSON.stringify(result));
    })
    .catch(err => console.log(err));
}

const createVertices = (dataArray) => {
    const promises = [];

    dataArray.forEach(el => {
        promises.push(client.submit("g.addV(label).property('id', id).property('firstName', firstName).property('age', age).property('userid', userid).property('key', '0')", el));
    })
    return Promise.all(promises)
    .then(data => console.log('It works!'))
    .catch(err => console.log(err));
}

const createGroups = (groups) => {
    const promises = [];

    groups.forEach(el=>{
        promises.push(client.submit("g.addV(label).property('id', id).property('groupName', groupName).property('projectTitle', projectTitle).property('key', '0')", el));
    })
    return Promise.all(promises)
    .then(data => { console.log(`Created groups!`)
    })
    .catch(err => console.log(`There was an error: ${err}`));
}

const createEdges = (groupsArray) => {
    const promises = [];

    groupsArray.forEach(edge => {
        promises.push(client.submit("g.V(source).addE(relationship).to(g.V(target))", edge))
    });
    return Promise.all(promises).then(data => console.log('Edges worked!')).catch(err => console.log(err));
}

function countVertices()
{
    console.log('Running Count');
    return client.submit("g.V().count()", { }).then(function (result) {
        console.log("Result: %s\n", JSON.stringify(result));
    });
}

function finish()
{
    console.log("Finished");
    console.log('Press any key to exit');
    
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}

client.open()
    .then(dropGraph)
    .then(() => createVertices(cohort))
    .then(() => createGroups(groups))
    .then(() => createEdges(teams))
    // .then(addEdge) Not applicable to OUR database.
    .then(countVertices)
    .catch((err) => {
        console.error("Error running query...");
        console.error(err)
    }).then((res) => {
        client.close();
        finish();
    }).catch((err) => 
        console.error("Fatal error:", err)
    );
    
    

