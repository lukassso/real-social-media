<template>
  <span class="select-input"  @click="showSelectMenu">
    <div class="" ref="select">
      <span class="title">{{ label }}</span>
      <span class="value form-control">
        {{ value }} &nbsp;
      </span>
    </div>
    <span class="more">▾</span>
  </span>

</template>

<script>
  import overlayModel from "../utils/overlayModel.js"
  import SingleSelectWithSearchPicker from "./SingleSelectWithSearchPicker.vue"

  require("flag-icon-css/css/flag-icon.css")

  export default {
    name: 'SingleSelectWithSearch',
    props: {
      value: {
      },
      label: {
        type: String
      },
      options: {
        type: Array
      }
    },
    data () {
      return {
        liveValue: this.value,
        overlayStackId: null,
        lastCloseTime: 0
      }
    },
    computed: {
      empty() {
        if(!this.liveValue) return true
        if(this.liveValue.trim().length == 0) return true
        return false
      }
    },
    watch: {
    },
    updated () {
    },
    created() {
    },
    mounted() {
    },
    methods: {
      showSelectMenu() {
        if(this.overlayStackId === null &&  Date.now() - this.lastCloseTime > 230) {
          this.overlayStackId = overlayModel.show({
            component: SingleSelectWithSearchPicker,
            props: {
              anchor: overlayModel.elementAnchor(this.$refs.select),
              options: this.options
            },
            on: {
              selected: (value) => {
                console.log("SELECTED", value)
                this.$emit('input', value)
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

  .selectFlag {
    width: 1.333em;
    height: 1em;
    top: -2px;
  }
  .overlayAnchor {
    display: block !important;
  }

  .select-input .more {
    position: absolute;
    right: 23px;
    top: 8px;
  }


  .title {
    margin-bottom: 10px;
  }
</style>
