const jwtConstant = {
    secret: process.env.ACC_SECRET_KEY,
};

const jwtRefreshConstant = {
    secret: process.env.REF_SECRET_KEY,
};

module.exports = { jwtConstant, jwtRefreshConstant };