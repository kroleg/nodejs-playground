import {MongoClient} from "mongodb";

export class Db {
    private connection: MongoClient;
    private readonly mongoUrl: string;

    constructor (mongoUrl: string){
        this.mongoUrl = mongoUrl
    }

    async connect() {
        this.connection = await MongoClient.connect(this.mongoUrl);
        console.info('test env connected to mongodb')
    }

    async disconnect() {
        this.connection && this.connection.close();
    }

    async wipeUsers() {
        return this.connection.db().collection('users').deleteMany({});
    }

    async getAllUsers() {
        return this.connection.db().collection('users').find({}).toArray()
    }
}