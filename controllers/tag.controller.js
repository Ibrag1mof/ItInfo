const Tag = require("../models/Tag")
const Topic = require("../models/Topic")
const Category = require("../models/Category")

const {tagValidation} = require("../validations/tag")

const errorHandler = (res,error) =>{
    res.status(500).send({message:`Xatolik: ${error}`})
}

const addTag = async (req,res) => {
    try {
        const {error,value} = tagValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {topic_id,category_id} = value
        let check = await Topic.findById(topic_id)
        let check2 = await Category.findById(category_id)
        if(!check) return res.status(400).send({message:"topic_id xato kiritilgan"})
        if(!check2) return res.status(400).send({message:"category_id xato kiritilgan"})
        const response = await Tag({topic_id,category_id})
        await response.save()
        res.status(200).send({message:"Everything is OK. Tag is added"})
    } catch (error) {
        errorHandler(res,error)
    }
}

const getTags = async (req,res) =>{
    try {
        const data = await Tag.find({})
        if(!data) return res.status(400).send("Information is not found")
        res.status(200).send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}

const getTag = async (req,res) =>{
    try {
        const id = req.params.id
        const idData = await Tag.findById(id)
        if(!idData) return res.status(400).send("Id bo'yicha ma'lumot topilmadiku!")
        res.status(200).send({message:idData})
    } catch (error) {
        errorHandler(res,error)
    }
}

const updateTag = async (req,res) => {
    try {
        const id = req.params.id
        const {error,value} = tagValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {topic_id,category_id} = value
        let check = await Topic.findById(topic_id)
        let check2 = await Category.findById(category_id)
        if(!check) return res.status(400).send("Topic_id xato kiritilgan.")
        if(!check2) return res.status(400).send("Category_id xato kiritilgan")
        await Tag.findByIdAndUpdate({_id:id},{topic_id,category_id})
        res.status(200).send("Everything is OK. tagInfo is updated")
    } catch (error) {
        errorHandler(res,error)
    }
}

const deleteTag = async (req,res) =>{
    try {
        const id = req.params.id
        const idData = await Tag.findById(id)
        if(!idData) return res.status(400).send("id bo'yicha ma'lumot yo'q")
        await Tag.findByIdAndDelete(id)
        res.status(200).send("Everything is Ok. tagInfo is deleted")
    } catch (error) {
        
    }
}
module.exports = {
    addTag,
    getTag,
    getTags,
    updateTag,
    deleteTag
}