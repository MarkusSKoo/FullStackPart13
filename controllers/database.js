const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Blog, User } = require('../models')

router.post('/reset', async (req, res) => {
  await Blog.destroy({
    where: {}
  })
  await User.destroy({
    where: {}
  })
  res.status(200).end()
})

module.exports = router