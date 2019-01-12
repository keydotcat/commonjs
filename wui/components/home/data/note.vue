<template>
  <div class="w-100">
    <div class="w-100 p-2 d-flex align-items-center">
      <i @click="toggle" v-if="!expanded" class="material-icons">chevron_right</i>
      <i @click="toggle" v-if="expanded" class="material-icons">expand_less</i>
      <span @click="toggle" class="h5 m-0 ml-1">{{secret.data.name}}</span>
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
    <div v-if="expanded" class="w-100 container border-top">
      <div class="row">
        <div class="col-sm-2 p-1 mr-2 text-right">Data</div>
        <pre class="col-sm border-left p-1 m-0 secret-note">{{secret.data.data}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'note',
  props: {
    secret: Object
  },
  data() {
    return {
      expanded: false
    }
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded
    },
    editSecret() {
      this.$emit('edit-note',this.secret.fullId)
    },
    deleteSecret() {
      this.$emit('delete-note', this.secret)
    }
  }
}
</script>

<style>
div > .border-bottom:last-child {
  border-bottom: none !important;
}
.hide-input {
  width: 0px;
}
.secret-note {
  font-family: 'Lato';
}
</style>
