const Config = {
  defaults: {
    person: 'Aaron Samuel',
    contact: 'gmail',
    company: 'Dark Photon IT Consultation, LLC.',
    employer: 'Scholastic',
    employment: 'Scholastic#DevOps Engineer#05-15-2014#07-01-2015',
    table: 'darkphoton',
    target: 'darkphoton.io',
    development: {
      database: {
        endpoint: 'http://dynamodb.home:8000',
        region: 'local'
      }
    },
    production: {
      database: {
        endpoint: 'http://dynamodb.home:8000',
        region: 'us-east-1'
      }
    }
  },
}

module.exports = {
  Config
}