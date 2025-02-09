const { prisma } = require("../config/config");
const cloudinary = require("../config/cloudinaryConfig");

exports.searchName = async (data) => {
    try {
        const result = prisma.product.findMany({
            where: {
                product_name: {
                    contains: data,
                },
                status: 'active',
            },
            include: {
                Image: true,
            },
        });

        return result;
    } catch (err) {
        return err;
    };
};

exports.searchPrice = async (data) => {
    try {
        const result = await prisma.product.findMany({
            where: {
                price: {
                    gte: parseInt(data[0]),
                    lte: parseInt(data[1])
                },
                status: 'active',
            },
            include: { Image: true, },
        });

        return result;
    } catch (err) {
        // console.log(err)
        return err;
    }
};

exports.searchCategory = async (data) => {
    try {
        const result = await prisma.product.findMany({
            where: {
                category_id: {
                    in: data.map(e => e),
                },
                status: 'active',
            },
            include: { Image: true, },
        });

        return result;
    } catch (err) {
        // console.log(err)
        return err;
    };
};

exports.uploadImagesToCloud = async (files, fileName, folderName) => {
    try {
        // multiple upload
        let result = [];

        const settingOpt = (opt) => {
            if (opt === 'random') {
                return {
                    public_id: `${Date.now()}`,
                    resource_type: 'auto',
                    folder: `${folderName}`,
                }
            } else {
                return {
                    public_id: `${fileName}`,
                    resource_type: 'auto',
                    folder: `${folderName}`,
                }
            };
        }

        for (let el of files) {
            // แปลงข้อมูลใน buffer ที่ส่งมาจาก multer เป็น base64
            const b64 = Buffer.from(el.buffer).toString("base64");
            // จากนั้นเปลี่ยนเป็นข้อมูล URI
            const dataURI = "data:" + el.mimetype + ";base64," + b64;

            const eachResult = await cloudinary.uploader.upload(dataURI, settingOpt(fileName));

            eachResult.originalname = el.originalname; // เพิ่มชื่อเดิมเข้าไปใน obj เพื่อใช้ในการตรวจสอบภายหลัง
            result.push(eachResult);
        };

        return result;
    } catch (err) {
        return err;
    };
};

// ลบจาก cloudinary
exports.removeImageInCloud = async (files) => {
    try {
        return await cloudinary.api.delete_resources(files.map(el => el.public_id));
    } catch (err) {
        return err;
    };
};

// ลบข้อมูลจาก db
exports.removeImageInDatabase = async (data) => {
    try {
        // code
        return await prisma.image.deleteMany({
            where: {
                id: {
                    in: data.map(e => e.id),
                },
            },
        });
    } catch (err) {
        return err;
    };
};