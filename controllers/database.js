const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Blog, User, Session, ReadingList } = require('../models')

router.post('/reset', async (req, res) => {
  await ReadingList.destroy({
    where: {}
  }),
  await Session.destroy({
    where: {}
  }),
  await Blog.destroy({
    where: {}
  })
  await User.unscoped().destroy({
    where: {}
  })
  res.status(200).end()
})

module.exports = router