// import { Node } from '../lib/Node.js'
const { Node } = require('../lib/Node.js')
const { Config } = require('../config/Config.js')
var express = require('express');
var router = express.Router();


router.get('/', async function(req, res, next) {
  // console.log(req)
  const target = req.params.target || 'Aaron Samuel'
  const node = new Node({
    // region: 'us-east-1',
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const philosophies = await node.query(
    {
      pk: `company#${Config.defaults.company}`,
      sk: 'philosophy'
    }
  )
  res.json(philosophies)
})

// router.get('/:owner', async function(req, res, next) {
//   const owner = req.params.owner || 'Aaron Samuel'
//   const node = new Node({
//     // region: 'us-east-1',
//     endpoint: 'http://dynamodb.home:8000',
//     table: Config.defaults.table
//   })
//   const companies = (await node.query(
//     {
//       pk: `person#${owner}`,
//       sk: 'company'
//     }
//   )).map((company) => {
//     return {
//       ...company,
//       data: JSON.parse(company.data)
//     }
//   })
//   res.json(companies)
// })


module.exports = router