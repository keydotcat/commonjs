<template>
  <div class="card">
    <div class="card-body">
     <h5 class="card-title" @click="bEditingName=true" :class="{'text-danger':!isOkName}" v-if='!bEditingName'>{{ loc.name || 'Location name' }}
        <i class="fas fa-edit float-right" @click='bEditingName=true'></i>
      </h5>
      <h5 class="card-title" v-if='bEditingName'>
        <div class="input-group w-100">
          <input type="text" v-model="loc.name" v-on:keyup.enter="bEditingName=false" class="form-control" placeholder="Location name" aria-label="name">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="bEditingName=false">Set name</button>
          </div>
        </div>
      </h5>
      <div class="row">
        <div class="col">
               <h6 class="card-subtitle m-2 text-muted" v-if="bSelectingVault">
            <div class="form-group">
              <label>Choose which vault to store the secret </label>
              <select class="form-control form-control-sm" v-model="parentVault">
                <option :value="{tid: vt.tid, vid: vt.vid}" v-for="vt in allVaults">{{vt.teamName}} / {{vt.vid}}</option>
              </select>
            </div>
          </h6>
          <h6 class="card-subtitle m-2 text-muted" v-if="!bSelectingVault">Vault {{$store.getters[`team.${parentVault.tid}/name`]}} / {{parentVault.vid}}</h6>
          <h6 class="card-subtitle m-2">URLs </h6>
          <text-list-editor :name='"URL"' v-model="loc.urls"></text-list-editor>
          <h6 class="card-subtitle m-2" :class="{'text-danger':!isOkCreds}">Credentials</h6>
          <ul class="list-group list-group-flush">
            <li class="list-group-item url-group-item" v-for="(cred,idcred) in loc.creds">
              <span v-if="!isCredBeingEdited(idcred)">{{cred.type}}: {{cred.username}}<i @click="editCredential(idcred)" class="fas fa-edit float-right"></i></span>
              <location-credential-editor :idcred="idcred" :cred="cred" v-on:delete="credDeletedCb($event)" v-on:change="credChangedCb($event)"
                v-on:cancel="cancelCredChangeCb($event)" v-if="isCredBeingEdited(idcred)" class="w-100"></location-credential-editor>
            </li>
            <li class="list-group-item url-group-item" @click="addNewCredential"><i class="fas fa-plus"></i> Add new credential</li>
          </ul>
          <h6 class="card-subtitle m-2">Notes</h6>
          <div class="form-group pl-2">
            <textarea class="form-control" :rows="linesInNote" v-model="loc.note"></textarea>
          </div>
        </div>
        <div class="col col-sm-3 border-left">
          <h6 class="card-subtitle m-2">Labels</h6>
          <text-list-editor :name='"label"' v-model="loc.labels"></text-list-editor>
        </div>
      </div>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <button type="button" :disabled="!isOk" class="btn btn-success" @click="saveChanges">Save</button>
      <button type="button" class="btn btn-danger ml-2" @click="cancelChanges">Cancel</button>
    </div>
  </div>
</template>

<script>
import LocationCredentialEditor from '@/components/home/data/location_credential_editor'
import TextListEditor from '@/components/home/data/secret/text_list_editor'
import SecretData from '@/commonjs/secrets/secret_data'

function isObjEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}

export default {
  name: 'location-detail',
  components: {LocationCredentialEditor, TextListEditor},
  props: {
    secret: Object
  },
  data () {
    var loc = this.secret.data.cloneAsObject()
    var v = {
      tid: this.secret.teamId,
      vid: this.secret.vaultId
    }
    return {
      loc: loc,
      bEditingName: false,
      bSelectingVault: this.secret.secretId.length === 0,
      parentVault: v,
      newUrl: '',
      showNewUrlInput: false,
      urlsInEditMode: {},
      showNewCredentialInput: false,
      credsInEditMode: {}
    }
  },
  computed: {
    allVaults() {
      var vaults = []
      this.$store.getters['user/team_ids'].forEach((tid) => {
        this.$store.state[`team.${tid}`].vaults.forEach((vault) => {
          vaults.push({
            tid: tid,
            vid: vault.id,
            teamName: this.$store.state[`team.${tid}`].name
          })
        })
      })
      return vaults
    },
    linesInNote() {
      var nl = this.loc.note.split(/\r\n|\r|\n/).length
      return (nl < 10 ? nl : 10)
    },
    isOkName(){
      return this.loc.name.length > 0
    },
    isOkCreds(){
      return this.loc.creds.length > 0
    },
    isOk(){
      return this.isOkName && this.isOkCreds && isObjEmpty(this.credsInEditMode) && isObjEmpty(this.urlsInEditMode)
    }
  },
  methods: {
    saveChanges() {
      var args = {
        teamId: this.parentVault.tid,
        vaultId: this.parentVault.vid,
        secretData: new SecretData(this.loc)
      }
      var action = 'secrets/create'
      if( this.secret.secretId ) {
        action = 'secrets/update'
        args.secretId = this.secret.secretId
      }
      this.$store.dispatch(action, args).then((secret) => {
        this.$router.push('/home/data/locations')
      })
    },
    cancelChanges() {
      this.$router.push('/home/data/locations')
    },
    editCredential(idcred) {
      this.$set(this.credsInEditMode, idcred, false)
    },
    cancelCredChangeCb(idcred) {
      if( this.credsInEditMode[idcred] ) {
        //New credential so has to be deleted
        this.loc.creds.splice(idcred, 1)
      }
      this.$delete(this.credsInEditMode, idcred)
    },
    credChangedCb(ev) {
      for( var k in this.loc.creds[ev.idcred] ) {
        this.$delete(this.loc.creds[ev.idcred], k)
      }
      for( k in ev.cred ) {
        this.$set(this.loc.creds[ev.idcred], k, ev.cred[k])
      }
      this.$delete(this.credsInEditMode, ev.idcred)
    },
    credDeletedCb(ev) {
      this.$delete(this.credsInEditMode, ev.idcred)
      this.$delete(this.loc.creds, ev.idcred)
    },
    isCredBeingEdited(idc) {
      return idc in this.credsInEditMode
    },
    addNewCredential () {
      this.loc.creds.push({})
      var cid = this.loc.creds.length - 1
      this.$set(this.loc.creds[cid], 'type', 'login')
      this.$set(this.credsInEditMode, cid, true)
    },
    saveUrl(idurl) {
      this.loc.urls[idurl] = this.urlsInEditMode[idurl]
      this.$delete(this.urlsInEditMode, idurl)
    },
    isUrlBeingEdited(idurl) {
      return idurl in this.urlsInEditMode
    },
    editUrl (idurl) {
      this.$set(this.urlsInEditMode, idurl, this.loc.urls[idurl])
    },
    addUrl () {
      this.loc.urls.push( this.newUrl )
      this.showNewUrlInput = false
    },
    showNewUrl () {
      this.showNewUrlInput = true
      this.newUrl = ''
    },
    createLocation () {
      this.$router.push( `/home/data/new_location` )
    }
  }
}
</script>

<style>
.url-group-item:first-child {
  border-top: 0px;
}

  .url-group-item:last-child {
    border-bottom: 0px;
  }
</style>
