const Topic = require("../models/Topic");
const Author = require("../models/Author");

const {topicValidation} = require("../validations/topic")

const errorHandler = (res, error) => {
  res.status(500).send({ message: `Xatolik ${error}` });
};

const addTopic = async (req, res) => {
  try {
    const {error,value} = topicValidation(req.body)
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }
    const {
      author_id,
      topic_title,
      topic_text,
      is_checked,
      id_approved,
      expert_id,
    } = value;
    let check1 = await Author.findOne({_id:author_id})
    let check2 = await Author.findOne({_id:expert_id})
    if(check1 == null) return res.status(400).send("author_id bo'yicha ma'lumot yo'q")
    if(check2 == null) return res.status(400).send("expert_id xato kiritilgan")
    const data = await Topic({author_id,topic_title,topic_text,is_checked,id_approved,expert_id})
    await data.save() 
    res.status(200).send("Topic is added ! Succesfully")
} catch (error) {
    errorHandler(res,error)
  }
};

const getTopic = async (req,res) =>{
    try {
        const id = req.params.id
        const idData = await Topic.findById(id)
        if(!idData) return res.status(400).send({message:"Id xato berilgan ma'lumot yoq ekan"})
        res.status(200).send(idData)
    } catch (error) {
       errorHandler(res,error) 
    }
}
const getTopics = async (req,res) =>{
    try {
        const data = await Topic.find({})
        if(!data) return res.status(500).send("ma'lumot topilmadi")
        res.status(200).send(data)
    } catch (error) {
        errorHandler(res,error)
    }
}
const updateTopic = async (req,res) =>{
    try {
        const id = req.params.id
        const {error,value} = topicValidation(req.body)
        if(error){
        return res.status(400).send({message:error.details[0].message})
        }
        const {
            author_id,
            topic_title,
            topic_text,
            is_checked,
            id_approved,
            expert_id,
          } = value;
        const idData = await Topic.findById(id)
        if(!idData) return res.status(400).send("Berilgan id bo'yicha ma'lumot topilmadi.")
        await Topic.findByIdAndUpdate({_id:id},{author_id,topic_title,topic_text,is_checked,id_approved,expert_id})
        res.status(200).send("Topic is updated")
    } catch (error) {
        errorHandler(res,error)
    }
}
const deleteTopic = async (req,res) =>{
    try {
        const id = req.params.id
        const data = await Topic.findById(id)
        if(!data) return res.status(500).send("Id xato kiritilgan!")
        await Topic.findByIdAndDelete(id)
        res.status(200).send("OK. TopicInfo is deleted")
    } catch (error) {
        errorHandler(res,error)
    }
}
module.exports = {
    addTopic,
    getTopic,
    getTopics,
    deleteTopic,
    updateTopic
}