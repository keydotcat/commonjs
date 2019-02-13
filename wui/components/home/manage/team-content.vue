<template>
  <div class="mt-3">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent border-bottom">
      <a class="navbar-brand" href="#">Team {{ $store.getters[`team.${tid}/name`] }}</a>
      <ul class="navbar-nav">
        <li class="nav-item" :class="{ active: activePage == 'users' }">
          <a class="nav-link" @click="goto('users')" href="#">Users</a>
        </li>
        <li class="nav-item" :class="{ active: activePage == 'vaults' }">
          <a class="nav-link" @click="goto('vaults')" href="#">Vaults</a>
        </li>
      </ul>
    </nav>
    <team-users :tid="tid" v-if="activePage == 'users'"></team-users>
    <team-vaults :tid="tid" v-if="activePage == 'vaults'"></team-vaults>
  </div>
</template>

<script>
import TeamUsers from './team-users-page'
import TeamVaults from './team-vaults-page'

export default {
  name: 'team-content',
  components: { TeamUsers, TeamVaults },
  props: {
    tid: String
  },
  data() {
    return {
      activePage: 'users'
    }
  },
  methods: {
    goto(where) {
      this.activePage = where
    }
  }
}
</script>

<style></style>
