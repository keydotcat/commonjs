<template>
  <div class="expandHeight">
    <home-header v-on:change="changePage"></home-header>
    <data-content v-if="section=='data'" :page="page"></data-content>
    <manage-content v-if="section!='data'" :section="section" :page="page"></manage-content>
  </div>
</template>

<script>
import HomeHeader from './home/header'
import DataContent from './home/data-content'
import ManageContent from './home/manage-content'

export default {
  name: 'home-page',
  components: { HomeHeader, DataContent, ManageContent },
  data() {
    return {
      section: 'data',
      page: 'locations'
    }
  },
  methods: {
    changePage(section, page) {
      this.section = section
      this.page = page
    }
  },
  beforeMount() {
    if (this.$store.state.user.id.length === 0) {
      this.$store.dispatch('user/loadInfo')
    }
  }
}
</script>
