const router = require('express').Router()
const { tokenExtractor, blogFinder } = require("../middleware/middleware")

const { Blog, User, ReadingList } = require("../models");

router.post('/', async (req, res, next) => {
  const { blogId, userId } = req.body
  if (!(blogId && userId)) {
    return res.status(400).json({ error: 'User id or blog id missing'})
  }

  try {
    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    const blogCheck = await ReadingList.findOne({ where: {
        userId: userId
      }
    })

    if (blogCheck) {
      return res.status(400).json({ error: 'Cannot add same blog twice '})
    }

    const createdReadingList = await ReadingList.create({
      userId: user.id, blogId: blog.id
    })

    res.json({
      id: createdReadingList.id,
      user_id: createdReadingList.userId,
      blog_id: createdReadingList.blogId,
      read: createdReadingList.read
    })

  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id)
    if (!readingList) {
      return res.status(404).json({ error: 'Reading list not found'})
    }

    if (readingList.userId !== req.decodedToken.id) {
      return res.status(401).json({ error: 'can only edit reading list that belongs to user'})
    }
    const read = req.body.read

    if (readingList.userId !== req.decodedToken.id) {
      return res.status(401).json({ error: 'Can only mark own reading lists as read' })
    }

    readingList.read = Boolean(read)
    const savedReadingList = await readingList.save()

    res.status(200).json(savedReadingList);
  } catch (error) {
    next(error)
  }
})

module.exports = router;