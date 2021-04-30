import keyMgr from '@/commonjs/store/helpers/keymgrwrap'
import toastMgr from '@/commonjs/store/helpers/toast'
import userSvc from '@/commonjs/store/services/user'

import * as mt from '@/commonjs/store/mutation-types'

const state = {
  fullname: '',
  id: '',
  publicKeys: '',
  email: '',
  teams: []
}

const mutations = {
  [mt.USER_LOAD_INFO](state, payload) {
    state.fullname = payload.fullname
    state.id = payload.id
    state.publicKeys = payload.public_key
    state.email = payload.email
    state.teams.splice(0, state.teams.length)
    for (var i = 0; i < payload.teams.length; i++) {
      state.teams.push(payload.teams[i])
    }
  },
  [mt.USER_CLEAR](state) {
    state.fullname = ''
    state.id = ''
    state.publicKeys = ''
    state.email = ''
    state.teams.splice(0, state.teams.length)
  },
  [mt.USER_TEAMS_RELOAD](state) {
    //Do nothing. The auto-team plugins will do it
  }
}

const getters = {
  team_ids: (state) => {
    const teams = [...state.teams].sort((a, b) => {
      if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
      return 0
    })
    return teams.map((team) => team.id)
  },
  teams: (state) => {
    const teams = [...state.teams].sort((a, b) => {
      if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
      return 0
    })
    return teams
  },
  teamMap: (state) => {
    var teamMap = {}
    state.teams.forEach((team) => {
      teamMap[team.id] = team
    })
    return teamMap
  },
  allVaults: (state, getters, rootState, rootGetters) => {
    var vaults = []
    getters['team_ids'].forEach((tid) => {
      rootState[`team.${tid}`].vaults.forEach((vault) => {
        vaults.push({
          tid: tid,
          vid: vault.id,
          teamName: rootState[`team.${tid}`].name
        })
      })
    })
    return vaults
  }
}

const actions = {
  loadInfo(context) {
    return userSvc.loadInfo().then((info) => {
      context.commit(mt.USER_LOAD_INFO, info)
      return { ok: true }
    })
  },
  createTeam(context, payload) {
    var req = {}
    req[context.state.id] = context.state.publicKeys
    return keyMgr.generateVaultKeys(req).then((vaultKeys) => {
      return userSvc
        .createTeam({
          name: payload,
          vault_keys: {
            public_key: vaultKeys.publicKey,
            keys: vaultKeys.keys
          }
        })
        .then((teamInfo) => {
          toastMgr.success('Team created')
          return context.dispatch('loadInfo').then(() => {
            return teamInfo.id
          })
        })
    })
  },
  changeEmail(context, email) {
    userSvc.changeEmail(email).then((info) => {
      toastMgr.success('Email change requested')
    })
  },
  changePassword(context, password) {
    return new Promise((resolve, reject) => {
      keyMgr.closeKeysWithPassword(context.state.id, password).then((data) => {
        userSvc.changePassword(data.password, data.keys).then((info) => {
          toastMgr.success('Password changed')
        })
        resolve(data)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
