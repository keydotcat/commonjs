<template>
  <div>
    <div class="header px-3 py-3 pt-md-5 pb-md-4 d-flex justify-content-between">
      <h3 class="display-9">Export to Keepass</h3>
    </div>
    <div class="upload-container">
      <form enctype="multipart/form-data">
        <label>Vaults to export</label>
        <div class="form-check ml-2" v-for="vt in $store.getters['user/allVaults']">
          <input class="form-check-input" type="checkbox" id="vaults" v-model="selectedVaults" :value="{ tid: vt.tid, vid: vt.vid }" />
          <label class="form-check-label" for="inlineCheckbox1">{{ vt.teamName }} / {{ vt.vid }}</label>
        </div>
        <div class="form-group mt-2">
          <label>Password</label>
          <input class="form-control" type="password" :class="{ 'is-invalid': checked && !isOkPass }" v-model="pass" />
        </div>
        <div class="form-group">
          <label>Password repeat</label>
          <input class="form-control" type="password" :class="{ 'is-invalid': checked && !isOkPass }" v-model="pass_repeat" />
        </div>
        <div class="form-group d-flex justify-content-end">
          <button type="button" class="btn btn-primary" @click="exportDatabase" :disabled="!allOk">Export</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
//import * as mt from '@/store/mutation-types'
import kdbxweb from 'kdbxweb'

export default {
  name: 'user-export',
  data() {
    var vaults = this.$store.getters['user/allVaults'].map((vaultData) => {
      return {
        tid: vaultData.tid,
        vid: vaultData.vid
      }
    })
    return {
      selectedVaults: vaults,
      pass: '',
      pass_repeat: '',
      checked: false
    }
  },
  computed: {
    isOkPass() {
      return this.pass.length > 0 && this.pass === this.pass_repeat
    },
    allOk() {
      if (this.selectedVaults.length === 0) {
        return false
      }
      //if(this.currentStatus !== STATUS_LOADED) { return false }
      //if(this.importPass.length === 0 ) { return false }
      //if(this.parentVault.tid.length === 0 ) { return false }
      //if(this.parentVault.vid.length === 0 ) { return false }
      return true
    }
  },
  methods: {
    exportDatabase() {
      this.checked = true
      if (!this.isOkPass) {
        return
      }
      var credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString(this.pass))
      var newDb = kdbxweb.Kdbx.create(credentials, this.$store.state.user.id + ' db')
      newDb.setVersion(3)
      newDb.setKdf(kdbxweb.Consts.KdfId.Aes)
      var vaultFilter = this.selectedVaults.map((v) => {
        return `${v.tid}/${v.vid}`
      })
      var dbGroups = {}
      var teams = this.$store.getters['user/teamMap']
      var getDBGroup = (secret) => {
        var teamName = teams[secret.teamId].name
        if (!(teamName in dbGroups)) {
          dbGroups[teamName] = newDb.createGroup(newDb.getDefaultGroup(), teamName)
        }
        const secretGroupKey = `${teamName}/${secret.vaultId}`
        if (!(secretGroupKey in dbGroups)) {
          dbGroups[secretGroupKey] = newDb.createGroup(dbGroups[teamName], secret.vaultId)
        }
        return dbGroups[secretGroupKey]
      }
      this.$store.getters['secrets/filteredSecrets']('location', { vaults: vaultFilter }).forEach((secret) => {
        var dbGroup = getDBGroup(secret)
        secret.data.creds.forEach((cred) => {
          var e = newDb.createEntry(dbGroup)
          e.tags = secret.data.labels
          e._setField('Title', secret.data.creds.length > 0 ? secret.data.name : secret.data.name + ' - ' + cred.username)
          e._setField('URL', secret.data.urls[0])
          e._setField('Notes', secret.data.note)
          e._setField('UserName', cred.username)
          e._setField('Password', cred.password)
        })
      })
      this.$store.getters['secrets/filteredSecrets']('note', { vaults: vaultFilter }).forEach((secret) => {
        var dbGroup = getDBGroup(secret)
        var e = newDb.createEntry(dbGroup)
        e._setField('Title', secret.data.name)
        e._setField('Notes', secret.data.data)
      })
      newDb.save().then((dataAsArrayBuffer) => {
        var blob = new Blob([dataAsArrayBuffer], { type: 'octet/stream' })
        var url = window.URL.createObjectURL(blob)
        var element = document.createElement('a')
        element.style.display = 'none'
        element.href = url
        element.download = this.$store.state.user.id + '.save.kdbx'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
        window.URL.revokeObjectURL(url)
      })
    }
  }
}
</script>

<style></style>
