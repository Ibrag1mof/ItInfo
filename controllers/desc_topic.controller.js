const descTopic = require("../models/Desc_Topic")
const Description = require("../models/Description")
const Topic = require("../models/Topic")

const {desctopicValidation} = require("../validations/desc_topic")

const errorHandler = (res,error) =>{
    res.status(500).send({message:`Error ${error}`})
}

const addDescTopic = async (req,res) =>{
    try {
        const {error,value} = desctopicValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        } 
        const {desc_id,topic_id} = value
        let check = await Description.findById(desc_id)
        let check2 = await Topic.findById(topic_id)
        if(check == null || check2 == null) return res.status(400).send("desc_id or topic_id is incorrect!")
        const data = await descTopic({desc_id,topic_id})
        await data.save()
        res.status(200).send("Ok. descTopic is added")
    } catch (error) {
        errorHandler(res,error)
    }
}

const getDescTopics = async (req,res) =>{
    try {
        const data = await descTopic.find({})
        if(!data) return res.status(400).send("Data is not found")
        res.status(200).send(data)
    } catch (error) {
        errorHandler(res,error)
    }
} 

const getDescTopic = async (req,res) =>{
    try {
        const id = req.params.id
        const idData = await descTopic.findById(id)
        if(!idData) return res.status(400).send("id is incorrect")
        res.status(200).send(idData)
    } catch (error) {
        errorHandler(res,error)
    }
}

const updateDescTopic = async (req,res)=>{
    try {
        const id = req.params.id
        const {error,value} = desctopicValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {desc_id,topic_id} = value
        let check = await Description.findById(desc_id)
        let check2 = await Topic.findById(topic_id)
        if(check == null || check2 == null) return res.status(400).send("desc_id or topic_id is incorrect!")
        const idData = await descTopic.findById(id)
        if(!idData) return res.status(400).send("id is incorrect")
        await descTopic.findByIdAndUpdate({_id:id},{desc_id,topic_id})
        res.status(200).send("Ok. descTopicInfo was updated")
    } catch (error) {
        errorHandler(res,error)
    }
}

const deletedescTopic = async (req,res)=>{
    try {
        const id = req.params.id
        const idData = await descTopic.findById(id)
        if(!idData) return res.status(400).send("id is incorrect")
        await descTopic.findByIdAndDelete(id)
        res.status(200).send("OK.desctopicInfo has been deleted")
    } catch (error) {
        errorHandler(res,error)
    }
}

module.exports = {
    getDescTopics,
    addDescTopic,
    getDescTopic,
    updateDescTopic,
    deletedescTopic
}