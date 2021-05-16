import mongoose from 'mongoose'

const roomSchema=mongoose.Schema({
    room: String,
});

export default mongoose.model('rooms', roomSchema)