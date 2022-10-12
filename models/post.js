"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Comment, {
        foreignKey: "postId",
        sourceKey: "postId",
      });
      this.belongsTo(models.User, {
        foreignKey: "userId",
        sourceKey: "userId",
      });
      // this.belongsToMany(models.User, {
      //   through: "Likes",
      //   foreignKey: "postId",
      //   sourceKey: "postId",
      // });
      this.hasMany(models.Likes, {
        foreignKey: "postId",
        sourceKey: "postId",
      });
    }
  }
  Post.init(
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "userId",
        },
        onDelete: "cascade",
      },
      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING,
      },
      likesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // 아무런 값을 입력하지 않을 경우 현재 시간을 할당
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // 아무런 값을 입력하지 않을 경우 현재 시간을 할당
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
