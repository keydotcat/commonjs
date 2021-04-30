import teamSvc from '@/commonjs/store/services/team'
import keyMgr from '@/commonjs/store/helpers/keymgrwrap'
import Secret from '@/commonjs/secrets/secret'
import toastMgr from '@/commonjs/store/helpers/toast'
import * as mt from '@/commonjs/store/mutation-types'
import UrlParse from '@/commonjs/helpers/urlparse'
import Vue from 'vue'

const state = () => {
  return {
    secrets: {},
    labels: {},
    loading: 0,
    vaultVersion: {}
  }
}

function removeLabelsFromState(state, secret) {
  secret.data.labels.forEach((label) => {
    if (!(label in state.labels)) {
      return
    }
    var fullId = secret.fullId
    var fi = state.labels[label].indexOf(fullId)
    if (fi > -1) {
      state.labels[label].splice(fi, 1)
    }
    if (state.labels[label].length === 0) {
      Vue.delete(state.labels, label)
    }
  })
}

function addLabelsToState(state, secret) {
  secret.data.labels.forEach((label) => {
    if (!(label in state.labels)) {
      Vue.set(state.labels, label, [])
    }
    var fullId = secret.fullId
    var fi = state.labels[label].indexOf(fullId)
    if (fi === -1) {
      state.labels[label].push(fullId)
    }
  })
}

function addSecret(state, teamId, secret, openData) {
  var secretObj = new Secret({
    secretId: secret.id,
    vaultId: secret.vault,
    teamId: teamId,
    vaultVersion: secret.vault_version,
    createdAt: secret.created_at,
    updatedAt: secret.updated_at,
    data: openData
  })
  if (secretObj.fullId in state.secrets) {
    removeLabelsFromState(state, secretObj)
  }
  Vue.set(state.secrets, secretObj.fullId, secretObj)
  addLabelsToState(state, secretObj)
  setMaximumVaultVersion(state, teamId, secret.vault, secret.vault_version)
}

function setMaximumVaultVersion(state, teamId, vaultId, vaultVersion) {
  var tvid = `${teamId}/${vaultId}`
  if (!(tvid in state.vaultVersion) || state.vaultVersion[tvid] < vaultVersion) {
    Vue.set(state.vaultVersion, tvid, vaultVersion)
  }
}

function deleteVaultVersion(state, teamId, vaultId) {
  var tvid = `${teamId}/${vaultId}`
  Vue.delete(state.vaultVersion, tvid)
}

function getVaultVersion(state, teamId, vaultId) {
  var tvid = `${teamId}/${vaultId}`
  return state.vaultVersion[tvid] || 0
}

function deleteVaultSecrets(state, teamId, vaultId) {
  var toDelete = []
  for (var key in state.secrets) {
    var secretObj = state.secrets[key]
    if (secretObj.teamId === teamId && secretObj.vaultId === vaultId) {
      toDelete.push(key)
      removeLabelsFromState(state, secretObj)
    }
  }
  toDelete.forEach((key) => {
    Vue.delete(state.secrets, key)
  })
}

const mutations = {
  [mt.SECRET_SET_LOADING](state, loading) {
    state.loading += loading
  },
  [mt.SECRET_CLEAR_ALL]() {
    state.secrets = {}
    state.labels = {}
    state.vaultVersion = {}
  },
  [mt.SECRET_SET](state, { teamId, secret, openData }) {
    addSecret(state, teamId, secret, openData)
  },
  [mt.SECRET_SET_BULK](state, secretList) {
    secretList.forEach((data) => {
      addSecret(state, data.teamId, data.secret, data.openData)
    })
  },
  [mt.SECRET_UNSET](state, { teamId, vaultId, secretId }) {
    var sid = `${teamId}.${vaultId}.${secretId}`
    var secret = state.secrets[sid]
    removeLabelsFromState(state, secret)
    Vue.delete(state.secrets, sid)
  },
  [mt.SECRET_PURGE_VAULT](state, { teamId, vaultId }) {
    deleteVaultSecrets(state, teamId, vaultId)
    deleteVaultVersion(state, teamId, vaultId)
  },
  [mt.SECRET_SET_VAULT_VERSION](state, { teamId, vaultId, vaultVersion }) {
    setMaximumVaultVersion(state, teamId, vaultId, vaultVersion)
  }
}

function filterPass(secret, filter) {
  if (filter.labels && filter.labels.length > 0) {
    var found =
      secret.data.labels.filter((label) => {
        return filter.labels.indexOf(label) > -1
      }).length > 0
    if (!found) {
      return false
    }
  }
  if (filter.teams && filter.teams.length > 0) {
    if (filter.teams.indexOf(secret.teamId) === -1) {
      return false
    }
  }
  if (filter.vaults && filter.vaults.length > 0) {
    if (filter.vaults.indexOf(`${secret.teamId}/${secret.vaultId}`) === -1) {
      return false
    }
  }
  return (filter.search || '').length === 0 || (secret.data.name || '').toLowerCase().indexOf(filter.search.toLowerCase()) > -1
}

const getters = {
  filteredSecrets: (state) => {
    return (type, filter) => {
      var filtered = []
      for (var sid in state.secrets) {
        var sec = state.secrets[sid]
        if (sec.data.type === type && filterPass(sec, filter)) {
          filtered.push(sec)
        }
      }
      return filtered
    }
  },
  allLabels: (state) => {
    return Object.keys(state.labels).sort()
  },
  forUrl: (state) => {
    return (origin) => {
      var oD = UrlParse.getDomain(origin)
      if (!oD) {
        return []
      }
      var creds = []
      for (var sid in state.secrets) {
        var sec = state.secrets[sid]
        if (sec.domains.indexOf(oD) > -1) {
          creds.push(sec)
        }
      }
      return creds
    }
  }
}

var gVKeys = {}

function getVaultKeyFromList(vaults, tid, vid) {
  var key = `${tid}.${vid}`
  if (!(key in gVKeys)) {
    vaults.forEach((vault) => {
      if (vid === vault.id) {
        gVKeys[key] = {
          publicKeys: vault.public_key,
          secretKeys: vault.key
        }
      }
    })
  }
  return gVKeys[key]
}

function updateOrCreate(context, ftor, tid, vid, sid, data, newTeamId, newVaultId) {
  return new Promise((resolve, reject) => {
    if (typeof data.cloneAsObject !== 'function') {
      throw new Error('Expected SecretData object')
    }
    var targetTeam = newTeamId || tid
    var targetVault = newVaultId || vid
    var vKeys = getVaultKeyFromList(context.rootState[`team.${targetTeam}`].vaults, targetTeam, targetVault)
    keyMgr.serializeAndClose(vKeys, data.cloneAsObject()).then((closedData) => {
      ftor({ teamId: tid, vaultId: vid, secretId: sid, closedData: closedData, newTeamId: newTeamId, newVaultId: newVaultId })
        .then((secret) => {
          keyMgr.openAndDeserialize(vKeys, secret.data).then((openData) => {
            if (newTeamId && newVaultId) {
              context.commit(mt.SECRET_UNSET, { teamId: tid, vaultId: vid, secretId: sid })
            }
            context.commit(mt.SECRET_SET, { teamId: targetTeam, secret: secret, openData: data })
            resolve(secret)
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  })
}

function unpackTeamSecrets(context, teamId, vaults, resp) {
  var vsa = resp.secrets.map((secret) => {
    return {
      v: getVaultKeyFromList(vaults, teamId, secret.vault),
      s: secret.data
    }
  })
  context.commit(mt.SECRET_SET_LOADING, 1)
  return keyMgr.openAndDeserializeBulk(vsa).then((dataList) => {
    dataList.forEach((data, ip) => {
      context.commit(mt.SECRET_SET, { teamId: teamId, secret: resp.secrets[ip], openData: data })
    })
    toastMgr.success('Import successful')
    context.commit(mt.SECRET_SET_LOADING, -1)
  })
}

async function reloadVaultSecrets(context, teamId, vaultId, vaultVersion) {
  var vKeys = getVaultKeyFromList(context.rootState[`team.${teamId}`].vaults, teamId, vaultId)
  context.commit(mt.SECRET_PURGE_VAULT, { teamId, vaultId })
  var secretsResp = await teamSvc.loadVaultSecrets(teamId, vaultId)
  secretsResp.secrets.forEach((secret) => {
    keyMgr.openAndDeserialize(vKeys, secret.data).then((opened) => {
      context.commit(mt.SECRET_SET, { teamId: teamId, secret: secret, openData: opened })
    })
  })
  context.commit(mt.SECRET_SET_VAULT_VERSION, { teamId, vaultId, vaultVersion })
}

const actions = {
  loadSecretsFromTeam(context, { teamId, vaults }) {
    teamSvc.loadSecrets(teamId).then((resp) => {
      var vsa = resp.secrets.map((secret) => {
        return {
          v: getVaultKeyFromList(vaults, teamId, secret.vault),
          s: secret.data
        }
      })
      context.commit(mt.SECRET_SET_LOADING, vsa.length)
      keyMgr.openAndDeserializeBulk(vsa).then((dataList) => {
        context.commit(
          mt.SECRET_SET_BULK,
          dataList.map((data, ip) => {
            return { teamId: teamId, secret: resp.secrets[ip], openData: data }
          })
        )
        context.commit(mt.SECRET_SET_LOADING, -vsa.length)
      })
    })
  },
  update(context, { teamId, vaultId, secretId, secretData, newTeamId, newVaultId }) {
    return updateOrCreate(context, teamSvc.updateSecret, teamId, vaultId, secretId, secretData, newTeamId, newVaultId)
  },
  create(context, { teamId, vaultId, secretData }) {
    return updateOrCreate(context, teamSvc.createSecret, teamId, vaultId, '', secretData)
  },
  createList(context, { teamId, vaultId, secretList }) {
    var vKeys = getVaultKeyFromList(context.rootState[`team.${teamId}`].vaults, teamId, vaultId)
    var proms = secretList.map((data) => {
      return keyMgr.serializeAndClose(vKeys, data.cloneAsObject())
    })
    return Promise.all(proms).then((closedList) => {
      var payload = closedList.map((c) => {
        return { data: c }
      })
      return teamSvc.createSecretList({ teamId: teamId, vaultId: vaultId, payload: payload }).then((resp) => {
        return unpackTeamSecrets(context, teamId, context.rootState[`team.${teamId}`].vaults, resp)
      })
    })
  },
  delete(context, { teamId, vaultId, secretId }) {
    teamSvc.deleteSecret(teamId, vaultId, secretId).then((resp) => {
      context.commit(mt.SECRET_UNSET, { teamId: teamId, vaultId: vaultId, secretId: secretId })
    })
  },
  setFromServer(context, { teamId, vaultId, secret }) {
    var vKeys = getVaultKeyFromList(context.rootState[`team.${teamId}`].vaults, teamId, vaultId)
    keyMgr.openAndDeserialize(vKeys, secret.data).then((opened) => {
      context.commit(mt.SECRET_SET, { teamId: teamId, secret: secret, openData: opened })
    })
  },
  deleteFromServer(context, { teamId, vaultId, secretId }) {
    context.commit(mt.SECRET_UNSET, { teamId: teamId, vaultId: vaultId, secretId: secretId })
  },
  reload(context) {
    context.commit(mt.SECRET_CLEAR_ALL)
    context.commit('user/' + mt.USER_TEAMS_RELOAD, {}, { root: true })
  },
  async syncWhenNeeded(context, teamVaultIds) {
    var checked = []
    for (var tid in teamVaultIds) {
      for (var vid in teamVaultIds[tid]) {
        checked.push(`${tid}/${vid}`)
        if (!(`team.${tid}` in context.rootState)) {
          console.log(`Team ${tid} not yet initialized. Skippping..`)
          continue
        }
        var vaultVersion = teamVaultIds[tid][vid]
        if (getVaultVersion(context.state, tid, vid) >= vaultVersion) {
          continue
        }
        console.log(`Syncing vault ${tid}/${vid}`)
        reloadVaultSecrets(context, tid, vid, vaultVersion)
      }
    }
    var toDel = []
    for (var key in context.state.vaultVersion) {
      if (checked.indexOf(key) === -1) {
        toDel.push(key)
      }
    }
    toDel.forEach((key) => {
      var sp = key.split('/')
      var tid = sp[0]
      var vid = sp.splice(1).join('/')
      console.log(`Deleting vault ${tid}/${vid}`)
      context.commit(mt.SECRET_PURGE_VAULT, { tid, vid })
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
