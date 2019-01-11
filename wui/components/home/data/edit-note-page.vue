<template>
  <div>
    <div class="header px-3 py-3 pt-md-5 pb-md-4 d-flex justify-content-between">
      <h3 class="display-9">Edit Note</h3>
    </div>
    <note-detail :secret="secret"></note-detail>  
  </div>
</template>

<script>
import NoteDetail from '@/components/home/data/note_detail'

export default {
  name: 'edit-note-page',
  components: { NoteDetail },
  data() {
    return {}
  },
  computed: {
    secret() {
      return this.$store.state.secrets.secrets[this.$route.params.sid]
    }
  }
}
</script>
