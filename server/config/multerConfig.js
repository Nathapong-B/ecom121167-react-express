const { multer } = require("./config");

const storage = multer.memoryStorage();

exports.upload = multer({ storage });