const Social = require("../models/Social")

const {socialValidation} = require("../validations/social")

const errorHandler = async (req,res) =>{
    res.status(500).send({message:`Xatolik ${error}`})
}

const addSocial = async (req,res) =>{
    try {
        const {error,value} = socialValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {social_name,social_icon_file} = value
        const data = await Social({social_name,social_icon_file})
        await data.save()
        res.status(200).send({message:`Social is added !`})
    } catch (error) {
        errorHandler(res,error)
    }
}

const getSocials = async (req,res) =>{
    try {
        const result = await Social.find({})
        if(!result) res.status(400).send("Ma'lumot topilmadi")
        res.status(200).send(result)
    } catch (error) {
        errorHandler(res,error)
    }
}

const getSocial = async (req,res) =>{
    try {
        const id = req.params.id
        const data = await Social.findById(id)
        if(!data) res.status(400).send("Id bo'yicha ma'lumot topilmadi")
        res.status(200).send(data)
    } catch (error) {
        errorHandler(res,error)    
    }
}

const updateSocial = async (req,res) =>{
    try {
        const id = req.params.id
        const {error,value} = socialValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {social_name,social_icon_file} = value
        const idData = Social.findById(id)
        if(!idData) return res.status(400).send("Id incorrect")
        const data = await Social.findByIdAndUpdate({_id:id},{social_name,social_icon_file})
        await data.save()
        res.status(200).send("Social is updated")
    } catch (error) {
        errorHandler(res,error)
    }
}

const deleteSocial = async (req,res) =>{
    try {
        const id = req.params.id
        const info = await Social.findOne({_id:id})
        if(!info) res.status(400).send("Id bo'yicha ma'lumot topilmadi")
        await Social.findByIdAndDelete(id)
        res.status(200).send("Social is deleted")
    } catch (error) {
        errorHandler(res,error)
    }
}

module.exports = {
    addSocial,
    getSocial,
    getSocials,
    updateSocial,
    deleteSocial
}