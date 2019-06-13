<template>
  <div class="select-picker">
    <overlay-anchor :anchor="anchor" class="card card-inverse" :directions="directions" @positioned="updatePosition">
      <div class="select-box card card-inverse card-success mb-3" ef="box"
           :style="{
             'max-width': (windowDimmensions.width- position.x - 20)+'px',
             'max-height': (windowDimmensions.height- position.y - 20)+'px'
           }">
        <div class="search-panel">
          <b-form-input v-model="search" placeholder="Select search"></b-form-input>
        </div>
        <div class="countries">
          <div class="select" v-for="select in filteredOptions" @click="selectSelected(select)">
            <span class="selectName">{{ select.name || select }}</span>
          </div>
        </div>
      </div>
    </overlay-anchor>
  </div>
</template>

<script>
  import Vue from "vue"
  import { OverlayAnchor, windowDimmensions } from "../utils/overlayLayer"

  export default {
    name: 'SingleSelectWithSearchPicker',
    props: {
      anchor: {
      },
      options: {
        type: Array
      }
    },
    components: { OverlayAnchor },
    data () {
      return {
        directions: [{ x:1, y:1, ax: -1, ay: 1}, { x:1, y:-1, ax: -1, ay: -1 }],
        position: { x:0, y:0 },
        search: ""
      }
    },
    computed: {
      windowDimmensions() { return windowDimmensions },
      countries() { return countries },
      filteredOptions() {
        let query = this.search.toLowerCase().trim()
        if(query.length == 0) return this.options
        return this.options.filter(option => {
          let name = option.name || option
          if(name.toLowerCase().indexOf(query) != -1) return true
          return false
        })
      }
    },
    methods: {
      updatePosition(position) {
        this.position = position
      },
      focusSearch() {
        if(this.$refs.search) {
          //this.$refs.search.parentNode.classList.add('is-dirty');
          this.$refs.search.focus()
          this.$refs.search.select()
        }
        if(document.activeElement != this.$refs.search) {
          setTimeout(() => this.focusSearch(), 50)
        }
      },
      selectSelected(select) {
        this.$emit("selected", select)
        this.$emit("close")
      }
    },
    mounted() {
      setTimeout(()=>this.focusSearch(), 50)
    }
  }

</script>

<style scoped>
  .select-box {
    display: block;
    height: 400px;
    width: 600px;
  }
  .search-panel {
    height: 40px;
  }
  .search {
    position: relative;
    width: 100%;
  }
  .countries {
    margin-right: 0;
    width: 100%;
    box-sizing: border-box;
    border-top: 1px solid rgba(0,0,0,0.2);
    max-height: calc(100% - 40px);
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .select {
    display: flex;
    flex-direction: row;
    min-width: 270px;
    max-width: 270px;
    padding-top: 2px;
    padding-bottom: 2px;
    align-items: center;
    cursor: default;
  }
  .select:hover {
    background: rgba(0,0,0, 0.05);
  }
  .selectName {
    margin-left: 1em;
  }
  .overlayAnchor {
    display: block !important;
  }
</style>
