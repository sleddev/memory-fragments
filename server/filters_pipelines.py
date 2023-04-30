def find_user_from_token(token: str):
  return {
    'refresh_tokens': {
      '$elemMatch': {
        'access_tokens': {
          '$elemMatch': {
            'token': {
              '$eq': token
            }
          }
        }
      }
    }
  }

def find_user_from_refresh_token(token: str):
  return {
    'refresh_tokens': {
      '$elemMatch': {
        'token': {
          '$eq': token
        }
      }
    }
  }

def aggregate_refresh_token(token: str):
  return [
    {'$match': find_user_from_refresh_token(token)},
    {'$project': {
      '_id':0,
      'refresh_tokens': {
        '$filter': {
          'input': '$refresh_tokens',
          'as': 'refresh_token',
          'cond': {
            '$eq': ['$$refresh_token.token', token]
          }
        }
      }
    }},
  ]

def aggregate_access_token(token: str):
  return [
    {'$match': find_user_from_token(token)},
    {'$project': {'refresh_tokens': 1, '_id': 0}},
    {'$unwind': "$refresh_tokens"},
    {'$unwind': "$refresh_tokens.access_tokens"},
    {'$match': {'refresh_tokens.access_tokens.token': token}},
    {'$addFields': {
      'token': '$refresh_tokens.access_tokens.token',
      'created_at': '$refresh_tokens.access_tokens.created_at',
      'expires_at': '$refresh_tokens.access_tokens.expires_at'
    }},
    {'$project': {'token': 1, 'created_at': 1, 'expires_at': 1}}
  ]
