import { z } from 'zod';

// regex
const nameValidate = new RegExp(/^[a-zA-Z]+$|^[ก-๏\s]+$/);
const phoneValidate = new RegExp(/^\d+$/);
const vDigit = new RegExp(/\d/);
const vUpper = new RegExp(/[A-Z]/);
const vLower = new RegExp(/.*[a-z]/);
const vExtra = new RegExp(/.*[^\w\d\s:]/);

export const registerSchema = z
    .object({
        email: z.string().nonempty({ message: 'Field is require' }).email({ message: 'Invalid Email' }),
        password: z.string().nonempty({ message: 'Field is require' }).min(8, { message: 'Password should be at least 8 characters' })
            .refine((value) => {
                if (!vDigit.exec(value)) {
                    return false;
                };
                if (!vUpper.exec(value)) {
                    return false;
                };
                if (!vLower.exec(value)) {
                    return false;
                };
                if (!vExtra.exec(value)) {
                    return false;
                };

                return true;
            }, 'Must contain number,upper,lower,non-alphabet'),
        confirmpassword: z.string().nonempty({ message: 'Field is require' }),
    })
    .refine(data => data.password === data.confirmpassword, { message: 'Password is not match', path: ['confirmpassword'] });

export const signinSchema = z.object({
    email: z.string().nonempty({ message: 'Field is require' }).email({ message: 'Invalid Email' }),
    password: z.string().nonempty({ message: 'Field is require' }),
});

export const profileSchema = z.object({
    first_name: z.string().nonempty({ message: 'Field is require' }).regex(nameValidate, 'Invalid input'),
    last_name: z.string().nonempty({ message: 'Field is require' }).regex(nameValidate, 'Invalid input'),
    phone: z.string({ message: 'Input phone number' }).length(10, { message: 'Invalid phone number' }).nonempty({ message: 'Field is require' }).regex(phoneValidate, 'Invalid phone, Ex. 0123456789'),
    address: z.string().nonempty({ message: 'Field is require' }),
});
