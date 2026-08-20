const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')

const { User, Blog, ReadingList } = require('../models')
const { tokenExtractor } = require('../middleware/middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  const { username, name, password } = req.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  try {
    const user = await User.create({
      username,
      name,
      passwordHash
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  let where = {}
    
  if (req.query.read) {
    where = { read: req.query.read === "true" }
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: [
      {
        model: ReadingList,
        as: 'readings',
        attributes: ['id', 'read'],
        include: {
          model: Blog,
          attributes: ['id', 'url', 'title', 'author', 'likes', 'year']
        },
        where,
        required: false
      }
    ]
  })

  if (user) {
    const readings = user.readings.map(reading => ({
      ...reading.blog.toJSON(),
      reading_list: {
        read: reading.read,
        id: reading.id
      }
    }))

    res.json({
      name: user.name,
      username: user.username,
      readings
    })

  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (user) {
    user.name = req.body.name
    await user.save()
    res.json(user)
  } else {
    res.status(404).json({ error: 'user not found' })
  }
})

module.exports = router