const { jwt } = require("../config/config");
const { jwtConstant, jwtRefreshConstant } = require("../config/constant");

exports.jwtGenerate = (data) => {
    const secret = jwtConstant.secret;
    const { id, email, role } = data;

    const accToken = jwt.sign(
        { sub: id, user: email, role: role },
        secret,
        // { expiresIn: '3m' },
        { expiresIn: '1D' },
    );

    return accToken;
};

exports.jwtRefreshGenerate = (data) => {
    const secret = jwtRefreshConstant.secret;
    const { id, email, role } = data;

    const refToken = jwt.sign(
        { sub: id, user: email, role: role },
        secret,
        // { expiresIn: '1m' },
        { expiresIn: '2D' },
    );

    return refToken;
};

exports.jwtValidate = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const secret = jwtConstant.secret;

        if (!authorization) return res.status(401).send({ message: 'Unauthorization' });

        const token = authorization.replace('Bearer ', '');

        jwt.verify(token, secret, (err, decoded) => {
            if (err) throw new Error(`Unauthorization, ${err.message}`); // ถ้าโทเคนหมดอายุหรือไม่ถูกต้อง จะรีเทิร์น error ออกไป

            req.decoded = decoded;
        });

        next();

    } catch (err) {
        res.status(401).send({ message: err.message });
    };
};

exports.jwtRefreshValidate = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const secret = jwtRefreshConstant.secret;
        // console.log(authorization)
        // console.log(req.body)

        if (!authorization) return res.status(401).send({ message: 'Unauthorization' });

        const token = authorization.replace('Bearer ', '');

        jwt.verify(token, secret, (err, decoded) => {
            if (err) throw new Error(`Unauthorization, ${err.message}`); // ถ้าโทเคนหมดอายุหรือไม่ถูกต้อง จะรีเทิร์น error ออกไป

            req.decoded = decoded;
            req.token = token;
        });

        next();

    } catch (err) {
        res.status(401).send({ message: err.message });
    };
};

exports.adminValidate = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const secret = jwtConstant.secret;

        if (!authorization) return res.status(401).send({ message: 'Unauthorization' });

        const token = authorization.replace('Bearer ', '');

        const role = jwt.verify(token, secret, (err, decoded) => {
            if (err) throw new Error(`Unauthorization, ${err.message}`);

            req.decoded = decoded;

            return decoded.role;
        });

        if (role === 'user') throw new Error('This account can not access');

        next();

    } catch (err) {
        res.status(401).send({ message: err.message });
    };
};