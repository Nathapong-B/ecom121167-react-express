const { registerSchema, profileSchema, signinSchema, datetimeSchema } = require("../util/zodSchema");

exports.validate_Email_Pwd = (req, res, next) => {
    // const { email, password } = req.body;

    // if (!email || !password) return res.status(400).send({ message: "Email or Password is missing" });

    const { error } = registerSchema.safeParse(req.body);

    let err = {};
    if (error) {
        error.issues.map((e) => err[e.path[0]] = e.message);

        return res.status(400).send({ message: "Email or Password is invalid", error: err });
    };

    next();
};

exports.validate_Signin = (req, res, next) => {
    const { error } = signinSchema.safeParse(req.body);

    let err = {};
    if (error) {
        error.issues.map((e) => err[e.path[0]] = e.message);

        return res.status(400).send({ message: "Email or Password is invalid", error: err });
    };

    next();
};

exports.validate_Profile = (req, res, next) => {
    // const { first_name, last_name, address, phone } = req.body.data ? JSON.parse(req.body.data) : req.body;

    // if (!first_name || !last_name || !address || !phone) return res.status(400).send({ message: "Incomplete data" });

    // next();

    const data = req.body.data ? JSON.parse(req.body.data) : req.body;

    const { error } = profileSchema.safeParse(data);

    let err = {};
    if (error) {
        error.issues.map((e) => err[e.path[0]] = e.message);

        return res.status(400).send({ message: "Invalid input", error: err });
    };

    next();
};

exports.validate_Status = (req, res, next) => {
    const { status } = req.body;

    if (!status) return res.status(400).send({ message: 'Incomplete data' });

    if (status !== 'active' && status !== 'inactive') return res.status(400).send({ message: 'Inaccurate data, status field accept active or inactive only' });

    next();
};

exports.validate_Role = (req, res, next) => {
    const { role } = req.body;

    if (!role) return res.status(400).send({ message: 'Incomplete data' });

    if (role !== 'admin' && role !== 'user') return res.status(400).send({ message: 'Inaccurate data, status field accept admin or user only' });

    next();
};

exports.validate_Product_data = (req, res, next) => {
    // console.log(JSON.parse(req.body.data))
    const { product_name, price, cost, description, stock, category_id, image } = JSON.parse(req.body.data);

    if (!product_name || !price || !cost || !description || !stock || !category_id || !image?.length > 0) return res.status(400).send({ message: 'Incomplete data' });

    next();
};

// เข็ค ขนาด ชนิด ของไฟล์รูปภาพ
exports.validate_Images = (req, res, next) => {
    const type = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (req.files?.length === 0 || !req.files) return res.status(400).send({ message: 'Missing file images' });

    for (let el of req.files) {
        if (!type.includes(el.mimetype)) return res.status(400).send({ message: 'ประเภทไฟล์ถูกปฏิเสธ' });
        if (el.size > 2000000) return res.status(400).send({ message: 'ไฟล์มีขนาดใหญ่เกินไป, อนุญาตไม่เกิน 2MB' });
    };

    next();
};

// เข็ค ขนาด ชนิด ของไฟล์รูปภาพ
exports.validate_Images_size = (req, res, next) => {
    const type = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (req.files?.length === 0 || !req.files) return next();

    for (let el of req.files) {
        if (!type.includes(el.mimetype)) return res.status(400).send({ message: 'ประเภทไฟล์ถูกปฏิเสธ' });
        if (el.size > 2000000) return res.status(400).send({ message: 'ไฟล์มีขนาดใหญ่เกินไป, อนุญาตไม่เกิน 2MB' });
    };

    next();
};

// ตรวจสอบรูปแบบวันที่ ("YYYY-MM-DD")
exports.validate_datetime_format = (req, res, next) => {
    // ตรวจสอบว่ามี dayStart , dayEnd มาไหม
    const { dayStart, dayEnd } = req.body;

    if(!dayStart || !dayEnd) return res.status(400).send({message:'Input data invalid, dayStart or dayEnd has missing'});

    const arrDate = [{ date: dayStart }, { date: dayEnd }];

    for (e of arrDate) {
        const { error } = datetimeSchema.safeParse(e);

        let err = {};
        if (error) {
            error.issues.map((e) => err[e.path[0]] = e.message);

            return res.status(400).send({ message: `Formats is invalid, Accepted formats ("YYYY-MM-DD")`, error: err });
        };
    };

    next();
};

// ตรวจสอบวันที่
exports.validate_date_duration = (req, res, next) => {
    const { dayStart, dayEnd } = req.body;

    // วันที่ไม่ถูกต้อง
    if (isNaN(new Date(dayStart)) || isNaN(new Date(dayEnd))) return res.status(400).send({ message: 'Invalid data input' });

    // วันสิ้นสุดต้องไม่ใช่วันหลังจากวันปัจจุบัน
    if (new Date(dayEnd).getTime() > Date.now()) return res.status(400).send({ message: 'Invalid date input' });

    // วันเริ่มต้องเป็นวันก่อนหน้า และไม่ใช่วันเดียวกัน หรือวันหลังจากวันสิ้นสุด
    if (new Date(dayStart) > new Date(dayEnd)) return res.status(400).send({ message: 'Invalid duration' });


    // ตรวจสอบวันที่ ต้องมีค่าอยู่ในช่วงจำนวนวันของเดือนนั้นๆ
    const validateDayRanges = (dt) => {
        const arrDs = dt.split("-");
        const year = arrDs[0];
        const month = arrDs[1];
        const day = parseInt(arrDs[2]);
        const amountDay = new Date(year, month, 0).getDate();

        if (day < 1 || day > amountDay) return false;

        return true;
    };

    if (!validateDayRanges(dayStart)) return res.status(400).send({ message: 'Day start invalid' });
    if (!validateDayRanges(dayEnd)) return res.status(400).send({ message: 'Day end invalid' });

    next();
};