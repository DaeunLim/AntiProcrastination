const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017")
.then(()=>{
    console.log("MongoDB Connected")
})
.catch((error)=> {
    console.log(error)
})

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const collection = mongoose.model("Users",userSchema)

module.exports=collection