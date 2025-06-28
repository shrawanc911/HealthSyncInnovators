import Patient from "../models/Patient.js";


const addAppointment = async(req,res) => {
    const { name , age , gender , symptoms , doctorType } = req.body 
    if(!name || !age || !gender || !symptoms || !doctorType){
        return res.status(400).json({error:"Data insufficient"});
    }
    try{
        const patient = await Patient({name,age,gender,symptoms,doctorType});
        await patient.save();
        return res.status(200).json({message:"Appointment addded successfully."});
    }catch(e){
        console.log("Error while add Appointment:",e);
        return res.status(501).json({message:"Internal Server error",error:e});
    }
}

const getPatient = async(req,res) => {
    try{
        const response = await Patient.find();
        if(!response){
            return res.status(404).json({message:"Data not found"});
        }
        return res.status(200).json({data:response});
    }catch(e){
        console.log("Error whille getPatient:",e);
        return res.status(500).json({message:"Internal Server error",error:e})
    }
}

export { addAppointment , getPatient }