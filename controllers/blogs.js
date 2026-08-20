const router = require("express").Router();
const { Op } = require("sequelize")
const { sequelize } = require('../util/db')

const { Blog, User } = require("../models");
const { tokenExtractor, blogFinder } = require("../middleware/middleware")

router.get("/", async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`
        }
      }
    ]
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })
  res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  res.json(req.blog);
});

router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save();
    res.json(req.blog);
  } catch (error) {
    next(error)
  }
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({
      ...req.body,
      userId: req.decodedToken.id,
    });
    res.json(blog);
  } catch (error) {
    next(error)
  }
});

router.delete("/:id", blogFinder, tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (user.id === req.blog.userId) {
      await req.blog.destroy();
      res.status(204).end();
    } else {
      return res.status(401).end();
    }
  } catch (error) {
    next(error)
  }
});

module.exports = router;
