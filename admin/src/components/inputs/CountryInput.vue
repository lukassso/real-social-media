<template>
  <span class="country-input"  @click="showCountryMenu">
    <div class="" ref="country"

         :class="{
           'is-invalid': invalid || (required && empty) ,
           'is-dirty' : !empty
         }">
      <span class="title">{{ label }}</span>
      <span class="value form-control">
        <span v-if="!empty" class="countryFlag flag-icon" :class="'flag-icon-'+(liveValue.toLowerCase())"></span>
        {{ name }} &nbsp;
      </span>
    </div>
    <span class="more">▾</span>
  </span>

</template>

<script>
  import api from "api"
  import countries from "@/../../data/countries"
  import overlayModel from "../utils/overlayModel.js"
  import CountryPicker from "./CountryPicker.vue"

  require("flag-icon-css/css/flag-icon.css")

  export default {
    name: 'Country',
    props: {
      value: {
      },
      required: {
        type: Boolean,
        required: true
      },
      label: {
        type: String
      },
      invalid: {
        type: Boolean
      }
    },
    data () {
      return {
        liveValue: this.value,
        overlayStackId: null,
        lastCloseTime: 0
      }
    },
    reactive: {
      geoIpIsoCode: ["geo", "country"]
    },
    computed: {
      empty() {
        if(!this.liveValue) return true
        if(this.liveValue.trim().length == 0) return true
        return false
      },
      name() {
        if(this.empty) return ""
        let country = countries.filter(c => c.code == this.liveValue)[0]
        if(!country) return "Unknown"
        return country.name
      }
    },
    watch: {
      geoIpIsoCode(iso) {
        if(iso == 'unknown') {
          let langCountries = navigator.languages.map(l=>l.split('-')).reduce((a,b)=>a.concat(b))
              .map(l => countries.find(c=>c.code==l.toUpperCase())).filter(c=>!!c)
          if(langCountries.length > 0) {
            iso = langCountries[0].code
          } else {
            iso = null
          }
        }
        if(!this.isoCode) {
          this.isoCode = iso
          let country = countries.find(country=> country.code == iso)
          this.country = country && country.dial_code
        }
      },
      liveValue(value) {
        this.$emit('input', value)
      }
    },
    updated () {
    },
    created() {
    },
    mounted() {
    },
    methods: {
      showCountryMenu() {
        if(this.overlayStackId === null &&  Date.now() - this.lastCloseTime > 230) {
          this.overlayStackId = overlayModel.show({
            component: CountryPicker,
            props: {
              anchor: overlayModel.elementAnchor(this.$refs.country)
            },
            on: {
              selected: (code) => {
                console.log("SELECTED COUNTRY", code)
                this.liveValue = code
              }
            }
          })
        } else {
          overlayModel.close(this.overlayStackId)
          this.overlayStackId = null
          this.lastCloseTime = Date.now()
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .countryFlag {
    width: 1.333em;
    height: 1em;
    top: -2px;
  }
  .overlayAnchor {
    display: block !important;
  }

  .country-input .more {
    position: absolute;
    right: 23px;
    top: 8px;
  }


  .title {
    margin-bottom: 10px;
  }
</style>
