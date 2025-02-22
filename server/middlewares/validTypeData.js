const { testSchema } = require("../util/zod");

exports.validData = (req, res, next) => {
    console.log(req.body)
    const data = req.body;
    const { error } = testSchema.safeParse(data);

    console.log(testSchema.safeParse(data))

    if (error) {
        console.log(error)
        res.send({ message: 'error..!!', error: error.issues });
    } else {
        next();
    };
}