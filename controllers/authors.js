const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    order: [['likes', 'DESC']]
  });
  res.json(authors)
})

module.exports = router