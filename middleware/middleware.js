const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Blog } = require("../models");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const blogFinder = async (req, res, next) => {
  console.log('REQ: ', req)
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id'})
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: error.errors[0].message})
  }

  next(error)
}

module.exports = { tokenExtractor, errorHandler, blogFinder }