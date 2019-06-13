<template>
  <div>
    <loading :what="allLoaded" :error="loadingError" :name="`object ${service}/${model}/${id}`">
      <h1>{{ model }} id: {{ id }}</h1>
      <div v-if="updateConflict && state != 'working' && state != 'done'">
        <slot name="changeWarning">
          <b-alert show variant="warning">Someone edited this object while you are here.</b-alert>
        </slot>
      </div>
      <working-zone>
        <command-form :service="service" :action="action" :key="service+':'+action" @done="handleCreated"
          :initialValues="data" :parameters="idObj">
          <div v-for="field in fields">
            <component :is="editorComponent(field)" :name="field"></component>
          </div>
          <br />
          <b-button type="submit">Update {{ model }}</b-button>
        </command-form>
      </working-zone>
    </loading>
  </div>
</template>

<script>
  export default {
    name: "UpdateObject",
    props: {
      service: {
        type: String,
        required: true
      },
      model: {
        type: String,
        required: true
      },
      id: {
        type: String
      }
    },
    data() {
      return {
        state: 'ready',
        data: null, // frozen data
        updateConflict: false
      }
    },
    reactive: {
      reactiveData() {
        if(!this.view) return null

        return [this.service, this.view, this.idObj]
      }
    },
    watch: {
      reactiveData(d) {
        if(!this.data) { // first load
          if(d) this.data = d
        } else { // Change
          if(d) this.updateConflict = true
        }
      }
    },
    computed: {
      idObj() {
        let idObj = {}
        const model = this.model
        idObj[model.slice(0,1).toLowerCase()+model.slice(1)] = this.id
        return idObj
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
      action() {
        if(!this.modelDefinition) return null
        return (this.modelDefinition.crud.prefix || "") + this.model + "Update"
      },
      actionDefinition() {
        return this.serviceDefinition
            && this.serviceDefinition.actions[this.action]
      },
      allLoaded() {
        return !!this.viewDefinition && !!this.modelDefinition && !!this.actionDefinition && !!this.data
      },
      view() {
        if(!this.modelDefinition) return null
        return (this.modelDefinition.crud.prefix || "") + this.model + "One"
      },
      definitionNotFound() {
        return api.metadata.serviceDefinitions &&
            !(this.modelDefinition && this.viewDefinition && this.actionDefinition)
      },
      loadingError() {
        if(this.dataError) return this.dataError
        return this.definitionNotFound ? "notFound" : this.serviceDefinitionsError
      },
      fields() {
        if(!this.actionDefinition) return []
        let allFields = Object.keys(this.actionDefinition.properties)
        const model = this.model
        return allFields.filter(field => field != model.slice(0,1).toLowerCase()+model.slice(1))
      }
    },
    created() {
      if(this.reactiveData) this.data = this.reactiveData
    },
    mounted() {
      this.updateConflict = false
    },
    methods: {
      editorComponent(fieldName) {
        let fieldDefinition = this.actionDefinition.properties[fieldName]
        return this.$editors.byDefinition(fieldDefinition)
      },
      handleCreated({ result }) {
        this.state = 'done'
      }
    }
  }
</script>

<style scoped>

</style>