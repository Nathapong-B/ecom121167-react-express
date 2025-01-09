const { prisma } = require("../config/config");

exports.orderCheckUpdate = async (order) => {
    try {
        return await prisma.$transaction(
            order.map(
                (e) => prisma.product.update({
                    where: {
                        id: e.id,
                        stock: {
                            gte: e.quantity,
                        },
                    },
                    data: {
                        stock: {
                            decrement: e.quantity,
                        },
                        sold: {
                            increment: e.quantity,
                        },
                    },
                })
            )
        );
    } catch (err) {
        console.log(err)
        return { error: 'Some product was out of stock' }
    };
};

exports.createOrder = async ({ userId, customerDetail, sumOrder, paymentIntent, sumProduct }) => {
    try {
        return await prisma.order.create({
            data: {
                user_id: userId,
                total_order: sumOrder,
                customer_name: customerDetail.customer_name,
                customer_address: customerDetail.customer_address,
                customer_phone: customerDetail.customer_phone,

                StripePayment: {
                    create: {
                        id: paymentIntent.id,
                        amount: paymentIntent.amount,
                        currency: paymentIntent.currency,
                        status: paymentIntent.status,
                        client_secret: paymentIntent.client_secret,
                    }
                },

                OrderDetail: {
                    create: sumProduct.map(item => ({
                        price: item.price,
                        cost: item.cost,
                        quantity: item.quantity,
                        total_orderDetail: item.total_orderDetail,
                        product_id: item.id,
                    }))
                },
            },
        });
    } catch (err) {
        console.log(err)
        return { error: err.message }
    }
};

exports.updateStatus = async ({ id, status }) => {
    try {
        return await prisma.order.update({
            where: { id },
            data: {
                status,
            },
            include: {
                OrderDetail: true,
            },
        });
    } catch (err) {
        console.log(err)
        return { error: 'Something wrong in update' }
    };
};