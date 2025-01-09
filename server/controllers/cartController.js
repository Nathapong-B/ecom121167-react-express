const { prisma } = require("../config/config");

exports.addToCart = async (req, res) => {
    try {
        const { sub } = req.decoded;
        const product_id = req.body.id;
        const quantity = parseInt(req.body.quantity);

        const result = await prisma.cart.upsert({
            where: {
                id: sub,
            },
            update: {
                CartDetail: {
                    upsert: {
                        where: {
                            id: product_id,
                        },
                        update: {
                            quantity,
                        },
                        create: {
                            id: product_id,
                            product_id,
                            quantity,
                        },
                    },
                },
            },
            create: {
                id: sub,
                user_id: sub,
                CartDetail: {
                    create: {
                        id: product_id,
                        product_id,
                        quantity,
                    },
                },
            }
        });

        res.send({ message: 'Add to cart success', result });
    } catch (err) {
        // console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { sub } = req.decoded;
        // const arr = ['cf45655f-7b94-4e02-9280-c06fc722b112', 'd1441e45-9f45-4a9a-82bb-36d4206b3fac'];
        // const id2 = "cf45655f-7b94-4e02-9280-c06fc722b112";

        const result = await prisma.cart.update({
            where: { id: sub },
            data: {
                CartDetail: {
                    // deleteMany: arr.map(e => ({ product_id: e })),
                    deleteMany: [{ product_id: id }],
                },
            },
            include: {
                CartDetail: true,
            },
        });

        res.send({ message: 'Remove product from cart success', result });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.listCart = async (req, res) => {
    try {
        const { sub } = req.decoded;

        const result = await prisma.cart.findFirst({
            where: {
                user_id: sub,
            },
            include: {
                CartDetail: true,
            },
        });

        res.send({ message: 'Read cart success', result });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};