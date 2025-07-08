import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected succesfully'));
        await mongoose.connect(`${process.env.MONGODB_URI}/taskhub`);
    } catch (error: any) {
        console.error(error.message);
    }
};

export default connectDB;
