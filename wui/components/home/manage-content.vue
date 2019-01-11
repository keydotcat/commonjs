<template>
  <div class="container-fluid">
      <div class="row">
        <nav class="col-md-2 d-none d-md-block sidebar">
          <div class="sidebar-sticky">
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>User</span>
            </h6>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link" :class="{'active': activePage == 'userInfo'}" href="#" @click="goto('userInfo')">Information</a>
                <a class="nav-link" :class="{'active': activePage == 'userImport'}" href="#" @click="goto('userImport')">Import</a>
                <a class="nav-link" :class="{'active': activePage == 'userExport'}" href="#" @click="goto('userExport')">Export</a>
              </li>
            </ul>
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Teams</span>
            </h6>
            <ul class="nav flex-column mb-2">
              <li class="nas-item" v-for="tid in $store.getters['user/team_ids']" v-if="isAdmin(tid)">
                <a class="nav-link" href="#" @click="setTeam(tid)" :class="{'active': activePage == 'team' && activeTid == tid}">
                {{$store.getters[`team.${tid}/name`]}}
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" @click="goto('newTeam')"><i class="material-icons">add_circle</i>Create team</a>
              </li>
            </ul>
          </div>
        </nav>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <user-info v-if="activePage=='userInfo'"></user-info>
          <user-import v-if="activePage=='userImport'"></user-import>
          <user-export v-if="activePage=='userExport'"></user-export>
          <team-content v-if="activePage=='team'" :tid="activeTid"></team-content>
        </main>
      </div>
    </div>
</template>

<script>
import TeamContent from './manage/team-content'
import UserInfo from './manage/user-info-page'
import UserImport from './manage/user-import-page'
import UserExport from './manage/user-export-page'

export default {
  name: 'manage-content',
  components: { TeamContent, UserInfo, UserExport, UserImport },
  data() {
    return {
      activePage: 'userInfo',
      activeTeam: ''
    }
  },
  methods: {
    isAdmin(tid) {
      var uid = this.$store.state.user.id
      return this.$store.getters[`team.${tid}/admins`].filter(admin => admin.id === uid).length > 0
    },
    setTeam(tid) {
      this.activePage = 'team'
      this.activeTid = tid
    },
    goto(where) {
      this.activePage = where
    }
  }
}
</script>

<style>
/*
 * Sidebar
 */

.sidebar {
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
}

.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 56px);
  /*padding-top: .5rem;*/
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

@supports ((position: -webkit-sticky) or (position: sticky)) {
  .sidebar-sticky {
    position: -webkit-sticky;
    position: sticky;
  }
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #999;
}

.sidebar .nav-link.active {
  color: #007bff;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: 0.75rem;
  text-transform: uppercase;
}
</style>
