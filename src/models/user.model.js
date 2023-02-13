module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    display_name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING
    },
    password : {
      type: Sequelize.STRING
    }
     


  });

  return User;
};
