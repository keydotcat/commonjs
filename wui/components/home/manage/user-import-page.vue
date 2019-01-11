<template>
  <div>
    <div class="header px-3 py-3 pt-md-5 pb-md-4 d-flex justify-content-between">
      <h3 class="display-9">Import from Keepass</h3>
    </div>
    <div class="upload-container">
      <form enctype="multipart/form-data">
        <div class="form-group">
          <label>Vault to import to</label>
          <select class="form-control form-control-sm" v-model="parentVault">
            <option :value="{tid: vt.tid, vid: vt.vid}" v-for="vt in $store.getters['user/allVaults']">{{vt.teamName}} / {{vt.vid}}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input class="form-control" type="password" v-model="importPass"></input>
        </div>
        <div class="form-group">
          <label for="vaultSelector">Keepass db file</label>
          <div class="dropbox">
            <input type="file" name="uploadFile" :disabled="!isInitial" @change="filesChange" class="input-file">
            <p v-if="isInitial">
              Drag your file(s) here to begin<br> or click to browse
            </p>
            <p v-if="isSaving">
              Uploading {{ fileName }}... (this may take a while)
            </p>
            <p v-if="isLoaded">
              Uploaded {{ fileName }}
            </p>
            <p v-if="isProcessing">
              Decoding {{ fileName }}...
            </p>
          </div>
        </div>
        <div class="form-group d-flex justify-content-end">
          <button type="button" class="btn btn-primary" @click="importDatabase" :disabled="!allOk">Import</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import toastSvc from '@/commonjs/wui/services/toast'
  import SecretData from '@/commonjs/secrets/secret_data'
  import kdbxweb from 'kdbxweb'

  const STATUS_INITIAL = 0
  const STATUS_SAVING = 1
  const STATUS_LOADED = 2
  const STATUS_PROCESSING = 3

  class FileContainer {
    constructor(){
      this.data = new ArrayBuffer(0)
    }
    empty(){
      return this.data.byteLength === 0
    }
    setData(d){
      this.data = d
    }
    getData(d){
      return this.data
    }
  }

  var fContainer = new FileContainer()

  function recurseKdbxGroups(groups, path) {
    var secrets = []
    groups.forEach( group => {
      group.entries.forEach( entry => {
        var pass = ''
        if(typeof entry.fields.Password === 'string') {
          pass = entry.fields.Password
        } else {
          pass = entry.fields.Password.getText()
        }
        secrets.push(new SecretData({
          type: 'location',
          name: entry.fields.Title || (entry.fields.URL ? entry.fields.URL.substring(0, 25) : false ) || 'Unnamed',
          urls: (entry.fields.URL.length > 0 ? [entry.fields.URL] : []),
          creds: [{username: entry.fields.UserName || '', password: pass, type: 'login'}],
          note: entry.fields.Notes,
          labels: ['imported:kdbx', [path, group.name].join('/').replace(/^\//g, '')].concat(entry.tags)
        }))
      })
      secrets = secrets.concat(recurseKdbxGroups(group.groups, `${path}/${group.name}`))
    })
    return secrets
  }

  export default {
    name: 'user-import',
    data () {
      return {
        uploadedFiles: [],
        uploadError: null,
        currentStatus: STATUS_INITIAL,
        fileName: '',
        parentVault: { tid: '', vid: '' },
        importPass: '',
        fileData: null
      }
    },
    computed: {
      allOk() {
        if(this.currentStatus !== STATUS_LOADED) { return false }
        if(this.importPass.length === 0 ) { return false }
        if(this.parentVault.tid.length === 0 ) { return false }
        if(this.parentVault.vid.length === 0 ) { return false }
        return true
      },
      isInitial() {
        return this.currentStatus === STATUS_INITIAL
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING
      },
      isLoaded() {
        return this.currentStatus === STATUS_LOADED
      },
      isProcessing() {
        return this.currentStatus === STATUS_PROCESSING
      }
    },
    methods: {
      importDatabase() {
        this.currentStatus = STATUS_PROCESSING
        setTimeout(() => {
          var secrets = []
          var credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString(this.importPass))
          kdbxweb.Kdbx.load(fContainer.getData(), credentials).then(db => {
            recurseKdbxGroups(db.groups, '').forEach( secret => {
              secrets.push(secret)
            })
            console.log('Starting cipher and save')
            this.currentStatus = STATUS_SAVING
            this.$store.dispatch( 'secrets/createList', {
              teamId: this.parentVault.tid,
              vaultId: this.parentVault.vid,
              secretList: secrets
            }).then( () => {
              this.currentStatus = STATUS_LOADED
              toastSvc.success('Imported entries')
            })
          }, () => {
            this.currentStatus = STATUS_LOADED
          })
        }, 1000)
      },
      reset() {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL
        this.uploadedFiles = []
        this.uploadError = null
        this.fileName = ''
      },
      filesChange(ev) {
        var fileList = ev.target.files

        if (!fileList.length) return
        this.fileName = fileList[0].name
        this.currentStatus = STATUS_SAVING

        var reader = new FileReader()
        //var self = this
        reader.onload = (ev) => {
          this.currentStatus = STATUS_LOADED
          fContainer.setData(ev.target.result)
        }
        reader.readAsArrayBuffer(fileList[0])
      }
    },
    mounted() {
      this.reset()
    }
  }
</script>

<style>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: #f8f9fa;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

  .dropbox > .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 180px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>

