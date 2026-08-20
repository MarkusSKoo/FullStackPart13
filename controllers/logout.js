const router = require('express').Router()

const { tokenExtractor } = require("../middleware/middleware")

const User = require('../models/user')
const Session = require('../models/session')

router.delete('/', tokenExtractor, async (request, response) => {
  await request.session.destroy()
  response.status(204).end()
})

module.exports = router