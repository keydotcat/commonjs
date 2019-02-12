<template>
  <div class="rounded bg-light border-bottom w-100 d-flex align-items-center justify-content-end p-1">
    <input type="text" v-model="filter.search" @keyup="emitChanges" class="form-control mr-5" placeholder="Search">
    <i v-if="loading" class="material-icons spinner">autorenew</i>
    <div class="dropdown mr-2 d-flex align-items-center">
      <button class="btn btn-sm dropdown-toggle" :class="{'bg-success':filter.teams.length>0,'bg-transparent':filter.teams.length===0}" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Teams 
      </button>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" :class="{active: filter.teams.indexOf(team.id) > -1}" v-for="team in $store.getters['user/teams']" href="#" @click="toggleActiveTeam(team.id)">{{team.name}}</a>
      </div>
    </div>
    <div class="dropdown mr-2 d-flex align-items-center">
      <button class="btn btn-sm dropdown-toggle" :class="{'bg-success':filter.vaults.length>0,'bg-transparent':filter.vaults.length===0}" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Vaults 
      </button>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
        <div v-for="team in $store.getters['user/teams']">
          <a class="dropdown-item" :class="{active: isActiveVault(team.id,vault.id)}" v-for="vault in $store.getters[`team.${team.id}/vaults`]" href="#" @click="toggleActiveVault(team.id, vault.id)">{{team.name}}/{{vault.id}}</a>
        </div>
      </div>
    </div>

    <div class="dropdown mr-2 d-flex align-items-center">
      <button class="btn btn-sm dropdown-toggle" :class="{'bg-success':filter.labels.length>0,'bg-transparent':filter.labels.length===0}" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Labels
      </button>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" v-for="label in $store.getters['secrets/allLabels']" @click="toggleLabel(label)" :class="{active:isActiveLabel(label)}" href="#">{{label}}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'secret-filter',
  data() {
    return {
      filter: {
        search: '',
        labels: [],
        teams: [],
        vaults: []
      }
    }
  },
  computed: {
    loading() {
      return this.$store.state.secrets.loading > 0
    }
  },
  methods: {
    emitChanges() {
      this.$emit('update:filter', this.filter)
    },
    isActiveLabel(label) {
      return this.filter.labels.indexOf(label) > -1
    },
    toggleLabel(label) {
      var it = this.filter.labels.indexOf(label)
      if (it > -1) {
        this.filter.labels.splice(it, 1)
      } else {
        this.filter.labels.push(label)
      }
      this.emitChanges()
    },
    isActiveVault(tid, vid) {
      var k = `${tid}/${vid}`
      return this.filter.teams.indexOf(tid) > -1 || this.filter.vaults.indexOf(k) > -1
    },
    toggleActiveVault(tid, vid) {
      var k = `${tid}/${vid}`
      var it = this.filter.vaults.indexOf(k)
      if (it > -1) {
        this.filter.vaults.splice(it, 1)
      } else {
        this.filter.vaults.push(k)
      }
      this.emitChanges()
    },
    toggleActiveTeam(tid) {
      var it = this.filter.teams.indexOf(tid)
      if (it > -1) {
        this.filter.teams.splice(it, 1)
      } else {
        this.filter.teams.push(tid)
      }
      this.emitChanges()
    }
  }
}
</script>

<style>
.spinner {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
