const express = require('express');
const router = express.Router();
const { validData } = require('../middlewares/validTypeData');
const { testController } = require('../controllers/testController');

router.post('/testapi',validData,testController);

module.exports = router;