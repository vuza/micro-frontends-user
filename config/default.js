const config = {
  port: 3000,
  staticFilesConnectionString: 'http://user-mf.us-east-1.elasticbeanstalk.com',
  apiConnectionString: 'http://skipper.us-east-1.elasticbeanstalk.com',
  accessControlHeader: 'http://skipper.us-east-1.elasticbeanstalk.com',
  aws: {
    credentialsFilePath: null,
    s3Bucket: 'micro-frontends-css'
  }
}

module.exports = config
