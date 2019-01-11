<template>
  <div class="container-fluid">
      <div class="row">
        <nav class="col-2 col-xl-1 d-none d-md-block sidebar">
          <div class="sidebar-sticky">
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>
                <a :class="{'active': activePage == 'locations'}" href="#" @click="goto('locations')">Locations</a>
              </span>
            </h6>
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>
                <a :class="{'active': activePage == 'notes'}" href="#" @click="goto('notes')">Notes</a>
              </span>
            </h6>
          </div>
        </nav>

        <main role="main" class="col-10 col-xl-11 ml-sm-auto px-4">
          <locations-page v-if="activePage == 'locations'"></locations-page>
          <notes-page v-if="activePage == 'notes'"></notes-page>
        </main>
      </div>
    </div>
</template>

<script>
import LocationsPage from './data/locations-page'
import NotesPage from './data/notes-page'

export default {
  name: 'data-content',
  components: { LocationsPage, NotesPage },
  data() {
    return {
      activePage: 'locations'
    }
  },
  methods: {
    defaultPage() {
      if (this.activePage.length === 0) {
        this.goto('locations')
      }
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
