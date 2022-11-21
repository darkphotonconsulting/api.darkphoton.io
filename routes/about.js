// import { Node } from '../lib/Node.js'
const { Node } = require('../lib/Node.js')
const { Config } = require('../config/Config.js')
var express = require('express');
var router = express.Router();

/**
 * @openapi
 * /:
 *  get:
 *   description: Get the about node for the default person
*     responses:
*       200:
*         description: The about node for the default person
*/
router.get('/', async function(req, res, next) {
  const node = new Node({
    // region: 'us-east-1',
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const people = await node.query(
    {
      pk: `person#${Config.defaults.person}`,
      sk: 'profile'
    }
  )
  const person = people[0]
  const profile = JSON.parse(person.data)
  res.json(profile)
})

router.get('/:name', async function(req, res, next) {
  const node = new Node({
    // region: 'us-east-1',
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const people = await node.query(
    {
      pk: `person#${Config.defaults.person}`,
      sk: 'profile'
    }
  )
  const person = people[0]
  const profile = JSON.parse(person.data)
  res.json(profile)
})


module.exports = router