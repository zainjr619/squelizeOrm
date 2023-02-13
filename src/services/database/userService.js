const mysql = require("mysql2");
const db = require("../../models");
const User = db.user;


exports.createUserAccount = async (username, email, password,  role) => {
  
  // Create a Tutorial
  const user = {
    username:username,
    email:email,
    password:password,
    role:role
  };

  // Save Tutorial in the database
 const res=await User.create(user);
 return res;
  
};

exports.getUsers = async () => {
  const res=await User.findAll();
  return res;
};

exports.updateUserPassword = async (userId, password) => {
  const id = userId;

  const res=await User.update(password, {
    where: { id: id }
  })
  return res;
    
};

exports.deleteUser = async (userId) => {
  const id = userId;

const res=await User.destroy({
    where: { id: id }
  })
   return res;
};

exports.login = async (email, password) => {
  //* --------------  QUERY EXISTING USER ----------------------------------------- */
  let user = await this.getUser(email, password);
  return user;
};

exports.getUserByEmail = async (email) => {
  let resp = await User.findOne({ where : {email}})
  // let sql = `SELECT id, username, password
  //              FROM users 
  //             WHERE email = '${email}'`;
  return resp;
};

exports.getUser = async (email, password) => {
  let sql = `SELECT id, username, password, role
               FROM users 
              WHERE username = '${email}' and password='${password}'`;
  let resp = await mysql.query(sql);
  return resp;
};
