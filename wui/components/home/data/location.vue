<template>
  <div class="w-100">
    <div class="w-100 p-2 d-flex align-items-center">
      <i @click="toggleCreds" v-if="!displayCreds" class="material-icons">chevron_right</i>
      <i @click="toggleCreds" v-if="displayCreds" class="material-icons">expand_less</i>
      <span @click="toggleCreds" class="h5 m-0 ml-1">{{secret.data.name}}</span>
      <span class="badge badge-dark ml-1" v-for="label in secret.data.labels">{{label}}</span>
      <small class="text-muted ml-auto">{{$store.getters[`team.${secret.teamId}/name`]}}/{{secret.vaultId}}</small>
      <div class="dropdown ml-1">
        <i class="text-muted ml-1 material-icons" data-toggle="dropdown" id="dropdownMenuIcon">menu</i>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuIcon">
          <a class="dropdown-item" @click="editSecret" href="#">Edit</a>
          <a class="dropdown-item" @click="deleteSecret" href="#">Delete</a>
        </div>
      </div>
    </div>
    <div v-if="displayCreds" class="w-100 container border-top">
      <div class="row">
        <div class="col-sm-2 p-1 mr-2 text-right">Credentials</div>
        <div class="col-sm border-left p-0">
          <div v-for="cred in secret.data.creds" class="border-bottom p-1 d-flex justify-content-left lh-condensed">
            <div>
              <h6 class="my-0">{{cred.username}}</h6>
              <small class="text-muted">{{cred.name}}</small>
            </div>
            <div class="flex-grow-1 d-flex justify-content-end">
              <copy-button class="btn btn-sm btn-outline-secondary align-self-center" :copy="cred.username"><i
                  class="material-icons">account_circle</i> Copy username</copy-button>
              <copy-button class="btn btn-sm btn-outline-secondary align-self-center ml-2" :copy="cred.password.toString()"><i class="material-icons">vpn_key</i> Copy password</copy-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="displayCreds && secret.data.urls.length > 0" class="w-100 container border-top">
      <div class="row">
        <div class="col-sm-2 p-1 mr-2 text-right">Urls</div>
        <div class="col-sm border-left p-0">
          <div v-for="url in secret.data.urls" class="border-bottom p-1 d-flex justify-content-left lh-condensed">
            {{url}} <a class="ml-2 text-muted" :href="url" target="_blank"><i class="fa fa-external-link" aria-hidden="true"></i></a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="displayCreds && secret.data.note.length > 0" class="w-100 container border-top">
      <div class="row">
        <div class="col-sm-2 p-1 mr-2 text-right">Notes</div>
        <pre class="col-sm border-left p-1 m-0 secret-note">{{secret.data.note}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import CopyButton from './copy-button'

export default {
  name: 'location',
  components: { CopyButton },
  props: {
    secret: Object
  },
  data () {
    return {
      displayCreds: false
    }
  },
  methods: {
    toggleCreds() {
      this.displayCreds = !this.displayCreds
    },
    editSecret() {
      this.$router.push( `/home/data/location/${this.secret.fullId}` )
    },
    deleteSecret() {
      this.$emit('delete', this.secret)
    },
    copy(text) {
      var ref = this.$refs.copyHelper[0]
      ref.value = text
      ref.select()
      document.execCommand('copy')
      //ref.value = ''
    }
  }
}
</script>

<style>
div > .border-bottom:last-child { border-bottom: none!important;  }
.hide-input { width: 0px; }
.secret-note { font-family: 'Lato'; }
</style>
