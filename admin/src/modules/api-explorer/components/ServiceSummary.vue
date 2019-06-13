<template>
  <div class="service-summary">
    <h2>
      <router-link :to="{ name: 'service', params: { serviceName: service.name }}">
        {{ service.name }}
      </router-link>
    </h2>
    <div>
      <div v-for="modelName in Object.keys(service.models)">
        <router-link :to="{ name: 'model', params: { serviceName: service.name, modelName }}">
          <v-icon name="database"/> &nbsp;{{ modelName }}
          <span class="args" v-if="Object.keys(service.models[modelName].properties).length">
              ( {{ Object.keys(service.models[modelName].properties).join(', ') }} )
            </span>
        </router-link>
      </div>
      <div v-for="viewName in Object.keys(service.views)">
        <router-link :to="{ name: 'view', params: { serviceName: service.name, viewName }}">
          <v-icon name="eye"/> &nbsp;{{ viewName }}
          <span class="args" v-if="Object.keys(service.views[viewName].properties).length">
              ( {{ Object.keys(service.views[viewName].properties).join(', ') }} )
            </span>
        </router-link>
      </div>
      <div v-for="actionName in Object.keys(service.actions)">
        <router-link :to="{ name: 'action', params: { serviceName: service.name, actionName }}">
          <v-icon name="cog"/> &nbsp;{{ actionName }}
          <span class="args" v-if="Object.keys(service.actions[actionName].properties).length">
              ( {{ Object.keys(service.actions[actionName].properties).join(', ') }}  )
            </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Service",
    props: ["service"]
  }
</script>

<style scoped>

  h2 a {
    font-size: 1.2em;
    color: #333;
  }
  a {
    font-size: 1.0em;
    color: #333;
  }
  a:hover {
    text-decoration: none;
    color: #333;
  }

</style>