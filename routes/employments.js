// import { Node } from '../lib/Node.js'
const { Node } = require('../lib/Node.js')
const { Config } = require('../config/Config.js')
var express = require('express');
var router = express.Router();


router.get('/', async function(req, res, next) {
  const data = []
  const node = new Node({
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const employers = (
    await node.query({
      pk: `person#${Config.defaults.person}`,
      sk: 'employer'
    })
  ).map((employer) => {
    return {
      ...employer,
      data: JSON.parse(employer.data)
    }
  })
  for (const employer of employers) {
    const employments = ((
      await node.query({
        pk: `employer#${employer.data.name}`,
        sk: 'employment'
      })
    )).map((employment) => {
      return {
        ...employment,
        data: JSON.parse(employment.data)
      }
    })
    data.push(...employments)
  }
  // const employments = (await node.query(
  //   {
  //     pk: `employer#${employer}`,
  //     sk: 'employment'
  //   }
  // )).map(
  //   employment => {
  //     return {
  //       ...employment,
  //       data: JSON.parse(employment.data)
  //     }
  //   }
  // )
  res.json(data)
})

router.get('/:employer', async function(req, res, next) {
  const employer = req.params.employer || Config.defaults.employer
  const node = new Node({
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const employments = (await node.query(
    {
      pk: `employer#${employer}`,
      sk: 'employment'
    }
  )).map(
    employment => {
      return {
        ...employment,
        data: JSON.parse(employment.data)
      }
    }
  )
  res.json(employments)
})

module.exports = router