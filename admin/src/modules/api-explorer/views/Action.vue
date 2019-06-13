<template>
  <div>
    <b-breadcrumb :items="path"/>

    <div v-if="definition">
      <parameters-input
          :parametersDefinition="definition.properties"
          :serviceDefinition="service"
          v-model="properties"
          @all="v => allProperties = v">
      </parameters-input>

      <br>
      <h5 v-if="allProperties">Enter all parameters to be able to run this action.</h5>
      <div v-if="allProperties && !running">
        Run action with parameters<pre>{{ JSON.stringify(properties, null , "  ") }}</pre>
        <button type="button" class="btn btn-primary" @click="runAction">Do {{ actionName }}</button>
      </div>
      <div v-if="running">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Running action...</span>
        </div>
        <p>Waiting for server reply...</p>
      </div>
      <div v-if="error">
        <div class="card border-danger">
          <div class="card-header text-danger">Action encountered error</div>
          <div class="card-body" v-if="!error.message">
            <pre>{{ JSON.stringify(error, null, "  ") }}</pre>
          </div>
          <div class="card-body text-danger" v-if="error.message">
            {{ error.message }}
          </div>
          <div class="card-body text-danger" v-if="error.stack">
            <pre>{{ error.stack }}</pre>
          </div>
        </div>
      </div>
      <div v-if="result">
        <div class="card border-success">
          <div class="card-header text-success">Action executed successfully</div>
          <div class="card-body">
            <pre>{{ JSON.stringify(result, null, "  ") }}</pre>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!definition">
      Loading...
    </div>
  </div>
</template>

<script>
  import api from "@/api"

  import ParametersInput from "@/modules/api-explorer/components/ParametersInput.vue";

  export default {
    name: "Action",
    props: ['serviceName', 'actionName'],
    components: { ParametersInput },
    data() {
      return {
        properties: null,
        allProperties: false,
        running: false,
        result: null,
        error: null
      }
    },
    reactive: {
      serviceDefinitions: ['metadata', 'serviceDefinitions']
    },
    computed: {
      path() {
        return [
          { text: this.serviceName,
            to: { name: 'service', params: { serviceName: this.serviceName } }
          },
          { text: 'actions',
            active: true
          },
          { text: this.actionName,
            active: true
          }
        ]
      },
      service() {
        if(!this.serviceDefinitions) return null
        for(let service of this.serviceDefinitions) {
          if(service.name == this.serviceName) return service
        }
      },
      definition() {
        if(!this.service) return null
        return this.service.actions[this.actionName]
      }
    },
    methods: {
      runAction() {
        this.running = true
        this.result = null
        this.error = null
        if(!this.allProperties) return; // should never be clicked

        console.log("RUN ACTION!!")
        api.request([this.serviceName, this.actionName], this.properties).then(
            result => {
              this.running = false
              this.result = result
            }
        ).catch(
            error => {
              this.running = false
              this.error = error
            }
        )
      }
    }
  }
</script>

<style scoped>
</style>