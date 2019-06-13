<template>
  <div>
    <loading :what="allLoaded" :error="loadingError" :name="`objects list ${service}/${model}`">
      <h1> {{ model }}s</h1>
      <p>
        <b-button :to="{ name: 'crud:create', params: { service, model } }" variant="primary">
          Create {{ model }}
        </b-button>
        <br>
      </p>
      <b-card v-for="obj in data" :key="obj.id">
        <b-card-body>
          <pre>{{ obj }}</pre>
        </b-card-body>
        <b-button :to="{ name: 'crud:view', params: { service, model, id: obj.id } }" variant="primary">
          View {{ model }}
        </b-button>&nbsp;
        <b-button :to="{ name: 'crud:edit', params: { service, model, id: obj.id } }" variant="primary">
          Edit {{ model }}
        </b-button>&nbsp;
        <b-button @click="remove(obj.id)" variant="primary">
          Delete {{ model }}
        </b-button>
      </b-card>
    </loading>
  </div>
</template>

<script>
  import api from "@/api"
  import ConfirmDialog from "@/components/ConfirmDialog.vue"
  import overlayModel from "@/components/utils/overlayModel.js"

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
      }
    },
    inject: ['workingZone'],
    reactive: {
      data() {
        if(!this.view) return null
        let idObj = {}
        const model = this.model
        idObj[model.slice(0,1).toLowerCase()+model.slice(1)] = this.id
        return [this.service, this.view, idObj]
      }
    },
    data() {
      return {

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
        console.log("ALL LOADED?", JSON.stringify([
          !!this.viewDefinition, !!this.modelDefinition, !!this.data,
          !!this.viewDefinition && !!this.modelDefinition && !!this.data
        ]))
        return !!this.viewDefinition && !!this.modelDefinition && !!this.data
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
      remove(id) {
        overlayModel.show({
          component: ConfirmDialog,
          props: {
            title: `Remove ${this.model}`,
            text: `Do you really want to remove ${this.model} with id ${id} ?`
          },
          on: {
            yes: () => {
              let idObj = {}
              const model = this.model
              idObj[model.slice(0,1).toLowerCase()+model.slice(1)] = id
              this.workingZone.addPromise(`remove ${this.model} ${id}`,
                  api.request([this.service, (this.modelDefinition.crud.prefix || "") + this.model + "Delete"], idObj)
              )
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>