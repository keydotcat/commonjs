import keyMgr from '@/commonjs/store/helpers/keymgrwrap'
import request from '@/commonjs/store/services/request'
import * as mt from '@/commonjs/store/mutation-types'

const state = {
  working: false,
  serverVersion: '',
  webVersion: '',
  error: '',
  errorFields: {
    id: '',
    email: '',
    fullname: ''
  }
}

const mutations = {
  [mt.PUB_VERSION](state, payload) {
    state.serverVersion = payload.server
    state.webVersion = payload.web
  },
  [mt.PUB_STOP_WORK](state, payload) {
    state.working = false
  },
  [mt.PUB_REGISTER_KO](state, payload) {
    state.working = false
    if (payload === undefined) {
      return
    }
    if (payload.data.error) {
      state.error = payload.data.error
    }
    if (payload.data.error_fields) {
      for (var k in payload.data.error_fields) {
        state.errorFields[k.substr(5)] = payload.data.error_fields[k]
      }
    }
  },
  [mt.PUB_START_WORK](state) {
    state.working = true
    state.registered = false
    state.error = ''
    state.errorFields.id = ''
    state.errorFields.email = ''
    state.errorFields.fullname = ''
  }
}

const getters = {
  url: state => {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:23764/api'
    }
    return window.location.origin + window.location.pathname + 'api'
  }
}

const actions = {
  async loadServerVersion(context, url) {
    if (!request.url) {
      request.url = url || context.getters.url
    }
    var resp = await request.get('/version')
    context.commit(mt.PUB_VERSION, resp.data)
  },
  async register(context, payload) {
    context.commit(mt.PUB_START_WORK)
    request.url = context.getters['url']
    console.log('UARS', request.url, context.getters)
    var userData = await keyMgr.generateUserKey(payload.username, payload.password)
    var adminKeys = {}
    adminKeys[payload.username] = userData.publicKeys
    var vaultData = await keyMgr.generateVaultKeys(adminKeys)
    var registerPayload = {
      id: payload.username,
      password: userData.password,
      user_keys: userData.keys,
      email: payload.email,
      fullname: payload.fullname,
      vault_public_keys: vaultData.publicKey,
      vault_keys: vaultData.keys[payload.username]
    }
    return request
      .post('/auth/register', registerPayload)
      .then(response => {
        context.commit(mt.PUB_STOP_WORK)
        return Promise.resolve(true)
      })
      .catch(err => {
        context.commit(mt.PUB_REGISTER_KO, err.response)
      })
  },
  confirmEmail(context, payload) {
    request.url = context.getters['url']
    context.commit(mt.PUB_START_WORK)
    return request
      .get('/auth/confirm_email/' + payload.token)
      .then(response => {
        context.commit(mt.PUB_STOP_WORK)
        return Promise.resolve(true)
      })
      .catch(() => {
        context.commit(mt.PUB_STOP_WORK)
      })
  },
  resendConfirmEmail(context, payload) {
    request.url = context.getters['url']
    context.commit(mt.PUB_START_WORK)
    return request
      .post('/auth/request_confirmation_token', { email: payload.email })
      .then(response => {
        context.commit(mt.PUB_STOP_WORK)
        return Promise.resolve(true)
      })
      .catch(() => {
        context.commit(mt.PUB_STOP_WORK)
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
