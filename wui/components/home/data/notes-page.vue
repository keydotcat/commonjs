<template>
  <div>
    <div class="header px-3 py-3 pt-md-5 pb-md-4 d-flex justify-content-between">
      <h3 class="display-9">Notes</h3>
      <div class="input-group w-25 text-right d-flex flex-row-reverse">
        <button class="btn btn-primary" type="button" @click="createNote">New note</button>
      </div>
    </div>
    <div class="rounded border w-90 mb-2">
      <secret-filter v-on:update:filter="filter = $event"></secret-filter>
      <note v-on:edit-note="editNote" class="border-bottom" v-for="secret in pageNotes" :key="secret.fullId" :secret="secret" v-on:delete-note="requestDelete"></note>
      <div class="border-bottom p-3 text-center" v-if="loading && pageNotes.length == 0">Decrypting {{ $store.state.secrets.loading }} secrets...</div>
      <div class="rounded bg-light border-bottom w-100 d-flex align-items-cender justify-content-end p-1">
        <nav aria-label="Page navigation">
          <ul class="pagination m-0">
            <li class="page-item" :class="{ disabled: pageIdx == 0 }"><a class="page-link" @click="pageIdx -= 1" href="#">Previous</a></li>
            <li class="page-item" v-for="pid in pagesToFastJump" :class="{ active: pageIdx == pid }">
              <a class="page-link" @click="pageIdx = pid" href="#">{{ pid }}</a>
            </li>
            <li class="page-item" :class="{ disabled: pageIdx == numPages - 1 }"><a class="page-link" @click="pageIdx += 1" href="#">Next</a></li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="modal fade" id="deleteNoteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Delete note {{ secretToDel.name }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">Are you sure you want to delete {{ secretToDel.name }} note?</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">No, keep it</button>
            <button type="button" class="btn btn-primary" @click="deleteSecret">Yes, delete it</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//Indent fix
import Note from './note'
import SecretFilter from './secret-filter'
import $ from 'jquery'

export default {
  name: 'notes-page',
  components: { Note, SecretFilter },
  data() {
    return {
      filter: {},
      secretToDel: {
        name: '',
        tid: '',
        vid: '',
        sid: ''
      },
      pageIdx: 0,
      numLocs: 50
    }
  },
  computed: {
    loading() {
      return this.$store.state.secrets.loading > 0
    },
    allNotes() {
      return this.$store.getters['secrets/filteredSecrets']('note', this.filter)
    },
    pageNotes() {
      var start = this.pageIdx * this.numLocs
      return this.allNotes.slice(start, start + this.numLocs)
    },
    numPages() {
      return Math.ceil(this.allNotes.length / this.numLocs)
    },
    pagesToFastJump() {
      var pages = []
      var jumps = [-10, -5, -2, -1, 0, 1, 2, 5, 10]
      jumps.forEach(jump => {
        var t = this.pageIdx + jump
        if (t >= 0 && t < this.numPages) {
          pages.push(t)
        }
      })
      return pages
    }
  },
  methods: {
    editNote(fullId) {
      this.$emit('edit-note', fullId)
    },
    requestDelete(secret) {
      this.secretToDel.name = secret.data.name
      this.secretToDel.tid = secret.teamId
      this.secretToDel.vid = secret.vaultId
      this.secretToDel.sid = secret.secretId
      $('#deleteNoteModal').modal('show')
    },
    deleteSecret() {
      this.$store.dispatch('secrets/delete', {
        teamId: this.secretToDel.tid,
        vaultId: this.secretToDel.vid,
        secretId: this.secretToDel.sid
      })
      $('#deleteNoteModal').modal('hide')
    },
    createNote() {
      this.$emit('new-note')
    }
  }
}
</script>

<style></style>
