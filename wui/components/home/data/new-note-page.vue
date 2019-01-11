<template>
  <div>
    <div class="header px-3 py-3 pt-md-5 pb-md-4 d-flex justify-content-between">
      <h3 class="display-9">Create new note</h3>
    </div>
    <note-detail :secret="newSecret()"></note-detail>  
  </div>
</template>

<script>
import Secret from '@/commonjs/secrets/secret'
import NoteDetail from '@/components/home/data/note_detail'

export default {
  name: 'new-note-page',
  components: { NoteDetail },
  data() {
    return {}
  },
  methods: {
    newSecret() {
      return Secret.createNote()
    }
  }
}
</script>
