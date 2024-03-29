// import { Node } from '../lib/Node.js'
const { Node } = require('../lib/Node.js')
const { Config } = require('../config/Config.js')
var express = require('express');
var router = express.Router();


router.get('/', async function(req, res, next) {
  const target = req.params.target || 'Aaron Samuel'
  const node = new Node({
    // region: 'us-east-1',
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const services = (await node.query(
    {
      pk: `company#${Config.defaults.company}`,
      sk: 'service'
    }
  )).map((service) => {
    return {
      ...service,
      data: JSON.parse(service.data)
    }
  })
  res.setHeader('Content-Type', 'application/json');
  res.json(services)
})



module.exports = router