exports.testController=(req,res)=>{
    console.log(req.body)
    res.send({message:'succecc'})
}