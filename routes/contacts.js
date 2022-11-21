// import { Node } from '../lib/Node.js'
const { Node } = require('../lib/Node.js')
const { Config } = require('../config/Config.js')
var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {
  console.log(req.params)
  // const target = req.params.target || 'Aaron Samuel'
  const node = new Node({
    // region: 'us-east-1',
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const contacts = await node.query(
    {
      pk: `person#${Config.defaults.person}`,
      sk: 'contact'
    }
  )
  res.json(contacts)
})

router.get('/:name', async function(req, res, next) {
  const name = req.params.name || 'gmail'
  const node = new Node({
    // region: 'us-east-1',
    endpoint: 'http://dynamodb.home:8000',
    table: 'darkphoton'
  })
  const contacts = (await node.query(
    {
      pk: `person#${Config.defaults.person}`,
      sk: 'contact'
    }
  )).map((contact) => {
    return {
      ...contact,
      data: JSON.parse(contact.data)
    }
  })
  res.json(contacts.find((contact) => contact.data.name === name))
})

module.exports = router