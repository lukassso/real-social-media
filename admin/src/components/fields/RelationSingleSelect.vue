<template>
  <FieldTemplate :errorText="errorText" :error="error" :label="label || name" :name="name">
    <span class="relation-input"  @click="showMenu">
      <div ref="relation">
        <span class="title">{{ label }}</span>
        <span class="value form-control">
          {{ displayName }} &nbsp;
        </span>
      </div>
      <span class="more">▾</span>
    </span>
  </FieldTemplate>
</template>

<script>

  import FieldTemplate from "./FieldTemplate.vue"
  import overlayModel from "@/components/utils/overlayModel.js"
  import ObjectPicker from "./ObjectPicker.vue"


  /// TODO: display name instead of id

  export default {
    name: "RelationSingleSelect",
    components: { FieldTemplate },
    inject: ['form'],
    props: {
      name: {
        type: String,
        required: true
      },
      label: {
        type: String,
      },
      errorText: {
        type: Object
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        definition: null,
        value: null,
        error: null,
        overlayStackId: null,
        lastCloseTime: 0
      }
    },
    reactive: {
      object() {
        if(!this.view) return null
        if(!this.value) return null
        let idObj = {}
        const model = this.model
        idObj[model.slice(0,1).toLowerCase()+model.slice(1)] = this.value
        return [this.service, this.view, idObj]
      }
    },
    computed: {
      service() {
        if(!this.definition) return null
        const sp = this.definition.type.split(':')
        if(sp.length>1) return sp[0]
        return this.form.service
      },
      model() {
        if(!this.definition) return null
        const sp = this.definition.type.split(':')
        if(sp.length>1) return sp[1]
        return this.definition.type
      },
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
        return (this.modelDefinition.crud.prefix || "") + this.model + "One"
      },
      definitionNotFound() {
        return api.metadata.serviceDefinitions && !(this.modelDefinition && this.viewDefinition)
      },
      loadingError() {
        if(this.dataError) return this.dataError
        return this.definitionNotFound ? "notFound" : this.serviceDefinitionsError
      },
      displayName() {
        if(!this.object) return this.value
        if(this.modelDefinition.display) {
          return this.modelDefinition.display.map(propName => this.object[propName]).join(' ')
        }
        return this.object.id
      }
    },
    methods: {
      showMenu() {
        if(this.overlayStackId === null &&  Date.now() - this.lastCloseTime > 230) {
          this.overlayStackId = overlayModel.show({
            component: ObjectPicker,
            props: {
              anchor: overlayModel.elementAnchor(this.$refs.relation),
              service: this.service,
              model: this.model,
              definition: this.definition
            },
            on: {
              selected: (objectId) => {
                console.log("SELECTED", objectId)
                this.form.setFieldValue(this.name, objectId)
              }
            }
          })
        } else {
          overlayModel.close(this.overlayStackId)
          this.overlayStackId = null
          this.lastCloseTime = Date.now()
        }
      },

    },
    created() {
      this.definition = this.form.getFieldDefinition(this.name)
      this.valueObserver = (v) => {
        this.connected = false
        this.value = v
        this.connected = true
      }
      this.errorObserver = (e) => {
        this.connected = false
        this.error = e
        this.connected = true
      }
      this.form.observe(this.name, this.valueObserver)
      this.form.observeError(this.name, this.errorObserver)
      this.connected = true
    },
    beforeDestroy() {
      this.form.unobserve(this.name, this.valueObserver)
      this.form.unobserveError(this.name, this.errorObserver)
      this.connected = false
    }
  }
</script>

<style scoped>
  .relation-input .more {
    position: absolute;
    right: 23px;
    top: 8px;
  }

  .title {
    margin-bottom: 10px;
  }
</style>