<template>
  <span class="phone-input">
    <div class="prefix form-control" @click="showPrefixMenu" ref="prefix"
         :class="{'is-invalid': prefixInvalid }" >
      <span class="value">{{ prefix.length > 0 ? prefix : "+??" }}</span>
      <span class="more">
        <span>▾</span>
      </span>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield mdl-textfield--floating-label number">
     <b-form-input class="" type="text" id="number" v-model="number"
                   required ref="number" pattern="[0-9 #+-]{3,}">
     </b-form-input>
    </div>
  </span>
</template>

<script>
  import api from "api"
  import countries from "@/../../data/countries"
  import overlayModel from "../utils/overlayModel.js"
  import PhonePrefixPicker from "./PhonePrefixPicker.vue"

  require("flag-icon-css/css/flag-icon.css")

  export default {
    name: 'phone-input',
    props: {
      value: {
      },
      required: {
        type: Boolean,
        default: false
      },
      invalid: {
        type: Boolean
      }
    },
    data () {
      let sep = this.value.indexOf(' ')
      let empty = sep == -1
      let prefix = empty ? "" : this.value.slice(0, sep)
      let number = empty ? "" : this.value.slice(sep+1)
      let country = countries.filter(c=>c.dial_code==prefix)[0]
      return {
        prefix, number,
        isoCode: country ? country.isoCode : null,
        overlayStackId: null,
        lastCloseTime: 0
      }
    },
    reactive: {
      geoIpIsoCode: ["geo", "country"]
    },
    computed: {
      liveValue() {
        return (this. prefix + " " + this.number).trim()
      },
      prefixInvalid() {
        return this.invalid && this.prefix.trim().length==0
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
          this.prefix = country && country.dial_code
        }
      },
      liveValue(value) {
        this.$emit('input', value)
      },
      invalid(v) {
        if(!v) return
        if(!this.number.match(/^[0-9 #+-]{3,}$/)) {
          this.$refs.number.parentElement.setAttribute('class',
            this.$refs.number.parentElement.getAttribute('class')+' is-invalid')
        }
      }
    },
    updated () {
      // componentHandler.upgradeAllRegistered()
    },
    created() {
    },
    mounted() {
      // componentHandler.upgradeAllRegistered()
    },
    methods: {
      showPrefixMenu() {
        if(this.overlayStackId === null &&  Date.now() - this.lastCloseTime > 230) {
          this.overlayStackId = overlayModel.show({
            component: PhonePrefixPicker,
            props: {
              anchor: overlayModel.elementAnchor(this.$refs.prefix)
            },
            on: {
              selected: (code) => this.prefix = code
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

  .phone-input {
    display: flex;
    position: relative;
    flex-wrap: nowrap;
    align-content: center;
  }

  .prefix {
    width: 60px;
    border-bottom: 1px solid rgba(0,0,0,.12);
    position: relative;
    top: 0px;
    padding: 5px 2px 5px 5px;
    cursor: default;
    vertical-align: baseline;
  }
  .prefix.is-invalid {
    border-bottom: 1px solid #d50000;
  }
  .prefix .more {
    float: right;
    cursor: default;
  }

  .number {
    width: calc(100% - 74px);
    margin-left: 10px;
  }



</style>
