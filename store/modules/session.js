import * as mt from '@/commonjs/store/mutation-types'
import browser from 'webextension-polyfill'
import request from '@/commonjs/store/services/request'
import keyMgr from '@/commonjs/store/helpers/keymgrwrap'
import eventSync from '@/commonjs/store/services/eventsync'

const SESSION_STORE_NAME = 'kcSession'

const state = {
  uid: '',
  isWebExt: false,
  loading: false
}

const mutations = {
  [mt.SESSION_SET_WEBEXT](state) {
    state.isWebExt = true
  },
  [mt.SESSION_WORKING](state) {
    state.loading = true
  },
  [mt.SESSION_LOGIN](state, { url, data, keys }) {
    var sData = {
      sessionToken: data.session_token,
      uid: data.user_id,
      url: url,
      keys: keys.data
    }
    var container = {}
    container[SESSION_STORE_NAME] = sData
    browser.storage.local.set(container)
    request.fromJson(sData)
    state.uid = sData.uid
    state.loading = false
    eventSync.connect()
  },
  [mt.SESSION_EXISTS](state, uid) {
    state.uid = uid
    console.log('sync', eventSync)
    state.loading = false
    eventSync.connect()
  },
  [mt.SESSION_LOGOUT](state) {
    state.uid = ''
    state.loading = false
    browser.storage.local.remove(SESSION_STORE_NAME)
  }
}

const getters = {
  loggedIn: state => {
    return state.uid.length > 0
  }
}

const actions = {
  loadFromExtensionStorage(context) {
    context.commit(mt.SESSION_SET_WEBEXT)
    context.commit(mt.SESSION_WORKING)
    return browser.storage.local.get(SESSION_STORE_NAME).then(data => {
      if (!(SESSION_STORE_NAME in data)) {
        return
      }
      var sData = data[SESSION_STORE_NAME]
      request.fromJson(sData)
      return request.get('/auth/session').then(response => {
        return keyMgr.setKeysFromStore(response.data.store_token, sData.keys).then(ok => {
          context.commit(mt.SESSION_EXISTS, sData.uid)
          request.onUnauthorized(() => {
            context.commit(mt.SESSION_LOGOUT)
          })
          return context.dispatch('user/loadInfo', {}, { root: true })
        })
      })
    })
  },
  login(context, { url, user, pass }) {
    request.url = url
    return keyMgr.hashPassword(user, pass).then(hPass => {
      var payload = { id: user, password: hPass.data, want_csrf: false }
      return request
        .post('/auth/login', payload, { errorPrefix: 'login.error' })
        .then(response => {
          var srvKeys = { publicKeys: response.data.public_key, secretKeys: response.data.secret_key }
          return keyMgr
            .setKeysFromServer(pass, response.data.store_token, srvKeys)
            .then(keysRet => {
              request.onUnauthorized(() => {
                context.commit(mt.SESSION_LOGOUT)
              })
              context.commit(mt.SESSION_LOGIN, { url: url, data: response.data, keys: keysRet })
              return context.dispatch('user/loadInfo', {}, { root: true })
            })
            .catch(err => {
              return { error: err }
            })
        })
        .catch(err => {
          return { error: request.processError(err) }
        })
    })
  },
  logout(context) {
    context.commit(mt.SESSION_LOGOUT)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
