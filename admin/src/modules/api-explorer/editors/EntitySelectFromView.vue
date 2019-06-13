<template>
  <div>
    <parameters-input
        :parametersDefinition="viewDefinition.properties"
        :serviceDefinition="serviceDefinition"
        v-model="properties"
        @all="a => allProperties = a">
    </parameters-input>
    <h6 v-if="!allProperties">Enter all parameters to load view.</h6>
    <div v-if="allProperties">
      <div v-if="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only"></span>
        </div>
        <p>Loading...</p>
      </div>
      <div v-if="result">
        <b-row v-for="position in result" :key="position.id" :class="{ selected: position.id == value } ">
          <label class="col-sm-10 form-label" :for="`${id}_${position.id}`">
            <pre>{{ JSON.stringify(position, null, "  ") }}</pre>
          </label>
          <b-col sm="2">
            <button
                type="button"
                class="btn" :id="`${id}_${position.id}`"
                :class="{ 'btn-outline-primary': position.id != value, 'btn-primary': position.id == value }"
                @click="()=>$emit('input', position.id)">
              Select
            </button>
          </b-col>
        </b-row>
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
</template>

<script>

  import api from "@/api"

  export default {
    name: "EntitySelectFromView",
    props: ["viewDefinition", "type", "value", "serviceDefinition"],
    data() {
      return {
        properties: null,
        allProperties: false,
        result: false,
        error: false
      }
    },
    computed: {
      loadProperties() {
        if(!this.serviceDefinition) return null
        if(!this.allProperties) return null
        return this.properties
      },
      loading() {
        return this.loadProperties && (!this.result) && (!this.error)
      },
      id () {
        return ''+this._uid
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

        this.observable =  api.observable([this.serviceDefinition.name, this.viewDefinition.name, props])
        this.observable.bindProperty(this, 'result')
        this.observable.bindErrorProperty(this, 'error')
      }
    }
  }

</script>

<style scoped>

  label {
    text-align: left;
  }

  button {
    vertical-align: middle;
  }
  label {
    vertical-align: middle;
  }

</style>