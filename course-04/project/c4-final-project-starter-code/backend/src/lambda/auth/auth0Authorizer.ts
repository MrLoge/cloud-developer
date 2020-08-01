import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJWWFJNhTNA8DcMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi12djBpY3ZoYy5ldS5hdXRoMC5jb20wHhcNMjAwNzE5MTU1MTE1WhcN
MzQwMzI4MTU1MTE1WjAkMSIwIAYDVQQDExlkZXYtdnYwaWN2aGMuZXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoPzkcW39MS3H/ZXm
a2tEKvzdPROOlC9ad0UAnZ2NW8XCcy1PThW7hqU9YyUdpSPEnNtF0R6QFJLprTCW
1D1NjyZECe+bxVHDSoJ0JjJPFve3mIpfWF8fnrSdBabt6kevlxghlH2oyWvtWwDx
Oi9n+zLGrwVdCw8mf7q2Q5VJEggLsj5OWkTkiaZMWFezT4w7idKJqRQC+pyRTi15
se/69COMtJ+QL7oHL+r4nXAJU0nrW9JgvcFTprEO3Hj3FVKWoM06W/HvL5Do0E+6
m/d56CS6f2qYYdewXzf6K8336q22QKr4Q6xiaL0ATnz3sbELIeltpWEfrxvgicPL
Y4J6NwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRQ5ZZaaoda
UqaiLVzU2AC1rMuAeDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AEpL/2jrBllUZQgYMtNuvY5gJGKPd8Q/j/qNEHqrw4h+U63Vd5GHIp7EaS3Thgf+
DW0/Dr1KR1KFcBVlctc80iqzzZuRY/rBzlDeUwvpQdRoksNqjvWZmrjIgX5igFOc
HYNU/GwUtWYF3O0bqMyrlEhyjGicjOIEufcTzKrrXYeLe8xtnODI3+jUG0BnL239
nRxMUY2DFGTaPBG0eOI3ZaEobDyi5BznW7+9AsplUK46r+8Ku6KDjrnC5OvqXUdJ
Kg/jo1yExsBFKbAifo2XvHbA5iHDc8YaKrcdg4q5Y2E4lHPua2Z5Xa3jfKrstrHw
oxdAxRQnjX9cABLoMyLr/uM=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, certificate, { algorithms: ['RS256'] } ) as JwtPayload
}
