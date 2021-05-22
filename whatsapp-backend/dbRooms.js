import mongoose from 'mongoose'

const roomSchema=mongoose.Schema({
    name: String,
    image:String,
    createdBy:String
});

export default mongoose.model('rooms', roomSchema)