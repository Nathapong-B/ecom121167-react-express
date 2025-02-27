const { prisma } = require("../config/config");
const { jwtRefreshGenerate, jwtGenerate } = require("../middlewares/authService");

exports.refreshToken = async (req, res) => {
    try {
        // const id = '73ec5bbf-2b27-413e-ba91-68222e9ffdff';
        // const refToken = '123456789';
        const id = req.decoded.sub;
        const ref_Token = req.token;

        const userFound = await prisma.user.findUnique({
            where: {
                id,
                refresh_token: ref_Token,
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });

        if (!userFound) return res.status(401).send({ message: 'Refresh token unauthorization' });

        const token = jwtGenerate(userFound);
        const refToken = jwtRefreshGenerate(userFound);

        await prisma.user.update({
            where: { id },
            data: { refresh_token: refToken }
        });

        res.send({ message: 'Refresh token done', token, refToken });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    };
};