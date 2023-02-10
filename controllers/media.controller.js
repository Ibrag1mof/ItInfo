const Media = require("../models/Media")

const {mediaValidation} = require("../validations/media")

const errorHandler = (req,res) =>{
    res.status(500).send({message:`Error : ${PORT}`})
}

const addMedia = async (req,res) =>{
    try {
        const {error,value} = mediaValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {media_name,media_file,target_table_name,target_table_id} = value
        const data = await Media({media_name,media_file,target_table_name,target_table_id})
        await data.save()
        res.status(200).send("Ok. Media is added")
    } catch (error) {
        errorHandler(res,error)
    }
}

const getMedias = async (req,res) => {
    try {
        const data = await Media.find({})
        if(!data) res.status(500).send("Ma'lumot topilmadi")
        res.status(200).send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}
const getMedia = async (req,res) =>{
    try {
        const id = req.params.id
        const idData = await Media.findById(id)
        if(!idData) return res.status(200).send("Id xato berilgan.")
        res.status(200).send(idData)
    } catch (error) {
        errorHandler(res,error)
    }
}

const updateMedia = async (req,res) => {
    try {
        const id = req.params.id
        const {error,value} = mediaValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {media_name,media_file,target_table_name,target_table_id} = value
        const idData = await Media.findById(id)
        if(!idData) return res.status(500).send("Not found with entered Id")
        await Media.findByIdAndUpdate({_id:id},{media_name,media_file,target_table_name,target_table_id})
        res.status(200).send("Everything is Ok. mediaInfo is updated")
    } catch (error) {
        errorHandler(res,error)
    }
}
const deleteMedia = async (req,res) => {
    try {
        const id = req.params.id
        const idData = await Media.findById(id)
        if(!idData) return res.status(500).send("Not found with entered Id")
        await Media.findByIdAndDelete(id)
        res.status(200).send("Everything is Ok. mediaInfo is deleted")
    } catch (error) {
        errorHandler(res,error)
    }
}

module.exports = {
    addMedia,
    getMedias,
    getMedia,
    updateMedia,
    deleteMedia
}