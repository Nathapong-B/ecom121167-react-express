const { prisma } = require("../config/config");
const { stripePayment, stripeRetrieve } = require("../util/stripePayment");
const { orderCheckUpdate, createOrder, updateStatus } = require("../util/utilOrder");


exports.createOrder = async (req, res) => {
    try {
        const userId = req.decoded.sub;
        // #1 - รับออร์เดอร์จาก client
        // { order :[ {product1}, {product2},...{n} ],
        //  customerDetail :{customer_name, customer_address, customer_phone}}
        const { order, customerDetail } = req.body;
        if (!order) return res.status(400).send({ message: 'The cart key was not found in request' });
        if (!customerDetail || !customerDetail.customer_name || !customerDetail.customer_address || !customerDetail.customer_phone) return res.status(400).send({ message: 'Customer detail not found or Incomplete data' });

        // #2 - ตรวจสอบสต๊อก และอัพเดทฟิวด์ stock, sold ของตาราง product
        const orderStockUpdate = await orderCheckUpdate(order);
        if (orderStockUpdate?.error) return res.status(400).send({ message: orderStockUpdate.error });

        // #3 - คำนวณราคารวมทั้งหมด
        // ราคารวมต่อสินค้า
        const sumProduct = orderStockUpdate.reduce((sumArr, el) => {
            const index = order.findIndex(e => e.id === el.id);

            order[index].total_orderDetail = order[index].quantity * el.price;
            order[index].price = el.price;
            order[index].cost = el.cost;

            sumArr.push({ ...order[index] });
            return sumArr
        }, []);

        // บิลรวม
        const sumOrder = orderStockUpdate.reduce((sum, el) => {
            const index = order.findIndex(e => e.id === el.id);
            return (order[index].quantity * el.price) + sum;
        }, 0);

        // #4 - ส่งคำขอชำระเงินไปที่ยัง stripe
        const paymentIntent = await stripePayment(sumOrder);

        // #5 - บันทึกลง order และ stripepayment , ส่ง client_secret กลับไปยัง client
        // {userId , sumOrder , paymentIntent , sumProduct}
        const createorder = await createOrder({ userId, customerDetail, sumOrder, paymentIntent, sumProduct });
        if (createorder?.error) throw new Error(createorder.error);

        res.send({ message: 'Create order success', clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.removeOrder = async (req, res) => {
    try {
        // product's id
        const { id } = req.params;

        // #1 - เปลี่ยน status tb order เป็น canceled
        const status = 'canceled';
        const cancelOrder = await updateStatus({ id, status });
        if (cancelOrder?.error) return res.status(500).send({ message: cancelOrder.error });

        const { OrderDetail } = cancelOrder;

        // #2 - ปรับค่า sold และ stock ที่ tb product
        const returnStock = await prisma.$transaction(
            OrderDetail.map(
                (e) => prisma.product.update({
                    where: { id: e.product_id },
                    data: {
                        sold: {
                            decrement: e.quantity
                        },
                        stock: {
                            increment: e.quantity
                        },
                    },
                })
            )
        );

        res.send({ message: 'Remove order success' });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

// อัพเดทสถานะการจ่ายเงิน
exports.confirmPayment = async (req, res) => {
    try {
        // ชำระเงินเสร็จสิ้น อัพเดท tb stripepayment บันทึก pay_date, status เปลี่ยน status เป็น confirmed ที่ tb order 

        const status = 'confirmed';
        const { paymentIntent } = req.body;

        const payInt = parseInt(paymentIntent.created);
        const paydate = new Date(payInt * 1000); // milliseconds

        // ตัวอย่างการแปลง timestamp เป็นวันที่
        // const time = paymentIntent.created;
        // const all = new Date(parseInt(time) * 1000)
        // const date = new Date(parseInt(time) * 1000).getDate()
        // const month = (new Date(parseInt(time) * 1000).getMonth()) + 1
        // const year = new Date(parseInt(time) * 1000).getFullYear()
        // console.log(date, '/', month, '/', year)
        // console.log(all.toLocaleString('th-TH'))
        // return res.send()

        const result = await prisma.stripePayment.update({
            where: { id: paymentIntent.id },
            data: {
                pay_date: paydate,
                status: paymentIntent.status,

                Order: {
                    update: {
                        status,
                    }
                }
            }
        });

        // console.log(stripe)

        res.send({ message: 'Update status payment success', result });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

// สำหรับแอดมินใช้อัพเดทสถานะออร์เดอร์ในการจัดส่ง หรือเสร็จสิ้นแล้ว
exports.updateStatusOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // wait confirm shipping completed canceled
        const msgStatus = ['pending', 'confirmed', 'shipping', 'completed', 'canceled'];
        // ตรวจสอบคำที่ส่งเข้ามา return boolean (true,false)
        if (!msgStatus.includes(status)) return res.status(400).send({ message: 'Accept only : pending, confirmed, shipping, completed, canceled' });

        // console.log('go to next process')
        const result = await updateStatus({ id, status });

        res.send({ message: 'Update status success', result });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.listOrders = async (req, res) => {
    try {
        const { limit } = req.params;
        const { sub } = req.decoded;

        const result = await prisma.order.findMany({
            where: { user_id: sub },
            take: parseInt(limit),
            orderBy: { create_date: 'desc' },
            include: {
                StripePayment: true,
                OrderDetail: {
                    include: {
                        // Product:true,
                        Product: {
                            include: {
                                Image: true,
                            },
                        },
                    },
                },
            },
        });

        res.send({ message: 'Call list order done', result });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.listOrdersAdmin = async (req, res) => {
    try {
        const { limit } = req.params;

        const result = await prisma.order.findMany({
            take: parseInt(limit),
            orderBy: { create_date: 'desc' },
            include: {
                StripePayment: true,
                User: true,
                OrderDetail: {
                    include: {
                        Product: true,
                    },
                },
            },
        });

        res.send({ message: 'Call list order done', result });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { tracking_no } = req.body;
        const status = 'shipping';

        const result = await prisma.order.update({
            where: { id },
            data: {
                tracking_no,
                status,
            },
        });

        res.send({ message: 'Update order done', result });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};



// test paydate
exports.testPaydate = async (req, res) => {
    try {
        const { paydate } = req.body;

        const date = new Date(parseInt(paydate) * 1000);
        // console.log(date)
        // console.log(date.toLocaleString('th-TH'))

        // const timedb = await prisma.stripePayment.findFirst({
        //     where: {
        //         create_date: {
        //             // not: {},
        //             gte: new Date("2025-01-05T04:22:12.892Z"),
        //             lte: new Date("2025-01-06T04:22:12.892Z")
        //         },
        //     },
        // })

        const timedb = await prisma.stripePayment.findFirst({ where: { id: "pi_3Qd8KVK9yWLzWzwq173igLg0" } })

        // console.log(new Date().toLocaleString())
        console.log(timedb.pay_date.toLocaleString())
        // console.log(new Date(timedb.create_date).getTime())
        // console.log((timedb.create_date).toLocaleString('th-TH'))

        res.send({ message: 'ok', })
    } catch (err) {
        console.log(err)
    }
}

exports.testStripeRetrieve = async (req, res) => {
    const pId = 'pi_3QSFD9K9yWLzWzwq0UquIioY';
    // const pId='pi_3QSFF0K9yWLzWzwq0kJmL4Ad';
    // const accId='acct_1QR8tzK9yWLzWzwq';
    const result = await stripeRetrieve(pId);
    console.log(result)
    // console.log('ok')
    res.send(result)
}