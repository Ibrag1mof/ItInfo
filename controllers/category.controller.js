const { mongoose } = require("mongoose")
const Category = require("../models/Category")
const {categoryValidation} = require("../validations/category")


const errorHandler = (res,error)=>{
    res.status(500).send({message:`Xatolik: ${error}`})
}

const addCategory = async (req,res)=>{
    try {
        const {error} = categoryValidation(req.body)
        if(error){
            console.log(error)
            return res.status(400).send({message:error.details[0].message})
        }
        const {category_name,parent_category_id} = req.body
        if(parent_category_id !== undefined){
            let check = await Category.findOne({category_name})
            if(check){
                return res.status(500).send({message:"The category has already added"})
            }
        const data = await Category({category_name,parent_category_id})
        await data.save()
        return res.status(200).send({message:"The category is added! "})
        }
        let check = await Category.findOne({category_name})
        if(check){
            return res.status(500).send({message:"The category has already been added"})
        }
        const data = await Category({category_name,parent_category_id})
        await data.save()
        return res.status(200).send({message:"The category is added"})
    } catch (error) {
        errorHandler(res,error)
    }
}
const getCategories = async (req,res) =>{
    try {
        const data = await Category.find({})
        if(!data){
            return res.status(404).send({message:"Information not found"})
        }
        console.log(data);
        res.send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}

const getCategory = async (req,res) =>{
    try {
        const id = req.params.id
        const data = await Category.findById(id)
        res.status(200).send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}

const updateCategory = async (req,res) =>{
    try {
        const id = req.params.id
        const data = await Category.findById(id)
        if(!data){
            return res.status(404).send("Not found this such Id")
        }
        const {error,value} = categoryValidation(req.body)
        if(error){
            console.log(error)
            return res.status(400).send({message:error.details[0].message})
        }
        const {category_name,parent_category_id} = value
        await Category.findByIdAndUpdate({_id:id},{category_name,parent_category_id})
        res.status(200).send("Category is updated")
    } catch (error) {
        errorHandler(res,error)
    }
}

const deleteCategory = async (req,res) =>{
    try {
        const id = req.params.id
        const data = await Category.findByIdAndDelete(id)
        if(!data){
            return res.status(404).send("Not found such id")
        }
        res.status(200).send("Category is deleted")
    } catch (error) {
        errorHandler(res,error)
    }
}
module.exports = {
    addCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}