<template>
  <div>
    <div class="header px-3 py-3 pt-md-5 pb-md-4 d-flex justify-content-between">
      <h3 class="display-9">User's information</h3>
    </div>
    <div class="card">
      <div class="card-body">
        <h6 class="card-title">Name</h6>
        <p class="ml-2">{{ $store.state.user.fullname }} ({{ $store.state.user.id }})</p>
        <h6 class="card-title">Email</h6>
        <p class="ml-2">{{ $store.state.user.email }}</p>
      </div>
    </div>

    <div class="card mt-2">
      <div class="card-body">
        <h6 class="card-title">Change email</h6>
        <form>
          <div class="form-group">
            <label for="email1">New email address</label>
            <input type="email" class="form-control" v-model="newEmail" id="email1" placeholder="Enter new email" />
          </div>
          <button type="submit" class="btn btn-primary float-right" @click="requestEmailChange">Submit</button>
        </form>
      </div>
    </div>

    <div class="card mt-2">
      <div class="card-body">
        <h6 class="card-title">Change Password</h6>
        <form>
          <div class="form-group">
            <label for="pass1">New password</label>
            <input type="password" class="form-control" :class="{ 'is-invalid': passChecked && !isPassOk }" v-model="newPass" id="pass1" />
          </div>
          <div class="form-group">
            <label for="pass2">Repeat password</label>
            <input type="password" class="form-control" :class="{ 'is-invalid': passChecked && !isPassRepeatOk }" v-model="newPass2" id="pass2" />
          </div>
          <button type="submit" v-if="!passWorking" class="btn btn-primary float-right" @click="requestPasswordChange">Submit</button>
          <button type="submit" v-if="passWorking" disabled class="btn btn-primary float-right">Working...</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user-info',
  data() {
    return {
      newEmail: '',
      newPass: '',
      newPass2: '',
      passChecked: false,
      passWorking: false,
      emailWorking: false
    }
  },
  computed: {
    isPassOk() {
      return this.newPass.length > 0
    },
    isPassRepeatOk() {
      return this.newPass === this.newPass2
    }
  },
  methods: {
    requestEmailChange() {
      this.$store.dispatch('user/changeEmail', this.newEmail)
    },
    requestPasswordChange() {
      this.passChecked = true
      this.passWorking = true
      if (this.isPassOk && this.isPassRepeatOk) {
        this.$store.dispatch('user/changePassword', this.newPass).then(ok => {
          this.passWorking = false
        })
      }
    }
  }
}
</script>

<style></style>
