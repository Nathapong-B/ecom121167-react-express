const z = require('zod');

const nameValidate = new RegExp(/^[a-zA-Z]+$|^[ก-๏\s]+$/);
const phoneValidate = new RegExp(/^\d+$/);
const dateValidate = new RegExp(/^(\d{4})-(\d{2})-(\d{2})+$/);

exports.registerSchema = z.object({
    email: z.string().nonempty({ message: 'Field is require' }).email({ message: 'Invalid Email' }),
    password: z.string().nonempty({ message: 'Field is require' }).min(8, { message: 'Password should be at least 8 characters' }),
});

exports.signinSchema = z.object({
    email: z.string().nonempty({ message: 'Field is require' }).email({ message: 'Invalid Email' }),
    password: z.string().nonempty({ message: 'Field is require' }),
});

exports.profileSchema = z.object({
    first_name: z.string().nonempty({ message: 'Field is require' }).regex(nameValidate, 'Invalid input'),
    last_name: z.string().nonempty({ message: 'Field is require' }).regex(nameValidate, 'Invalid input'),
    phone: z.string({ message: 'Input phone number' }).length(10, { message: 'Invalid phone number' }).nonempty({ message: 'Field is require' }).regex(phoneValidate, 'Invalid phone, Ex. 0123456789'),
    address: z.string().nonempty({ message: 'Field is require' }),
});

exports.datetimeSchema = z.object({
    date: z.string().nonempty({ message: 'Data is require' }).regex(dateValidate, 'Invalid input'),
});