<template>
  <div class="object-picker">
    <overlay-anchor :anchor="anchor" class="card card-inverse" :directions="directions" @positioned="updatePosition">
      <div class="objects-box card card-inverse card-success mb-3" ef="box"
           :style="{
             'max-width': (windowDimmensions.width- position.x - 20)+'px',
             'max-height': (windowDimmensions.height- position.y - 20)+'px'
           }">
        <div class="objects">
          <loading-zone>
            <loading :what="allLoaded" :error="loadingError" :name="`objects list ${service}/${model}`">
            <div class="object" v-for="object in objects" @click="objectSelected(object)">
              <span class="countryName">{{ displayName(object) }}</span>
            </div>
            </loading>
          </loading-zone>
        </div>
      </div>
    </overlay-anchor>
  </div>
</template>

<script>
  import api from "@/api"
  import Vue from "vue"
  import { OverlayAnchor, windowDimmensions } from "@/components/utils/overlayLayer"


  export default {
    name: 'ObjectPicker',
    props: {
      anchor: {
        type: Object
      },
      service: {
        type: String
      },
      model: {
        type: String
      },
      definition: {
        type: Object
      }
    },
    components: { OverlayAnchor },
    reactive: {
      objects() {
        if(!this.view) return null
        let idObj = {}
        const model = this.model
        idObj[model.slice(0,1).toLowerCase()+model.slice(1)] = this.id
        return [this.service, this.view, idObj]
      }
    },
    data () {
      return {
        directions: [{ x:1, y:1, ax: -1, ay: 1}, { x:1, y:-1, ax: -1, ay: -1}],
        position: {x:0, y:0},
        search: ""
      }
    },
    computed: {
      windowDimmensions() { return windowDimmensions },
      serviceDefinitionsError() {
        return api.metadata.serviceDefinitionsError
      },
      serviceDefinition() {
        return api.metadata.serviceDefinitions
            && api.metadata.serviceDefinitions.find(service => service.name == this.service)
      },
      modelDefinition() {
        return this.serviceDefinition
            && this.serviceDefinition.models[this.model]
      },
      viewDefinition() {
        return this.serviceDefinition
            && this.serviceDefinition.views[this.view]
      },
      allLoaded() {
        console.log("ALL LOADED?", JSON.stringify([
          !!this.viewDefinition, !!this.modelDefinition, !!this.objects,
          !!this.viewDefinition && !!this.modelDefinition && !!this.objects
        ]))
        return !!this.viewDefinition && !!this.modelDefinition && !!this.objects
      },
      view() {
        if(!this.modelDefinition) return null
        return (this.modelDefinition.crud.prefix || "") + this.model + "All"
      },
      definitionNotFound() {
        return api.metadata.serviceDefinitions && !(this.modelDefinition && this.viewDefinition)
      },
      loadingError() {
        if(this.dataError) return this.dataError
        return this.definitionNotFound ? "notFound" : this.serviceDefinitionsError
      }
    },
    methods: {
      updatePosition(position) {
        this.position = position
      },
      objectSelected(object) {
        this.$emit("selected", object.id)
        this.$emit("close")
      },
      displayName(object) {
        if(this.modelDefinition.display) {
          return this.modelDefinition.display.map(propName => object[propName]).join(' ')
        }
        return object.id
      }
    }
  }

</script>

<style scoped>
  .objects-box {
    display: block;
    height: 400px;
    width: 600px;
  }
  .overlayAnchor {
    display: block !important;
  }
</style>
