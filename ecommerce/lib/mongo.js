const { MongoClient, ObjectId } = require('mongodb')
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/test?retryWrites=true&w=majority`;

class MongoLib {
    constructor() {
        this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = DB_NAME;
    }

    connect() {
        if (!MongoLib.connection) {
            MongoLib.connection = new Promise((resolve, reject) => {
                this.client.connect(error => {
                    if (error) {
                        reject(error);
                    }

                    console.log('Connected successfully to mongo');
                    resolve(this.client.db(this.dbName))
                })
            })
        }

        return MongoLib.connection;
    }

    getAll(collection, query) {
        return this.connect().then(db => {
            return db
                .collection(collection)
                .find(query)
                .toArray();
        })
    }

    get(collection, id) {
        return this.connect().then(db => {
                return db
                    .collection(collection).findOne({ _id: ObjectId(id) })
            })
            .catch(err => {
                console.log(err);
            })
    }

    create(collection, data) {
        return this.connect()
            .then(db => {
                return db.collection(collection).insertOne(data);
            })
            .then(result => result.insertedId)
            .catch(err => {
                console.log(err);
            })
    }

    update(collection, id, data) {
        return this.connect()
            .then(db => {
                return db
                    .collection(collection)
                    .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true })
            })
            .then(result => result.upsertedId || id)
            .catch(err => {
                console.log(err);
            })
    }

    delete(collection, id) {
        return this.connect()
            .then(db => {
                return db
                    .collection(collection).deleteOne({ _id: ObjectId(id) });
            })
            .then(() => id)
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = MongoLib;