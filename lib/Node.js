
const AWS = require('aws-sdk')
const EventEmitter = require('events')
class Node extends EventEmitter {
  #region = process.env.AWS_REGION || 'local'
  #endpoint = process.env.DYNAMODB_ENDPOINT
    ? process.env.DYNAMODB_ENDPOINT
    : 'http://localhost:8000'

  #table = 'darkphoton'
  #access = process.env.AWS_ACCESS_KEY_ID
    ? process.env.AWS_ACCESS_KEY_ID
    : 'fake'
  #secret = process.env.AWS_SECRET_ACCESS_KEY
    ? process.env.AWS_SECRET_ACCESS_KEY
    : 'fake'

  async #tables () {
    const tables = await this.dynamoClient.listTables().promise()
    return tables.TableNames
  }

  constructor ({
    access,
    secret,
    // region,
    endpoint,
    table,
    pk,
    sk
  }) {
    super()
    this.access = access || this.#access
    this.secret = secret || this.#secret
    // this.region = region || this.#region
    this.endpoint = endpoint || this.#endpoint
    this.table = table || this.#table
    this.pk = pk
    this.sk = sk
    this.dynamoClient = new AWS.DynamoDB({
      // credentials: {
      //   accessKeyId: this.access,
      //   secretAccessKey: this.secret
      // },
      region: this.region || this.#region,
      endpoint: new AWS.Endpoint(endpoint || this.#endpoint)
    })
    this.documentClient = new AWS.DynamoDB.DocumentClient({
      // credentials: {
      //   accessKeyId: this.access,
      //   secretAccessKey: this.secret
      // },
      region: this.region || this.#region,
      endpoint: new AWS.Endpoint(endpoint || this.#endpoint)
    })
  }

  get region () {
    return this.#region
  }

  set region (region) {
    this.#region = region
    this.dynamoClient.config.update({
      region,
      endpoint: new AWS.Endpoint(endpoint || this.#endpoint)
    })
    this.documentClient = new AWS.DynamoDB.DocumentClient({
      region: this.#region,
      endpoint: new AWS.Endpoint(endpoint || this.#endpoint)
    })
    // this.documentClient.config.update({ region })
  }

  async preflight () {
    const tables = await this.#tables()
    if (tables.includes(this.table)) {
      return true
    }
    return false
    // return tables.includes(this.table)
  }

  async scan () {
    if (await this.preflight()) {
      const params = {
        TableName: this.table
      }
      const result = await this.documentClient.scan(params).promise()
      return result.Items
    }
    throw new Error('Table does not exist')
  }

  async items () {
    if (await this.preflight()) {
      const items = await this.scan()
      return items
        .filter(
          item =>
            new RegExp(this.pk).test(item._pk) && new RegExp(this.sk).test(item._sk)
        )
    } else {
      throw new Error('Table does not exist')
    }
  }

  async query ({ pk, sk }) {
    if (await this.preflight()) {
      const params = {
        TableName: this.table,
        KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
        ExpressionAttributeNames: {
          '#pk': '_pk',
          '#sk': '_sk'
        },
        ExpressionAttributeValues: {
          ':pk': pk,
          ':sk': sk
        }
      }
      const result = await this.documentClient.query(params).promise()
      return result.Items
    } else {
      throw new Error('Table does not exist')
    }
  }

  async getNodes ({ pk, sk }) {
    if (await this.preflight()) {
      const items = await this.query({ pk, sk })
      return items.map(item => item._sk)
    } else {
      throw new Error('Table does not exist')
    }
  }

  async tables () {
    return await this.#tables()
  }
}

module.exports = {
  Node
  // People,
  // Person
}
