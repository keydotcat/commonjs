<template>
  <div>
    <div class="header px-3 py-3 pt-md-5 pb-md-4 d-flex justify-content-between">
      <h3 class="display-9">Edit location</h3>
    </div>
    <location-detail v-on:done="$emit('done')" :secret="secret"></location-detail>
  </div>
</template>

<script>
import LocationDetail from './location-detail'

export default {
  name: 'edit-location-page',
  components: { LocationDetail },
  props: {
    fullsecretid: String
  },
  data() {
    return {}
  },
  computed: {
    secret() {
      return this.$store.state.secrets.secrets[this.fullsecretid]
    }
  }
}
</script>
