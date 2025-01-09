// npm install express morgan cors nodemon dotenv
const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const { readdirSync } = require('fs');

app.use(cors());
app.use(morgan('dev')); // request logger แสดงสถานะการเชื่อมต่อ
app.use(express.json()); // ให้แอพอ่านค่าใน req body ที่ส่งมาแบบ json ได้
app.use(bodyParser.urlencoded({ extended: true })); // ให้แอพอ่านค่า req body ที่ส่งมาแบบ x-www-form-urlencoded ได้ 

readdirSync('./routes').map((route) => app.use('/api', require('./routes/' + route)));

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`server start on port ${port}`));