require('babel-register');
const mysql=require('mysql')
const db=mysql.createConnection({
    host:'localhost',
    database:'users',
    user:'root',
    password:''
})
module.exports=db;
