<template>
  <div class="card">
    <div class="card-body">
     <h5 class="card-title" @click="bEditingName=true" :class="{'text-danger':!isOkName}" v-if='!bEditingName'>{{ note.name || 'Note name' }}
        <i class="material-icons text-muted mt-auto mb-auto float-right" @click='bEditingName=true'>edit</i>
      </h5>
      <h5 class="card-title" v-if='bEditingName'>
        <div class="input-group w-100">
          <input type="text" v-model="note.name" v-on:keyup.enter="bEditingName=false" class="form-control" placeholder="Note name" aria-label="name">
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
          <h6 class="card-subtitle m-2">Contents</h6>
          <div class="form-group pl-2">
            <textarea class="form-control" :rows="linesInNote" v-model="note.data"></textarea>
          </div>
        </div>
        <div class="col col-sm-3 border-left">
          <h6 class="card-subtitle m-2">Labels</h6>
          <text-list-editor :name='"label"' v-model="note.labels"></text-list-editor>
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
import TextListEditor from './secret/text-list-editor'
import NoteData from '@/commonjs/secrets/note_data'

export default {
  name: 'note-detail',
  components: { TextListEditor },
  props: {
    secret: Object
  },
  data() {
    var note = this.secret.data.cloneAsObject()
    var v = {
      tid: this.secret.teamId,
      vid: this.secret.vaultId
    }
    return {
      note: note,
      bEditingName: false,
      bSelectingVault: this.secret.secretId.length === 0,
      parentVault: v
    }
  },
  computed: {
    allVaults() {
      var vaults = []
      this.$store.getters['user/team_ids'].forEach(tid => {
        this.$store.state[`team.${tid}`].vaults.forEach(vault => {
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
      var nl = this.note.data.split(/\r\n|\r|\n/).length
      return nl < 10 ? nl : 10
    },
    isOkName() {
      return this.note.name.length > 0
    },
    isOk() {
      return this.isOkName
    }
  },
  methods: {
    saveChanges() {
      var args = {
        teamId: this.parentVault.tid,
        vaultId: this.parentVault.vid,
        secretData: new NoteData(this.note)
      }
      var action = 'secrets/create'
      if (this.secret.secretId) {
        action = 'secrets/update'
        args.secretId = this.secret.secretId
      }
      this.$store.dispatch(action, args).then(secret => {
        this.$emit('done')
      })
    },
    cancelChanges() {
      this.$emit('done')
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
