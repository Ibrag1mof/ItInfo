const Synonym = require("../models/Synonym")
const Description = require("../models/Description")
const Dictionary = require("../models/Dictionary")

const {synonymValidation} = require("../validations/synonym")

const errorHandler =  (res,error) =>{
    res.status(500).send(`Error : ${error}`)
}

const addSynonym = async (req,res) => {
    try {
        const {error,value} = synonymValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {desc_id,dict_id} = value
        let check = await Description.findById(desc_id)
        let check2 = await Dictionary.findById(dict_id)
        if(check == null || check2 == null) return res.status(400).send("Desc_id or Dict_id is Incorrect. Maybe both of them")
        const data = await Synonym({desc_id,dict_id})
        await data.save()
        res.status(200).send("Synonym is added Bro!")
    } catch (error) {
        errorHandler(res,error)
    }
}

const getSynonym = async (req,res) =>{
    try {
        const id = req.params.id
        let check = await Synonym.findById(id)
        if(check == null) return res.status(400).send("Id is incorrect")
        res.status(200).send(check)
    } catch (error) {
        errorHandler(res,error)
    }
}

const getSynonyms = async (req,res) => {
    try {
        const data = await Synonym.find({})
        if(data == null ) return res.status(400).send("Information is not found")
        res.status(200).send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}

const updateSynonym = async (req,res) =>{
    try {
        const id = req.params.id
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {desc_id,dict_id} = value
        let check = await Description.findById(desc_id)
        let check2 = await Dictionary.findById(dict_id)
        if(check == null || check2 == null) return res.status(400).send("Desc_id or Dict_id is Incorrect. Maybe both of them")
        await Synonym.findByIdAndUpdate({_id:id},{desc_id,dict_id})
        res.status(200).send("Ok. Synonyminfo was updated")
    } catch (error) {
        errorHandler(res,error)
    }
}

const deleteSynonym = async (req,res) =>{
    try {
        const id = req.params.id
        let idData = await Synonym.findOne({id})
        if(idData == null) return res.status(400).send("Id is incorrect")
        await Synonym.findByIdAndDelete(id)
        res.status(200).send("Ok. synonymInfo was deleted")
    } catch (error) {
        errorHandler(res,error)
    }
}

module.exports = {
    getSynonym,
    getSynonyms,
    addSynonym,
    updateSynonym,
    deleteSynonym
}