<template>
  <div class="phone-prefix-picker">
    <overlay-anchor :anchor="anchor" class="card card-inverse" :directions="directions" @positioned="updatePosition">
      <div class="prefix-box card card-inverse card-success mb-3" ef="box"
           :style="{
             'max-width': (windowDimmensions.width - position.x - 5)+'px',
             'max-height': (windowDimmensions.height - position.y - 5)+'px'
           }">
        <div class=" search-panel">
          <div class="search">
            <input class="" type="text" id="search" v-model="search" ref="search">
            <label class="" for="search">Country search</label>
          </div>
        </div>
        <div class="countries">
          <div class="country" v-for="country in filteredCountries" @click="countrySelected(country)">
            <span class="countryFlag flag-icon" :class="'flag-icon-'+(country.code.toLowerCase())"></span>
            <span class="countryPrefix">{{ country.dial_code }}</span>
            <span class="countryName">{{ country.name }}</span>
          </div>
        </div>
      </div>
    </overlay-anchor>
  </div>
</template>

<script>
  import Vue from "vue"
  import { OverlayAnchor, windowDimmensions } from "../utils/overlayLayer"
  import countries from "@/../../data/countries"

  export default {
    name: 'PhonePrefixPicker',
    props: ['anchor'],
    components: { OverlayAnchor },
    data () {
      return {
        directions: [{ x:1, y:1, ax: -1, ay: 1}, { x:1, y:-1, ax: -1, ay: -1}],
        position: {x:0, y:0},
        search: ""
      }
    },
    computed: {
      windowDimmensions() { return windowDimmensions },
      countries() { return countries },
      filteredCountries() {
        let query = this.search.toLowerCase().trim()
        if(query.length == 0) return this.countries
        return this.countries.filter(country => {
          if(country.name.toLowerCase().indexOf(query) != -1) return true
          if(country.code.toLowerCase().indexOf(query) != -1) return true
          if(country.dial_code.indexOf(query) != -1) return true
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
          // this.$refs.search.parentNode.classList.add('is-dirty');
          this.$refs.search.focus()
          this.$refs.search.select()
        }
        if(document.activeElement != this.$refs.search) {
          setTimeout(() => this.focusSearch(), 50)
        }
      },
      countrySelected(country) {
        this.$emit("selected", country.dial_code)
        this.$emit("close")
      }
    },
    mounted() {
      setTimeout(()=>this.focusSearch(), 50)
    }
  }

</script>

<style scoped>
  .prefix-box {
    display: block;
    height: 400px;
    width: 600px;
  }
  .mdl-card__supporting-text {
    padding-top: 0px;
    padding-bottom: 0px;
    position: relative;
  }
  .search-panel {
    height: 40px;
  }
  .search {
    position: relative;
    top: -15px;
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
  .country {
    display: flex;
    flex-direction: row;
    min-width: 270px;
    max-width: 270px;
    padding-top: 2px;
    padding-bottom: 2px;
    align-items: center;
    cursor: default;
  }
  .country:hover {
    background: rgba(0,0,0, 0.05);
  }
  .countryFlag {
    float: left;
    flex-shrink: 0;
    width: 2em;
    height: 1.5em;
  }
  .countryPrefix {
    margin-left: 1em;
    font-weight: bold;
    min-width: 3em;
  }
  .countryName {
    margin-left: 1em;
  }
  .overlayAnchor {
    display: block !important;
  }
</style>
