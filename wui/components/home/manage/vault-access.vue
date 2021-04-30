<template>
  <div class="card">
    <div class="card-header">
      Vault {{ vault.id }}
      <i class="material-icons float-right" @click="toggleVault" v-if="!showVault">expand_more</i>
      <i class="material-icons float-right" @click="toggleVault" v-if="showVault">expand_less</i>
    </div>
    <div class="card-body" v-if="showVault">
      <h5 class="card-title">Access</h5>
      <div class="card-deck text-left">
        <div class="card box-shadow">
          <div class="card-header">Allowed</div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item" v-for="user in allowedUsers" :key="user.id">
                <i class="material-icons" v-if="!user.admin" @click="startRevoke(user)">arrow_forward_ios</i>
                <i class="material-icons" v-if="user.admin">grade</i>
                {{ user.label }}
              </li>
            </ul>
          </div>
          <div class="card-footer" v-if="showConfirmRevoke">
            <div class="confirm">Revoke access to {{ userToRevoke.label }}?</div>
            <button type="button" @click="cancelRevoke" class="btn btn-secondary btn-danger">No</button>
            <button type="button" @click="confirmRevoke" class="btn btn-secondary btn-success float-right">Yes</button>
          </div>
        </div>
        <div class="card box-shadow">
          <div class="card-header">Denied</div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item" v-for="user in deniedUsers" :key="user.id">
                <i class="material-icons" @click="startGrant(user)">arrow_back_ios</i>
                {{ user.label }}
              </li>
            </ul>
          </div>
          <div class="card-footer" v-if="showConfirmGrant">
            <div class="confirm">Grant access to {{ userToGrant.label }}?</div>
            <button type="button" @click="cancelGrant" class="btn btn-secondary btn-danger">No</button>
            <button type="button" @click="confirmGrant" class="btn btn-secondary btn-success float-right">Yes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vault-access',
  props: {
    vault: Object,
    tid: String
  },
  data() {
    return {
      showVault: false,
      showConfirmGrant: false,
      showConfirmRevoke: false,
      userToGrant: {},
      userToRevoke: {}
    }
  },
  computed: {
    allowedUsers() {
      var vaultUsers = this.vault.users
      return this.$store.getters[`team.${this.tid}/users`].filter((u) => {
        for (var i = 0; i < vaultUsers.length; i++) {
          if (vaultUsers[i] === u.id) {
            return true
          }
        }
        return false
      })
    },
    deniedUsers() {
      var vaultUsers = this.vault.users
      return this.$store.getters[`team.${this.tid}/users`].filter((u) => {
        for (var i = 0; i < vaultUsers.length; i++) {
          if (vaultUsers[i] === u.id) {
            return false
          }
        }
        return true
      })
    }
  },
  methods: {
    toggleVault() {
      this.showVault = !this.showVault
    },
    startRevoke(user) {
      this.showConfirmRevoke = true
      this.userToRevoke = user
    },
    startGrant(user) {
      this.showConfirmGrant = true
      this.userToGrant = user
    },
    cancelRevoke() {
      this.showConfirmRevoke = false
      this.userToRevoke = {}
    },
    cancelGrant() {
      this.showConfirmGrant = false
      this.userToGrant = {}
    },
    confirmRevoke() {
      this.$store.dispatch(`team.${this.tid}/removeUsersFromVault`, { vaultId: this.vault.id, users: [this.userToRevoke.data] })
      this.cancelRevoke()
    },
    confirmGrant() {
      this.$store.dispatch(`team.${this.tid}/addUsersToVault`, { vaultId: this.vault.id, users: [this.userToGrant.data] })
      this.cancelGrant()
    }
  }
}
</script>
