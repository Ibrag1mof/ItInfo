const deskQa = require("../models/Desc_QA")
const QuestionA = require("../models/QuestionA")
const Description = require("../models/Description")

const {deskqaValidation }= require("../validations/deskqa")

const errorHandler = (res,error) => {
    res.status(500).send({message:`Xatolik: ${error}`})
}

const addDeskQa = async (req,res) =>{
    try {
        const {error,value} = deskqaValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {qa_id,desc_id} = req.body
        let check = await QuestionA.findById(qa_id)
        let check2 = await Description.findById(desc_id)
        if(!check) return res.status(400).send("qa_id xato kiritilgan")
        if(!check2) return res.status(400).send("desc_id xato kiritilgan")
        const data = await deskQa({qa_id,desc_id})
        await data.save()
        res.status(200).send("OK. Qa_id va Desc_id qo'shildi deb hisoblayvering!")
    } catch (error) {
        errorHandler(res,error)
    }
}

const getDeskQas = async (req,res) => {
    try {
        const data = await deskQa.find({})
        if(data.length < 1) return res.status(400).send("Information is not found")
        res.status(200).send({message:data})
    } catch (error) {
        errorHandler(res,error)        
    }
}

const getDeskQa = async (req,res) => {
    try {
        const id = req.params.id
        const idData = await deskQa.findById(id)
        if(!idData) return res.status(400).send("Id xato kiritilgan")
        res.status(200).send(idData)
    } catch (error) {
        errorHandler(res,error)
    }
}

const updateDeskQa = async (req,res) =>{
    try {
        const id = req.params.id
        const idData = await deskQa.findById(id)
        const {qa_id,desc_id} = req.body
        let check = await QuestionA.findById(qa_id)
        let check2 = await Description.findById(desc_id)
        if(check == null || check2 == null) return res.status(400).send("desc_id yoki qa_id noto'g'ri kiritilgan")
        if(!idData) return res.status(400).send("Id xato kiritilgan")
        await deskQa.findByIdAndUpdate({_id:id},{qa_id,desc_id})
        res.status(200).send({message:"Everything is Ok. deskQainfo has been updated"})
    } catch (error) {
        errorHandler(res,error)
    }
}

const deleteDeskQa = async (req,res) => {
    try {
        const id = req.params.id
        const idData = await deskQa.findById(id)
        if(idData.length < 1) return res.status(400).send({message:"Information not found which is Id bodied"})
        await deskQa.findByIdAndDelete(id)
        res.status(200).send({message:"Everything is OK. deskQaInfo has been deleted"})
    } catch (error) {
        errorHandler(res,error)
    }
}

module.exports = {
    getDeskQa,
    getDeskQas,
    deleteDeskQa,
    updateDeskQa,
    addDeskQa
}