const Description = require("../models/Description")
const Dictionary = require("../models/Dictionary")
const Category = require("../models/Category")

const {descriptionValidation} = require("../validations/description")

const errorHandler = (res,error)=>{
    res.status(500).send({message:`Xatolik: ${error}`})
}

const addDescription = async (req,res) =>{
    try {
        const {error,value} = descriptionValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {dict_id,category_id,description} = value
        let ans1 = await Dictionary.findOne({_id:dict_id})
        let ans2 = await Category.findOne({_id:category_id})
        if(!ans1){
            return res.status(400).send({message:"Dictionarydan id topilmadi"})
        } 
        if(!ans2){
            return res.status(400).send({message:"Categorydan idga topilmadi"})
        }
        const data = await Description({dict_id,category_id,description})
        await data.save()
        res.status(200).send("Description is added! ")
    } catch (error) {
        errorHandler(res,error)
    }
}

const getDescriptions = async (req,res) =>{
    try {
        const data = await Description.find({}).populate("dict_id")
        if(!data){
            return res.status(404).send({message:"Information is not found"})
        }
        res.send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}

const getDescription = async(req,res) =>{
    try {
        const id = req.params.id
        const result = await Description.findById(id)
        console.log(result);
        if(!result){
            return res.status(400).send("Id bo'yicha ma'lumot topilmadi")
        }
        res.status(200).send(result)
    } catch (error) {
        errorHandler(res,error)
    }
}

const updateDescription = async (req,res) => {
    try {
        const id = req.params.id
        const {error,value} = descriptionValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {dict_id,category_id,description} = req.body
        let check = await Dictionary.findOne({_id:dict_id})
        let check2 = await Category.findById({_id:category_id})
        if(!check || !check2){
            return res.status(404).send("Id bo'yicha ma'lumot topilmadi")
        }
        const info = await Description.findByIdAndUpdate({_id:id},{dict_id,category_id,description})
        res.status(200).send("Description is updated ! ")
    } catch (error) {
        errorHandler(res,error)
    }
}

const deleteDescription = async (req,res) =>{
    try {
        const id = req.params.id
        const res = await Description.findById(id)
        if(!res){
            return res.send({message:"Id bo'yicha ma'lumot yo'q"})
        }
        await Description.findByIdAndDelete(id)
        res.send("Description is deleted")
    } catch (error) {
        errorHandler(res,error)
    }
}
module.exports  = {
    addDescription,
    getDescriptions,
    getDescription,
    updateDescription,
    deleteDescription

}