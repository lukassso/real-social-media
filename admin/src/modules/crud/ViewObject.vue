<template>
  <div>
    <loading :what="allLoaded" :error="loadingError" :name="`object ${service}/${model}/${id}`">
      <b-card>
        <b-card-title>
          {{ model }} id: {{ id }}
        </b-card-title>
        <b-card-body>
          <pre>{{ data }}</pre>
        </b-card-body>
        <b-button :to="{ name: 'crud:edit', params: { service, model, id } }" variant="primary">
          Edit {{ model }}
        </b-button>
      </b-card>
    </loading>
  </div>
</template>

<script>
  export default {
    name: "ViewObject",
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
    reactive: {
      data() {
        if(!this.view) return null
        let idObj = {}
        const model = this.model
        idObj[model.slice(0,1).toLowerCase()+model.slice(1)] = this.id
        return [this.service, this.view, idObj]
      }
    },
    computed: {
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
        return !!this.viewDefinition && !!this.modelDefinition && !!this.data
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
      }
    }
  }
</script>

<style scoped>

</style>