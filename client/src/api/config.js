// const apiPath = 'http://localhost:3005';
const apiPath = import.meta.env.VITE_URL;

export const config = {
    authPath:apiPath+'/api',
    userPath: apiPath + '/api/user',
    categoryPath: apiPath + '/api/category',
    productPath: apiPath + '/api/product',
    orderPath: apiPath + '/api/order',
};

export const configHeaders = (token) => {
    return { headers: { authorization: 'Bearer ' + token } };
};