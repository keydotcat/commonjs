<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item url-group-item" :class="{ 'px-0': isEditing(idlabel) }" v-for="(label, idlabel) in inner">
      <span v-if="!isEditing(idlabel)" class="d-flex" @click="edit(idlabel)">
        <i class="material-icons text-muted mr-1" @click="edit(idlabel)">edit</i>
        {{ label }}
      </span>
      <div v-if="isEditing(idlabel)" class="input-group w-100 m-0">
        <input
          type="text"
          v-model="editing[idlabel]"
          v-on:keyup.enter="save(idlabel)"
          v-on:keyup.escape="cancel(idlabel)"
          class="form-control"
          :placeholder="name"
          aria-label="name"
        />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary d-flex" type="button" @click="remove(idlabel)">
            <i class="material-icons" aria-hidden="true">delete</i>
          </button>
        </div>
      </div>
    </li>
    <li class="list-group-item url-group-item" v-if="showNew">
      <div class="input-group w-100">
        <input type="text" v-model="newEntry" class="form-control" :placeholder="name" aria-label="name" />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="cancelAdd">Cancel</button>
          <button class="btn btn-outline-secondary" type="button" @click="addEntry">Add</button>
        </div>
      </div>
    </li>
    <li class="list-group-item url-group-item d-flex" @click="showNew = true"><i class="material-icons mr-1 text-muted">add_box</i> Add new {{ name }}</li>
  </ul>
</template>

<script>
export default {
  name: 'text-list-editor',
  model: {
    prop: 'list',
    event: 'change'
  },
  props: {
    list: Array,
    name: String
  },
  data() {
    //Make an editable copy of the text list
    var l = this.list.map((l) => {
      return l
    })
    return {
      inner: l,
      showNew: false,
      newEntry: '',
      editing: {}
    }
  },
  methods: {
    save(il) {
      this.inner[il] = this.editing[il]
      this.$delete(this.editing, il)
      this.$emit('change', this.inner)
    },
    cancel(il) {
      this.$delete(this.editing, il)
    },
    remove(il) {
      this.inner.splice(il, 1)
      this.$delete(this.editing, il)
      this.$emit('change', this.inner)
    },
    isEditing(il) {
      return il in this.editing
    },
    edit(il) {
      if (!(il in this.editing)) {
        this.$set(this.editing, il, this.inner[il])
      }
    },
    addEntry() {
      this.inner.push(this.newEntry)
      this.newEntry = ''
      this.showNew = false
      this.$emit('change', this.inner)
    },
    cancelAdd() {
      this.newEntry = ''
      this.showNew = false
    }
  }
}
</script>
