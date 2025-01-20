const { prisma } = require("../config/config");

exports.addCategory = async (req, res) => {
    try {
        const { category_name } = req.body;

        const resultFindCategoryName = await prisma.category.findFirst({
            where: {
                category_name,
                NOT: {
                    status: {
                        contains: "deleted",
                    },
                },
            },
        });

        if (resultFindCategoryName) {
            return res.status(400).send({ message: 'Category name has already exists' });
        };

        await prisma.category.create({
            data: {
                category_name: category_name,
            },
        });

        res.send({ message: 'Add category success' });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name } = req.body;

        if (!category_name) return res.status(400).send({ message: 'Incomplete data' });

        const result = await prisma.category.update({
            where: {
                id: id,
            },
            data: {
                category_name: category_name,
            },
        });

        res.send({ message: 'Update success', result: result });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.changeStatusCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // if (status !== 'active' && status !== 'inactive') return res.status(400).send({ message: 'Inaccurate data, status field accept active or inactive only' });


        const result = await prisma.category.update({
            where: { id: id },
            data: { status: status },
        });

        res.send({ message: 'Update status success', result });
    } catch (err) {
        // console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.listCategory = async (req, res) => {
    try {
        const { statusby } = req.params;

        const result = await prisma.category.findMany({
            where: {
                status: statusby ?? "active",
            },
            orderBy: {
                last_update: 'desc'
            },
            include: {
                Product: true,
            },
        });

        res.send({ message: 'Call list category success', result });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.removeCategory = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.category.update({
            where: { id },
            data: { status: "deleted" },
        });

        res.send({ message: 'Remove category done' });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};