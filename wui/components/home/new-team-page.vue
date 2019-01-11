<template>
    <div class="expandHeight centerFlex">
      <form class="form-login" @submit="submit">
        <h1 class="h3 mb-3 font-weight-normal">{{$t('create_new_team')}}</h1>
          <div class="form-group">
            <label for="name">{{$t('fields.team_name')}}</label>
            <input type="text" v-model="team_name" :disabled="working" class="form-control"/>
          </div>
        <button class="btn btn-lg btn-primary" :disabled="working">{{$t('register.send')}}</button>
      </form>
    </div>
</template>

<script>
export default {
  name: 'new_team_page',
  props: {
    visible: Boolean
  },
  data() {
    return {
      team_name: '',
      working: false
    }
  },
  methods: {
    submit() {
      this.$store.dispatch('user/createTeam', this.team_name)
    }
  }
}
</script>

<style>
.dialog-footer {
  padding: 15px;
  padding-top: 10px;
  text-align: right;
  box-sizing: border-box;
}
</style>
