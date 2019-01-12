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
          <locations-page v-on:new-location="activePage='new-location'" v-on:edit-location="editLocation" v-if="activePage == 'locations'"></locations-page>
          <new-location-page v-on:done="activePage='locations'" v-if="activePage == 'new-location'"></new-location-page>
          <edit-location-page v-on:done="activePage='locations'" :fullsecretid="fullsid" v-if="activePage == 'edit-location'"></edit-location-page>
          <notes-page v-on:new-note="activePage='new-note'" v-on:edit-note="editNote" v-if="activePage == 'notes'"></notes-page>
          <new-note-page v-on:done="activePage='notes'" v-if="activePage == 'new-note'"></new-note-page>
          <edit-note-page v-on:done="activePage='notes'" :fullsecretid="fullsid" v-if="activePage == 'edit-note'"></edit-note-page>
        </main>
      </div>
    </div>
</template>

<script>
import LocationsPage from './data/locations-page'
import NewLocationPage from './data/new-location-page'
import EditLocationPage from './data/edit-location-page'
import NotesPage from './data/notes-page'
import NewNotePage from './data/new-note-page'
import EditNotePage from './data/edit-note-page'

export default {
  name: 'data-content',
  components: { LocationsPage, NewLocationPage, EditLocationPage, NotesPage, NewNotePage, EditNotePage },
  data() {
    return {
      activePage: 'locations',
      fullsid: ''
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
    },
    editLocation(fullsid) {
      this.activePage = 'edit-location'
      this.fullsid = fullsid
    },
    editNote(fullsid) {
      this.activePage = 'edit-note'
      this.fullsid = fullsid
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
