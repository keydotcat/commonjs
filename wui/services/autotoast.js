import toastSvc from './toast'

function extractErrorMsg(httpError, prefix) {
  if( !httpError.response ) {
    return 'errors.network'
  }
  var data = httpError.response.data
  if( data === null || !data.error ) {
    switch( httpError.code ) {
      case '401':
        return 'errors.unauthorized'
      case '400':
        return 'errors.bad_request'
      case '500':
        return 'errors.server'
    }
    return 'errors.unknown'
  }
  return (prefix || 'errors.') + data.error.toLowerCase().replace(new RegExp(' ', 'g'), '_')
}

const AutoToastSvc = {
  toastAxiosError: (err) => {
    var idx = extractErrorMsg(err, err.config['errorPrefix'])
    toastSvc.error(idx)
    return err
  },
  extractErrorMsg: extractErrorMsg
}

export default AutoToastSvc
