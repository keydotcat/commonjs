<template>
  <div>
    <div class="header px-3 py-3 pt-md-5 pb-md-4 d-flex justify-content-between">
      <h3 class="display-9">Create new location</h3>
    </div>
    <location-detail :secret="newSecret()"></location-detail>  
  </div>
</template>

<script>
  import Secret from '@/commonjs/secrets/secret'
  import LocationDetail from '@/components/home/data/location_detail'

  export default {
    name: 'new-location-page',
    components: {LocationDetail},
    data () {
      return {}
    },
    methods: {
      newSecret() {
        return Secret.createLocation()
      }
    }
  }
</script>

