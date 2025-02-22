const z =require('zod');

exports.testSchema=z.object({
    name:z.string({message:'not string..!!'}),
    phone:z.string({message:'phone not string'})
})