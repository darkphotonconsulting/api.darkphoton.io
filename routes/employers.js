// import { Node } from '../lib/Node.js'
const { Node } = require('../lib/Node.js')
const { Config } = require('../config/Config.js')
var express = require('express');
var router = express.Router();


router.get('/', async function(req, res, next) {
  // const target = req.params.target || 'Aaron Samuel'
  const node = new Node({
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const employers = (await node.query(
    {
      pk: `person#${Config.defaults.person}`,
      sk: 'employer'
    }
  )).map((employer) => {
    return {
      ...employer,
      data: JSON.parse(employer.data)
    }
  })
  res.json(employers)
})

router.get('/:person', async function(req, res, next) {
  const person = req.params.person || Config.defaults.person
  const node = new Node({
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const employers = (await node.query(
    {
      pk: `person#${person}`,
      sk: 'employer'
    }
  )).map((employer) => {
    return {
      ...employer,
      data: JSON.parse(employer.data)
    }
  })
  .sort((a, b) => {
    const aStart = new Date(
      a.data.start
    ).getTime()

    const bStart = new Date(
      b.data.start
    ).getTime()

    const aEnd = a.data.end ? new Date(a.data.end).getTime() : new Date().getTime
    const bEnd = b.data.end ? new Date(b.data.end).getTime() : new Date().getTime
    return aStart - bStart
  })
  res.json(employers)
})


module.exports = router