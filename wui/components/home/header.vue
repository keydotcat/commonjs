<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light clearfix">
    <a class="navbar-brand d-flex" href="#"><img class="navico mr-2" src="/favicon.ico" />KeyCat</a>
    <button
      class="navbar-toggler ml-auto"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">
        <li v-if="!$store.state.session.isWebExt" class="nav-item">
          <auto-logout></auto-logout>
        </li>
        <li class="nav-item dropdown" :class="{ active: section == 'data' }">
          <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
            Your data
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item text-right" href="#" @click.prevent="goto('data', 'locations')">Locations</a>
            <a class="dropdown-item text-right" href="#" @click.prevent="goto('data', 'notes')">Notes</a>
          </div>
        </li>
        <li class="nav-item dropdown" :class="{ active: section == 'user' || section == 'team' }">
          <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
            {{ $t('configure') }}
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <h6 class="dropdown-header text-right">User</h6>
            <a class="dropdown-item text-right" href="#" @click.prevent="goto('user', 'info')">Information</a>
            <a class="dropdown-item text-right" href="#" @click.prevent="goto('user', 'import')">Import</a>
            <div class="dropdown-divider"></div>
            <h6 class="dropdown-header text-right">Teams</h6>
            <a class="dropdown-item text-right" v-for="tid in $store.getters['user/team_ids']" href="#" @click.prevent="goto('team', tid)">
              {{ $store.getters[`team.${tid}/name`] }}
            </a>
            <a class="dropdown-item d-flex text-right" href="#" @click.prevent="goto('new-team')"> <i class="material-icons mr-1 text-muted ml-auto">add_box</i> Create team </a>
          </div>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click="logout()">
            {{ $t('logout') }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import AutoLogout from './auto-logout'
import $ from 'jquery'

export default {
  name: 'home-header',
  components: { AutoLogout },
  data() {
    return {
      section: 'data',
      page: 'locations'
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('session/logout')
    },
    goto(section, page) {
      this.section = section
      this.page = page
      this.$emit('navigate', section, page)
      $('.dropdown-toggle').dropdown('hide')
    }
  }
}
</script>

<style>
.navico {
  height: 30px;
}
</style>
