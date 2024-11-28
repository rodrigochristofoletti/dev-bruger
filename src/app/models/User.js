//import Sequelize, { Model } from "sequelize";
const Sequelize = require('sequelize');
const { Model } = Sequelize;


class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password_hash: Sequelize.STRING,
      admin: Sequelize.BOOLEAN,
    },
    {
        sequelize,
    }
);
  }
}

module.exports = User;
//export default User;