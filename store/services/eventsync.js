import * as ess from 'event-source-polyfill'
import store from '@/commonjs/store'
import request from '@/commonjs/store/services/request'

class EventSync {
  connect() {
    this.url = `${request.url}/eventsource`
    var es = new ess.EventSourcePolyfill(this.url, request.getHeaders())
    es.addEventListener('message', ev => {
      this.onMsg(ev)
    })
    es.addEventListener('open', () => {
      console.log('Connected to event source')
    })
  }
  async onMsg(msg) {
    var payload = JSON.parse(msg.data)
    var req = {
      teamId: payload.team,
      vaultId: payload.vault
    }
    console.log('Got event ', payload)
    switch (payload.action) {
      case 'secret:new':
      case 'secret:change':
        req.secret = payload.secret
        store.dispatch('secrets/setFromServer', req)
        break
      case 'secret:remove':
        req.secretId = payload.secret.id
        store.dispatch('secrets/deleteFromServer', req)
        break
    }
  }
}

export default new EventSync()