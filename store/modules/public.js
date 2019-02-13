import keyMgr from '@/commonjs/store/helpers/keymgrwrap'
import request from '@/commonjs/store/services/request'
import toastMgr from '@/commonjs/store/helpers/toast'
import * as mt from '@/commonjs/store/mutation-types'

const state = {
  working: false,
  error: '',
  errorFields: {
    id: '',
    email: '',
    fullname: ''
  }
}

const mutations = {
  [mt.PUB_STOP_WORK](state, payload, asd) {
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

function getUrlRoot() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:23764/api'
  }
  return window.location.origin + window.location.pathname + 'api'
}

const actions = {
  register(context, payload) {
    context.commit(mt.PUB_START_WORK)
    request.url = getUrlRoot()
    keyMgr.generateUserKey(payload.username, payload.password).then(userData => {
      var adminKeys = {}
      adminKeys[payload.username] = userData.publicKeys
      keyMgr.generateVaultKeys(adminKeys).then(vaultData => {
        var registerPayload = {
          id: payload.username,
          password: userData.password,
          user_keys: userData.keys,
          email: payload.email,
          fullname: payload.fullname,
          vault_public_keys: vaultData.publicKey,
          vault_keys: vaultData.keys[payload.username]
        }
        request
          .post('/auth/register', registerPayload)
          .then(response => {
            context.commit(mt.PUB_STOP_WORK)
            toastMgr.success('register.done')
          })
          .catch(err => context.commit(mt.PUB_REGISTER_KO, err.response))
      })
    })
  },
  confirmEmail(context, payload) {
    request.url = getUrlRoot()
    context.commit(mt.PUB_START_WORK)
    request
      .get('/auth/confirm_email/' + payload.token)
      .then(response => {
        context.commit(mt.PUB_STOP_WORK)
        toastMgr.success('confirm_email.done')
      })
      .catch(() => {
        context.commit(mt.PUB_STOP_WORK)
      })
  },
  resendConfirmEmail(context, payload) {
    request.url = getUrlRoot()
    context.commit(mt.PUB_START_WORK)
    request
      .post('/auth/request_confirmation_token', { email: payload.email })
      .then(response => {
        context.commit(mt.PUB_STOP_WORK)
        toastMgr.success('resend_email.done')
      })
      .catch(() => {
        context.commit(mt.PUB_STOP_WORK)
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
