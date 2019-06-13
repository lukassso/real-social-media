<template>
  <div>
    <loading :what="allLoaded" :error="loadingError" :name="`create object ${service}/${model}`">
      <working-zone>
        <div>
          <h1>Create {{ model }}</h1>
          <command-form :service="service" :action="action" :key="service+':'+action" @done="handleCreated">
            <div v-for="field in fields">
              <component :is="editorComponent(field)" :name="field"></component>
            </div>
            <br />
            <b-button type="submit">Create {{ model }}</b-button>
          </command-form>
        </div>
        <div v-if="state == 'error'">
          <slot name="error">
            <b-alert show variant="danger">{{ error }}</b-alert>
          </slot>
        </div>
        <div v-if="state == 'done'">
          <slot name="done">
            <b-alert show variant="success">{{ model }} created, id: {{ createdId }}</b-alert>
            <router-link :to="{ name: 'crud:view', params: { service, model, id: createdId } }">View {{ model }}</router-link>
            <br>
            <router-link :to="{ name: 'crud:edit', params: { service, model, id: createdId } }">Edit {{ model }}</router-link>
          </slot>
        </div>
      </working-zone>
    </loading>
  </div>
</template>

<script>
  import api from "@/api"

  export default {
    name: "CreateObject",
    props: {
      service: {
        type: String,
        required: true
      },
      model: {
        type: String,
        required: true
      }
    },
    inject: ['loadingZone', 'workingZone'],
    data() {
      return {
        state: "ready",
        createdId: null
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
      actionDefinition() {
        return this.serviceDefinition
            && this.serviceDefinition.actions[this.action]
      },
      allLoaded() {
        return this.actionDefinition && this.modelDefinition
      },
      action() {
        if(!this.modelDefinition) return null
        return (this.modelDefinition.crud.prefix || "") + this.model + "Create"
      },
      definitionNotFound() {
        return api.metadata.serviceDefinitions && !(this.modelDefinition && this.actionDefinition)
      },
      loadingError() {
        return this.definitionNotFound ? "notFound" : this.serviceDefinitionsError
      },
      fields() {
        return this.actionDefinition && Object.keys(this.actionDefinition.properties)
      }
    },
    methods: {
      editorComponent(fieldName) {
        let fieldDefinition = this.actionDefinition.properties[fieldName]
        return this.$editors.byDefinition(fieldDefinition)
      },
      handleCreated({ result }) {
        this.createdId = result
        this.state = 'done'
      }
    }
  }
</script>

<style scoped>

</style>