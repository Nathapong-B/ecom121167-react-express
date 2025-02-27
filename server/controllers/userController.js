const { prisma, bcrypt } = require('../config/config');
const { jwtGenerate, jwtRefreshGenerate } = require('../middlewares/authService');
const { uploadImagesToCloud } = require('../util/utilProduct')

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const emailAlready = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (emailAlready) return res.status(400).send({ message: 'Email already exists' });

        const hashPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email: email,
                password: hashPassword,
            },
        });

        res.send({ message: 'Register Success' });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                status: true,
                first_name: true,
                last_name: true,
                address: true,
                phone: true,
                ProfileImage: true,
                last_update: true,
                create_date: true,
            },
        });

        if (!user || user.status === 'inactive') return res.status(401).send({ message: 'User not found or status not active' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).send({ message: 'E-mail or password is incorrect' });

        const token = jwtGenerate(user);
        const refToken = jwtRefreshGenerate(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refresh_token: refToken },
        });

        delete user.password;

        res.send({ message: 'Signin Success', token, refToken, profile: user });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, address, phone } = req.body.data ? JSON.parse(req.body.data) : req.body;
        const fileImage = req.files[0] ? [req.files[0]] : [];
        const id = req.decoded.sub;

        // ตรวจสอบว่ามีรูปโปรไฟล์อยู่แล้วหรือไม่ หากมีให้นำ image_name ไปกำหนดให้ parameter fileName เพื่อให้ cloundinary นำไปแทนที่รูปเดิม
        // no data return null
        const img_public_id = await prisma.profileImage.findFirst({
            where: {
                User: {
                    every: { id: id }
                }
            },
            select: { image_name: true }
            // select: { public_id: true }
        });

        // หากยังไม่มีรูปภาพ ให้ใช้ timestamp เป็นชื่อรูปภาพ
        const imgName = img_public_id?.image_name ?? Date.now();
        // const imgName = img_public_id?.public_id ?? Date.now();

        // upload images (files, fileName, folderName)
        const resImages = await uploadImagesToCloud(fileImage, imgName, 'ProfileImage');

        const img = resImages.length > 0 ? resImages[0] : null;

        const result = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                first_name,
                last_name,
                address,
                phone,
                ProfileImage: img
                    ? {
                        upsert: {
                            create: {
                                image_name: img.display_name,
                                url: img.url,
                                asset_id: img.asset_id,
                                public_id: img.public_id,
                                secure_url: img.secure_url,
                            },
                            update: {
                                image_name: img.display_name,
                                url: img.url,
                                asset_id: img.asset_id,
                                public_id: img.public_id,
                                secure_url: img.secure_url,
                            }
                        }
                    }
                    : {}
            },
            include: {
                ProfileImage: true,
            },
        });

        delete result.id;
        delete result.password;
        delete result.role;
        delete result.status;
        delete result.refresh_token;
        delete result.create_date;

        res.send({ message: 'Update profile success', result });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.changeStatusUser = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const result = await prisma.user.update({
            where: { id },
            data: { status },
        });

        res.send({ message: "Update status user success", result });
    } catch (err) {
        // console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.changeRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;

        const result = await prisma.user.update({
            where: { id },
            data: { role },
        });

        res.send({ message: 'Update role success', result });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.listUsers = async (req, res) => {
    try {
        const { statusby, limit } = req.params;

        const result = await prisma.user.findMany({
            where: {
                status: statusby,
            },
            take: parseInt(limit),
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                first_name: true,
                last_name: true,
                address: true,
                phone: true,
                ProfileImage: true,
                last_update: true,
                create_date: true,
            },
        });

        res.send({ message: 'List users done', result });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};


// exports.callProfile = async (req, res) => {
//     try {
//         const { sub } = req.decoded;

//         const result = await prisma.user.findUnique({
//             where: { id: sub },
//             select: {
//                 id: true,
//                 email: true,
//                 role: true,
//                 status: true,
//                 first_name: true,
//                 last_name: true,
//                 address: true,
//                 phone: true,
//                 last_update: true,
//                 create_date: true,
//                 ProfileImage: true,
//             }
//         });

//         res.send({ message: 'Call profile done', result });
//     } catch (err) {
//         console.log(err)
//         res.status(500).send({ message: 'Internal Server Error' });
//     };
// };




// test
exports.testApi = async (req, res) => {
    // const file = req.files[0] ? [req.files[0]] : [];

    const { first_name, last_name, address, phone } = req.body.data ? JSON.parse(req.body.data) : req.body;



    // const data={ first_name, last_name, address, phone }
    const data = first_name
    // console.log('firstName : ', data)


    const id = "73ec5bbf-2b27-413e-ba91-68222e9ffdff"; // admin
    // const id = "09cc75cd-89fe-4d25-b872-17e497ed940b"; // user
    const detail = "test img"
    const detail2 = "test img 2"

    // no data return null
    const img_public_id = await prisma.profileImage.findFirst({
        where: {
            User: {
                every: { id: id }
            }
        },
        select: { public_id: true }
    });

    console.log(findImgUser)

    res.send({ message: 'test api ok', })
};
