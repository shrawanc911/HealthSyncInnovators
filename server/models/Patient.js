import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true 
    },
    age:{
        type:Number,
        required:true 
    },
    gender:{
        type:String,
        required:true
    },
    symptoms:{
        type: [String],
    },
    doctorType:{
        type: String
    }
})

export default mongoose.model("Patient",patientSchema);