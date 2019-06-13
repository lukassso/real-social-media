<template>
  <div>
    <b-breadcrumb :items="path"/>
    <div v-if="definition">
      <parameters-input
          :parametersDefinition="definition.properties"
          :serviceDefinition="service"
          v-model="properties"
          @all="a => allProperties = a"></parameters-input>

      <h5 v-if="!allProperties">Enter all parameters to load view.</h5>
      <div v-if="allProperties">
        Load view with parameters<pre>{{ JSON.stringify(properties, null , "  ") }}</pre>

        <div v-if="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only"></span>
          </div>
          <p>Loading view...</p>
        </div>
        <div v-if="result">
          <div class="card border-success">
            <div class="card-header text-success">View loaded successfully</div>
            <div class="card-body">
              <pre>{{ JSON.stringify(result, null, "  ") }}</pre>
            </div>
          </div>
        </div>
        <div v-if="error">
          <div class="card border-danger">
            <div class="card-header text-danger">View load error</div>
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
      </div>
    </div>
    <div v-if="!definition">
      Loading Definition...
    </div>
  </div>
</template>

<script>
  import ParametersInput from "@/modules/api-explorer/components/ParametersInput.vue"
  import api from "@/api"

  export default {
    name: "ViewPage",
    props: ['serviceName', 'viewName'],
    reactive: {
      serviceDefinitions: ['metadata', 'serviceDefinitions']
    },
    data() {
      return {
        properties: null,
        allProperties: false,
        result: null,
        error: null
      }
    },
    computed: {
      path() {
        return [
          { text: this.serviceName,
            to: { name: 'service', params: { serviceName: this.serviceName } }
          },
          { text: 'views',
            active: true
          },
          { text: this.viewName,
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
        return this.service.views[this.viewName]
      },
      loadProperties() {
        if(!this.service) return null
        if(!this.allProperties) return null
        return this.properties
      },
      loading() {
        return this.loadProperties && (!this.result) && (!this.error)
      }
    },
    watch: {
      error(e) {
        console.trace("ERROR", e)
      },
      loadProperties(props) {
        if(this.observable) {
          this.observable.unbindProperty(this, 'result')
          this.observable.unbindErrorProperty(this, 'error')
          this.observable = null
          this.result = null
          this.error = null
        }
        if(!props) return

        this.observable =  api.observable([this.serviceName, this.viewName, props])
        this.observable.bindProperty(this, 'result')
        this.observable.bindErrorProperty(this, 'error')
      }
    }
  }
</script>

<style scoped>

</style>