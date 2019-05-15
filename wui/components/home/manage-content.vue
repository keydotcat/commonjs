<template>
  <div class="container-fluid">
    <user-info v-if="section == 'user' && page == 'info'"></user-info>
    <user-import v-if="section == 'user' && page == 'import'"></user-import>
    <user-export v-if="section == 'user' && page == 'export'"></user-export>
    <team-content v-if="section == 'team'" :tid="page"></team-content>
    <new-team v-on:created="navigateToTeam" v-if="section == 'new-team'"></new-team>
  </div>
</template>

<script>
import TeamContent from './manage/team-content'
import UserInfo from './manage/user-info-page'
import UserImport from './manage/user-import-page'
import UserExport from './manage/user-export-page'
import NewTeam from './new-team-page'

export default {
  name: 'manage-content',
  components: { TeamContent, UserInfo, UserExport, UserImport, NewTeam },
  props: {
    section: String,
    page: String
  },
  methods: {
    navigateToTeam(tid) {
      this.$emit('navigate','team',tid)
    }
  }
}
</script>

<style></style>
