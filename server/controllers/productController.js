const { prisma } = require("../config/config");
const { searchName, searchPrice, searchCategory, uploadImagesToCloud, removeImageInCloud, removeImageInDatabase } = require("../util/utilProduct");

exports.addProduct = async (req, res) => {
    try {
        const { product_name, price, cost, description, stock, category_id, image } = JSON.parse(req.body.data);
        const { addImages } = image[0];

        // upload images (files, fileName, folderName)
        const resImages = await uploadImagesToCloud(req.files, Date.now(), 'TestUpload');

        // นำข้อมูลที่รีเทิร์นจาก cloud มาเพิ่มคีย์ position เพื่อเตรียมบันทึกลง db
        for (let i of resImages) {
            const indexName = addImages.findIndex(el => el.image_name === i.originalname);

            if (indexName === -1) return res.status(500).send({ message: 'เกิดข้อผิดพลากในระบบ, ข้อมูลรูปภาพไม่ตรงกัน' });
            i.position = addImages[indexName].position;
        };

        const result = await prisma.product.create({
            data: {
                product_name,
                price: parseInt(price),
                cost: parseInt(cost),
                description,
                stock: parseInt(stock),
                category_id,
                Image: {
                    create:
                        resImages.map(e => ({
                            image_name: e.display_name,
                            position: e.position,
                            url: e.url,
                            asset_id: e.asset_id,
                            public_id: e.public_id,
                            secure_url: e.secure_url,
                        })),
                },
            },
        });

        res.send({ message: 'Create product success', result });
    } catch (err) {
        // console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, price, cost, description, stock, category_id, image } = JSON.parse(req.body.data);
        const { removeImages, addImages, updateImages } = image[0];
        const fileImages = req.files;
        const arrImg = [...updateImages];

        // #1 - ลบรูปจาก cloud {removeImages}
        if (removeImages.length > 0) await removeImageInCloud(removeImages);

        // #2 - อัพโหลดรูปใหม่ไปที่ cloud (fileImages, filesName, folderName)
        if (fileImages || fileImages.length > 0) {
            const uploadToCloud = await uploadImagesToCloud(fileImages, 'random', 'TestUpload');
            // uploadToCloud ข้อมูลที่รีเทิร์นจาก fn จะมีข้อมูลจาก cloudinary และชื่อ originalname จากนั้นนำมาเปรียบเทียบเพิ่มคีย์ position เพื่อเตรียมบันทึกลง db
            for (let i of uploadToCloud) {
                const indexName = addImages.findIndex(el => el.image_name === i.originalname);

                if (indexName === -1) return res.status(500).send({ message: 'เกิดข้อผิดพลากในระบบ, ข้อมูลรูปภาพไม่ตรงกัน' });
                // เพิ่มคีย์ position ให้กับ uploadToCloud
                i.position = addImages[indexName].position;
            };

            // เพิ่มเข้าไปใน arrImg รวมกับ updateImages เพื่อเตรียมบันทึกลง db
            arrImg.push(...uploadToCloud);
        };

        // #3 - เพิ่มข้อมูลรูปภาพใหม่, แก้ไขข้อมูลรูปภาพเดิม { uploadToCloud, updateImages }
        const upsertImg = await prisma.$transaction(
            arrImg.map(
                (e) => prisma.image.upsert({
                    where: { id: e.id || 'null' },
                    update: {
                        position: parseInt(e.position),
                    },
                    create: {
                        image_name: e.display_name || "null",
                        position: parseInt(e.position) || 0,
                        url: e.url || "null",
                        asset_id: e.asset_id || "null",
                        public_id: e.public_id || "null",
                        secure_url: e.secure_url || "null",
                        product_id: id,
                    },
                })
            )
        );

        // #4 - แก้ไขข้อมูลสินค้า, ลบรูปภาพ,  {data, removeImages}
        const updelProImg = await prisma.product.update({
            where: { id },
            data: {
                product_name,
                price: parseInt(price),
                cost: parseInt(cost),
                description,
                stock: parseInt(stock),
                category_id,

                Image: {
                    deleteMany: removeImages.map(e => ({ id: e.id })),
                },
            },
        });

        res.send({ message: 'Update product success', upsertImg, updelProImg });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.changeStatusProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await prisma.product.update({
            where: { id },
            data: { status },
        });

        res.send({ message: 'Change status product success', result });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.removeProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // delete images in cloudinary
        const imgforRemove = await prisma.image.findMany({ where: { product_id: id } });
        const resultfromCloudinary = await removeImageInCloud(imgforRemove);

        const result = await prisma.product.update({
            where: {
                id,
            },
            data: {
                status: 'deleted',
                Image: {
                    deleteMany: {},
                },
            },
            include: {
                Image: true,
            },
        });

        res.send({ message: 'Remove product success', result, resultfromCloudinary });
    } catch (err) {
        console.log(err)
        res.status(500).send({ messages: 'Internal Server Error' });
    };
};

exports.listProducts = async (req, res) => {
    try {
        const { limit } = req.params;

        const result = await prisma.product.findMany({
            where: {
                status: 'active',
            },
            take: parseInt(limit),
            orderBy: { last_update: 'desc' },
            include: { Image: true, },
        });

        res.send({ message: 'Read products success', result });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.listInactiveProducts = async (req, res) => {
    try {
        const { limit } = req.params;

        const result = await prisma.product.findMany({
            where: {
                status: 'inactive',
            },
            take: parseInt(limit),
            orderBy: { last_update: 'desc' },
            include: { Image: true, },
        });

        res.send({ message: 'Read inactive products success', result });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.getEachProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await prisma.product.findFirst({
            where: {
                id,
                status: 'active',
            },
            include: { Image: true, },
        });

        res.send({ message: 'Get product success', result });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.searchProduct = async (req, res) => {
    try {
        const { product_name, price, category_id } = req.body;

        // let result = null;

        // if (product_name) {
        //     result = await searchName(product_name);
        // } else if (category_id) {
        //     result = await searchCategory(category_id);
        // } else if (price.length > 0) {
        //     result = await searchPrice(price);
        // };

        const result = await prisma.product.findMany({
            where: {
                product_name: {
                    contains: product_name ?? undefined,
                    mode: 'insensitive', // ไม่สนใจตัวพิมพ์เล็กหรือใหญ่
                },

                category_id: category_id.length > 0
                    ? { in: category_id.map(e => e) }
                    : undefined,

                price: price.length > 0
                    ? {
                        gte: parseInt(price[0]),
                        lte: parseInt(price[1])
                    }
                    : undefined,

                status: 'active',
            },
            include: {
                Image: true,
            },
        });

        res.send({ message: 'Search product success', result });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

exports.listProductBy = async (req, res) => {
    try {
        const { limit, sort } = req.params;

        const result = await prisma.product.findMany({
            where: {
                status: 'active',
            },
            orderBy: {
                [sort]: 'desc',
            },
            take: parseInt(limit),
            include: { Image: true, },
        });

        res.send({ message: 'success', result });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.callProductsByList = async (req, res) => {
    try {
        const { arrListId } = req.body;

        const result = await prisma.product.findMany({
            where: {
                id: { in: arrListId },
            }
        });

        res.send({ message: 'Call Products by list done', result })
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    };
};



// test api
// // null, undefine, 0 จะรีเทิร์นค่าเป็น เท็จ ทำให้คีย์ name จะถูกกำหนดค่าด้วยข้อความด้านหลัง
// const arr2 = [
//     { name: '' ?? 'kim' }, // รีเทิร์นค่าแรก
//     { name: '' || 'kim2' }, // รีเทิร์นค่าที่สอง
//     { name: null ?? 'kim' },
//     { name: null || 'ball' },
//     { name: undefined ?? 'jordan' },
//     { name: undefined || 'jame' },
//     { name: 0 ?? 'kahn' }, // รีเทิร์นค่าแรก
//     { name: 0 || 'kahn2' }, // รีเทิร์นค่าที่สอง
// ];


// เช็คสต๊อก และ อัพเดท หากสต๊อกน้อยกว่า quantity จะ throw error ออกมา
// await prisma.$transaction(
//     dataArr.map(
//         (e) => prisma.product.update({
//             where: {
//                 id: e.id,
//                 stock: {
//                     gte: e.quantity,
//                 },
//             },
//             data: {
//                 stock: {
//                     decrement: e.quantity,
//                 },
//             },
//         })
//     )
// );

const testfn = ({ a, b, c }) => {
    try {
        console.log('a : ', a)
        console.log('b : ', b)
        console.log('c : ', c)
        throw new Error('testfn error')
    } catch (err) {
        console.log('in testfn : ', err)
        return { error: err.message }
        // throw new Error('error in catch')
    }
}

exports.testApi = async (req, res) => {
    try {
        const order = [
            { id: '38667064-da97-4a84-81fe-d1da01b92e87', name: 'seagate 500g', quantity: 4 },
            { id: 'b5970498-f588-4022-ad5c-35093fbb058c', name: 'samsung 24', quantity: 5 },
            { id: 'cf45655f-7b94-4e02-9280-c06fc722b112', name: 'i7 7650', quantity: 1 },
        ]

        // console.log(req.body)
        const a = 1;
        const b = 5;
        const c = 2;

        const x = testfn({ b, c, a })

        if (x?.error) {
            console.log('x.error : ', x.error)
            // console.log('x message : ', message)
        }


        res.send({ message: 'test api ok', })
    } catch (err) {
        console.log(err)
        res.send({ message: 'some product out of stock' })
    }
}