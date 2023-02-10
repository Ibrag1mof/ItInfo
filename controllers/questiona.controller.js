const QuestionA = require("../models/QuestionA")
const Author = require("../models/Author")

const {questionaValidation} = require("../validations/questiona")

const errorHandler = (res,error) => {
    res.status(500).send({message:`Xatolik : ${error}`})
}

const addQuestionAnswer = async (req,res) => {
    try {
        const {error,value} = questionaValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {question,answer,is_checked,expert_id} = value
        const idData = await Author.findById(expert_id)
        if(!idData) return res.status(400).send("Berilgan javob va id expertniki emas!")
        const data = await QuestionA({question,answer,is_checked,expert_id})
        await data.save()
        res.status(200).send("Evertything is OK. Question and Answer is added.")
    } catch (error) {
        errorHandler(res,error)
    }
}

const getQuestionAnswers = async (req,res) =>{
    try {
        const data = await QuestionA.find({})
        if(!data) return res.status(400).send("Ma'lumot yo'q")
        res.status(200).send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}

const getQuestionAnswer = async (req,res) => {
    try {
        const id = req.params.id
        const data = await QuestionA.findById(id)
        if(!data) return res.status(400).send("Id bo'yicha ma'lumot topilmadi")
        res.status(200).send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}

const updateQuestionAnswer = async (req,res) => {
    try {
        const id = req.params.id
        const {error,value} = questionaValidation(req.body)
        if(error){
            return res.status(400).send({message:error.details[0].message})
        }
        const {question,answer,is_checked,expert_id} = value
        let check = await Author.findById(expert_id)
        if(!check) return res.status(400).send("Berilgan id expertga tegishli emas!")
        await Author.findByIdAndUpdate({_id:id},{question,answer,is_checked,expert_id})
        res.status(200).send("OK. Question and Answer info is updated!")
    } catch (error) {
        errorHandler(res,error)
    }
}

const deleteQuestionAnswer = async (req,res) => {
    try {
        const {id} = req.params
        const idData = await QuestionA.findById({_id:id})
        if(!idData) return res.status(400).send({message:"Id bo'yicha ma'lumot yo'q"})
        await QuestionA.findByIdAndDelete({_id:id})
        res.status(200).send("Everything is Ok. QuestionanswerInfo is deleted")
    } catch (error) {
        errorHandler(res,error)
    }
}

module.exports = {
    addQuestionAnswer,
    getQuestionAnswer,
    getQuestionAnswers,
    updateQuestionAnswer,
    deleteQuestionAnswer
}