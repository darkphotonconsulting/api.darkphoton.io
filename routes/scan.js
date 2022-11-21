// import { Node } from '../lib/Node.js'
const { Node } = require('../lib/Node.js')
const { Config } = require('../config/Config.js')
var express = require('express');
var router = express.Router();


router.get('/', async function(req, res, next) {
  const node = new Node({
    // region: 'us-east-1',
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const items = await node.scan()
  res.send(items)
})
module.exports = router