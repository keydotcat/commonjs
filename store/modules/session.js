import * as mt from '@/commonjs/store/mutation-types'
import request from '@/commonjs/store/services/request'
import SessionStorage from '@/commonjs/store/helpers/session-storage'
import keyMgr from '@/commonjs/store/helpers/keymgrwrap'
import eventSync from '@/commonjs/store/services/eventsync'

var sessionStore = new SessionStorage()

const state = {
  uid: '',
  isWebExt: false,
  loading: false
}

const mutations = {
  [mt.SESSION_SET_WEBEXT](state, browserExt) {
    state.isWebExt = true
    sessionStore.setExtension(browserExt)
  },
  [mt.SESSION_WORKING](state) {
    state.loading = true
  },
  [mt.SESSION_LOGIN](state, { url, data, keys, csrf }) {
    var sData = {
      sessionToken: data.session_token,
      uid: data.user_id,
      url: url,
      keys: keys,
      csrf: csrf
    }
    request.fromJson(sData)
    state.uid = sData.uid
    state.loading = false
    sessionStore.save(sData)
  },
  [mt.SESSION_EXISTS](state, uid) {
    state.uid = uid
    state.loading = false
    if (state.isWebExt) {
      eventSync.connect()
    }
  },
  [mt.SESSION_LOGOUT](state) {
    state.uid = ''
    state.loading = false
    sessionStore.clean()
  }
}

const getters = {
  loggedIn: state => {
    return state.uid.length > 0
  }
}

function loadSessionData(context, data) {
  request.fromJson(data)
  return request.get('/auth/session').then(response => {
    return keyMgr.setKeysFromStore(response.data.store_token, data.keys).then(ok => {
      context.commit(mt.SESSION_EXISTS, data.uid)
      request.onUnauthorized(() => {
        context.commit(mt.SESSION_LOGOUT)
      })
      return context.dispatch('user/loadInfo', {}, { root: true })
    })
  })
}

const actions = {
  async loadFromLocalStorage(context) {
    context.commit(mt.SESSION_WORKING)
    var data = await sessionStore.load()
    if (!data) {
      context.commit(mt.SESSION_LOGOUT)
      return
    }
    return loadSessionData(context, data)
  },
  async loadFromExtensionStorage(context, browserExt) {
    context.commit(mt.SESSION_SET_WEBEXT, browserExt)
    context.commit(mt.SESSION_WORKING)
    var data = await sessionStore.load()
    if (!data) {
      context.commit(mt.SESSION_LOGOUT)
      return
    }
    return loadSessionData(context, data)
  },
  login(context, { url, user, pass, wantCsrf }) {
    request.url = url
    return keyMgr.hashPassword(user, pass).then(hPass => {
      var payload = { id: user, password: hPass, want_csrf: wantCsrf }
      return request
        .post('/auth/login', payload, { errorPrefix: 'login.error.' })
        .then(response => {
          var srvKeys = { publicKeys: response.data.public_key, secretKeys: response.data.secret_key }
          return keyMgr
            .setKeysFromServer(pass, response.data.store_token, srvKeys)
            .then(keysRet => {
              request.onUnauthorized(() => {
                context.commit(mt.SESSION_LOGOUT)
              })
              context.commit(mt.SESSION_LOGIN, {
                url: url,
                data: response.data,
                keys: keysRet,
                csrf: response.data.csrf_required && response.data.csrf
              })
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
