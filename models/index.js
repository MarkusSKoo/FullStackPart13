const User = require("./user")
const Blog = require("./blog");

User.hasMany(Blog)
Blog.belongsTo(User)

User.sync({ alter: true });
Blog.sync({ alter: true });

module.exports = {
  Blog, User,
};
