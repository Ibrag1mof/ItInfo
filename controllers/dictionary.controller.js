const Dictionary = require("../models/Dictionary")

const {dictionaryValidation} = require("../validations/dictionary") 

const errorHandler = (res,error)=>{
    res.status(500).send({message:`Xatolik: ${error}`})
}

const addDictionary = async (req,res) =>{
    try {
        const {error,value} = dictionaryValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const { term,letter } = value
        let check = await Dictionary.findOne({term:{$regex:term,$options:"i"}})
        if(check){
            return res.status(500).send({message:"This is has already added"})
        }
        // const letter = term[0]
        const data = await Dictionary({term,letter})
        await data.save()
        res.status(200).send({message:"The term is added! "})
    } catch (error) {
        errorHandler(res,error)
    }
}
const getDictionaries = async (req,res) =>{
    try {
        const data = await Dictionary.find({})
        res.status(200).send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}
const updateDictionary = async(req,res)=>{
    try {
        const id = req.params.id
        const {error,value} = dictionaryValidation(req.body)
        if(error){
            return res.status(200).send({message:error.details[0].message})
        }
        const {term,letter} = value
        // const letter = term[0]
        await Dictionary.findByIdAndUpdate({_id:id},{term,letter})
        res.send("Term is succesfully updated")
    } catch (error) {
        errorHandler(res,error)
    }
}

const getDictionary = async (req,res) =>{
    try {
        const id = req.params.id
        const data = await Dictionary.findById(id)
        res.send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}
const deleteDictionary = async (req,res) =>{
    try {
        const id = req.params.id
        await Dictionary.findByIdAndDelete(id)
        res.send("The term is deleted")
    } catch (error) {
        errorHandler(res,error)
    }
}
const getTermByLetter = async (req,res) =>{
    try {
        const letter = req.params.letter
        const data = await Dictionary.find({letter})
        res.send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}
module.exports = {
    addDictionary,
    getDictionaries,
    updateDictionary,
    getDictionary,
    getTermByLetter,
    deleteDictionary
}