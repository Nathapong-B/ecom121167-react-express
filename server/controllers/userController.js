const { prisma, bcrypt } = require('../config/config');
const { jwtGenerate } = require('../middlewares/authService');

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
        });

        if (!user || user.status === 'inactive') return res.status(401).send({ message: 'User not found or status not active' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).send({ message: 'The password is incorrect' });

        const token = jwtGenerate(user);

        res.send({ message: 'Signin Success', token: token });
    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
    };
};

exports.updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, address, phone } = req.body;
        const id = req.decoded.sub;

        const result = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                first_name,
                last_name,
                address,
                phone,
            }
        });

        delete result.id;
        delete result.password;
        delete result.role;
        delete result.status;
        delete result.refresh_token;
        delete result.profile_image;
        delete result.create_date;

        res.send({ message: 'Update profile success', result });
    } catch (err) {
        // console.log(err)
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