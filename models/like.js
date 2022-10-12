"use strict";
const { Model } = require("sequelize");
/**
 * @param {import("sequelize").Sequelize} sequelize - Sequelize
 * @param {import("sequelize").DataTypes} DataTypes - Sequelize Column DataTypes
 * @return {Model} - Sequelize Model
 * **/
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Post, {
        foreignKey: "postId",
        sourceKey: "postId",
      });
      this.belongsTo(models.User, {
        foreignKey: "userId",
        sourceKey: "userId",
      });
    }
  }
  Likes.init(
    {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "userId",
        },
        onDelete: "cascade",
      },
      postId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Posts",
          key: "postId",
        },
        onDelete: "cascade",
      },
    },
    {
      sequelize,
      modelName: "Likes",
      timestamps: false,
    }
  );
  return Likes;
};
