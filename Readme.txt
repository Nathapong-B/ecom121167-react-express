---//--- SERVER ---//---
npm init -y
npm install express morgan cors nodemon dotenv
bcryptjs jsonwebtoken cloudinary multer

npm i body-parser
// bodyParser.urlencoded({ extended: true }); // ให้แอพอ่านค่า req body ที่ส่งมาแบบ x-www-form-urlencoded ได้ 

// nodemon in package.json -> scripts
"start": "nodemon server.js"

npm install prisma
npx prisma init
npm install @prisma/client
npm install --save stripe

npx prisma migrate dev --name ""

//----------------------
router.post('/product/add')
authorization = admin token
req.body{
    data:{
        product_name, price, cost, description, stock, category_id,
        image[{
            addImages:[{image_name, position}]
            }]
    }
}
req.files: 'images' เฉพาะไฟล์รูปภาพ ขนาดไม่เกิน 2MB
//--------------------
router.put('/product/update/:id')
authorization = admin token
req.body{
    data:{
        product_name, price, cost, description, stock, category_id,
        image[{
            removeImages:[{ id, public_id }] //ลบข้อมูลรูปภาพใน db และ cloudinary (ลบข้อมูลใน db prisma คืนค่าข้อมูลที่ลบสำเร็จ นำข้อมูล public_id ไปลบใน cloudinary)
            addImages:[{image_name, position}] //ข้อมูลรูปภาพที่ต้องการเพิ่มเข้ามาใหม่ ใช้สำหรับเปรียบเทียบกับข้อมูลที่รีเทิร์นกลับมาจาก cloud
            updateImages:[{ id, position }] //แก้ไขตำแหน่งของรูปภาพ
        }]
    }
}
req.files: 'images' ไฟล์รูปภาพใหม่ที่เพิ่มเข้ามา
//--------------------
---//--- END SERVER ---//---

---//--- CLIENT ---//---
npm create vite@latest
projectname > client
framework > react
variant > js

css framework > tailwind
install with framework > vite > react

// ติดตั้งไลบราลี่เพื่อใช้จัดการฟอร์ม
// npm install react-hook-form zod @hookform/resolvers zxcvbn
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn"; //ใช้เพื่อดูค่าความคาดเดายากของ password

npm i axios
npm install zustand
npm i jwt-decode
npm install sweetalert2
npm i react-toastify
npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install pdfmake --save
npm i dayjs
npm install --save @stripe/react-stripe-js @stripe/stripe-js
npm install rc-slider --save


// ตัวอย่างการแปลง timestamp เป็นวันที่
// const time = timestamp;
// const DateTime = new Date(parseInt(time) * 1000)
// const date = new Date(parseInt(time) * 1000).getDate()
// const month = (new Date(parseInt(time) * 1000).getMonth()) + 1
// const year = new Date(parseInt(time) * 1000).getFullYear()
// console.log(date, '/', month, '/', year)
// console.log(all.toLocaleString('th-TH'))

// แปลงวันที่ (string) เป็น timestamp
// const DateTime = timeString
// const timestamp = new Date(DateTime).getTime()


**React รองรับ environment variables ตั้งแต่ react-scripts@0.5.0. ดังนั้นจึงไม่จำเป็นต้องติดตั้งแพ็คเกจอื่นเพิ่มเติม
โปรเจค react ใช้ process.env.REACT_APP_SOMEKEY ในไฟล์ .env ต้องนำหน้าคีย์ด้วย REACT_APP_
โปรเจค react ที่ติดตั้งด้วย vite ใช้ import.meta.env.VITE_API_SOMEKEY ในไฟล์ .env ต้องนำหน้าคีย์ด้วย VITE_

---//--- Deploy ---//---
Database ใช้ Supabase
1. ที่ Supabase เมื่อเข้าสู่ระบบแล้ว คลิกเลือกหรือสร้างโปรเจค จากนั้นคลิก connect จะเห็นโค้ด Transaction pooler และ Session pooler
2. .env
        DATABASE_URL = "" // (ใช้โค้ด Transaction pooler จาก Supabase)
        DIRECT_URL = "" // (ใช้โค้ด Session pooler จาก Supabase)
// ควรเพิ่มโค้ดด้านล่างนี้ด้วย ในระหว่างการ dev
DATABASE_URL : "?pgbouncer=true&connection_limit=1"
3. schema.prisma
        datasource db {
        provider  = "postgresql"
        url       = env("DATABASE_URL")
        directUrl = env("DIRECT_URL")
        }
4. npx prisma db push

---//--- Server --//---
1. สร้างไฟล์ vercel.json ที่ root ของโปรเจค พิมพ์โค้ดด้านล่างลงไป
{
    "version": 2,
    "name": "popdev",
    "builds": [
      {
        "src": "server.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "server.js",
        "headers": {
          "Access-Control-Allow-Origin": "*"
        }
      }
    ]
  }

2. ที่ไฟล์ package.json เพิ่ม "postinstall": "prisma generate"
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon server",
    "postinstall": "prisma generate" //เพิ่มบรรทัดนี้
  },
  
3. Push ขึ้น github
4. ที่เว็บ Vercel สร้างโปรเจคใหม่ขึ้นมา และทำการ import โปรเจคจาก github
4.1 ที่ช่อง in build command พิมพ์ npx prisma generate
4.2 เพิ่ม env ที่ต้องใช้

---//--- Client ---//---
1. สร้างไฟล์ vercel.json ที่ root ของโปรเจค พิมพ์โค้ดด้านล่างลงไป
{
    "routes":[
        {
            "src":"/[^.]+",
            "dest":"/"
        }
    ]
}

2. Push ขึ้น github
3. ที่เว็บ Vercel สร้างโปรเจคใหม่ขึ้นมา และ import โปรเจคจาก github
4. เพิ่ม env ที่ต้องใช้