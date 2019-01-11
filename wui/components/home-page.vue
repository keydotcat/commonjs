<template>
  <div class="expandHeight">
    <home-header v-on:change="changePage"></home-header>
    <data-content v-if="activePage=='data'"></data-content>
    <manage-content v-if="activePage=='manage'"></manage-content>
  </div>
</template>

<script>
  import HomeHeader from './home/header'
  import DataContent from './home/data-content'
  import ManageContent from './home/manage-content'

  export default {
    name: 'home-page',
    components: { HomeHeader,DataContent, ManageContent },
    data() {
      return {
        activePage: 'data'
      }
    },
    methods: {
      changePage(page) {
        console.log('even!', page)
        this.activePage = page
      }
    },
    beforeMount() {
      if (this.$store.state.user.id.length === 0) {
        this.$store.dispatch('user/loadInfo')
      }
    }
  }
</script>
