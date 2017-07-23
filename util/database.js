const winston = require('winston');
const mongo = require('mongodb');
var serverInstance = {};
var dbReference = {};

module.exports = {
    createConnection: createConnection,
    insertToCollection: insertToCollection,
    getCollection: getCollection,
    updateInCollection: updateInCollection
}

function createConnection() {
    serverInstance = new mongo.Server(process.env.MONGO_URL, 27017, {auto_reconnect: true});
    dbReference = new mongo.Db('lodbot', serverInstance);
    dbReference.open(function(err, dbReference) {
        if (!err) {
            winston.log('info', 'Connected to MongoDB');
        } else {
            winston.log('error', 'Error connecting to MongoDB: ' + err);
        }
    })
}

function insertToCollection(collectionName, data) {
    dbReference.collection(collectionName, function(err, collectionReference) {
        collectionReference.insert(data, function(err, result) {
            // Do something with the data here
        })
    })
}

function getCollection(collectionName, objectName) {
    var collection = dbReference.collection(collectionName);
    return collection.find().toArray();
}

function updateInCollection(collectionName, object) {
    var collection = dbReference.collection(collectionName);
    collection.updateOne(
        { name: object.name },
        object,
        true
    );
}
