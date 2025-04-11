const { prisma } = require("../config/config");

exports.reportPerDay = async (req, res) => {
    try {
        const { dayStart, dayEnd } = req.body;

        let start = dayStart + "T00:00:00";
        let end = dayEnd + "T23:59:59.9"

        const result = await prisma.order.findMany({
            where: {
                create_date: {
                    gte: new Date(start),
                    lte: new Date(end),
                },
                NOT: {
                    status: "canceled"
                }
            }
        });

        res.send({ message: 'ok', result });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

exports.getCount = async (req, res) => {
    try {
        const { table } = req.params;
        const models = ['user', 'product', 'category'];

        console.log(models.includes(table.toLowerCase()))

        if(!models.includes(table.toLowerCase())) return res.status(400).send({message:'Model not found'});

        const tableCount = await prisma?.[table].count();

        res.send({ message: 'ok', tableCount });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};