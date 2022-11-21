// import { Node } from '../lib/Node.js'
const { Node } = require('../lib/Node.js')
const { Config } = require('../config/Config.js')
var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {
  const employment = Config.defaults.employment
  const node = new Node({
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const responsibilities = (await node.query(
    {
      pk: `employment#${employment}`,
      sk: 'responsibility'
    }
  )).map(
    responsibility => {
      return {
        ...responsibility,
      }
    }
  )
  res.json(responsibilities)
})

router.get('/:employment', async function(req, res, next) {
  const employment = req.params.employment || Config.defaults.employment
  // console.log(employment)
  const node = new Node({
    endpoint: 'http://dynamodb.home:8000',
    table: Config.defaults.table
  })
  const employers = (await node.query({
    pk: `person#${Config.defaults.person}`,
    sk: 'employer'
  })).map((employer) => {
    return {
      ...employer,
      data: JSON.parse(employer.data)
    }
  })
  const employments = employers.map(async (employer) => {
    return await node.query({
      pk: `employer#${employer.data.name}`,
      sk: 'employment'
    })
  })
  const tmp = (await Promise.all(employments)).flat()
  const responsibilities = (
      tmp
      .map(async (employment) => {
        employment = {
          ...employment,
          data: JSON.parse(employment.data)
        }
        console.log('data', employment._sk)
        const responsibilities = await node.query({
          pk: `${employment._sk}`,
          sk: 'responsibility'
        })
        return responsibilities
      })
  )
  res.json(
    (await Promise.all(responsibilities)).flat()
      .map((responsibility) => {
        return {
          ...responsibility,
          data: JSON.parse(responsibility.data)
        }
      })
      .filter((responsibility) => responsibility._pk.includes(employment) )
  )
})

module.exports = router