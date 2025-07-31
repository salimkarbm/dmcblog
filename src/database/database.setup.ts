import mongoose, { connect } from 'mongoose';
import appConfig from '../config';

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

const address = `0.0.0.0:${appConfig.APP.port || 3000}`;

const database = appConfig.APP.database.uri;
const dbConnection = async () => {
    try {
        await connect(database);
        console.log(`Server started on PORT https://localhost:${address}`);
    } catch (error) {
        console.log(`Trouble connecting to Database with error: ${error}`);
    }
};
export default dbConnection;
