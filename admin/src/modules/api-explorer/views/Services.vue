<template>

  <div class="services">
    <div class="service-holder" v-for="service in serviceDefinitions">
      <service-summary :service="service"></service-summary>
    </div>

    <pre>{{ JSON.stringify(serviceDefinitions, null, "  ") }}</pre>
  </div>

</template>

<script>

  import ServiceSummary from "@/modules/api-explorer/components/ServiceSummary"

  export default {
    name: "Service",
    components: { ServiceSummary },
    reactive: {
      serviceDefinitions: ['metadata', 'serviceDefinitions']
    }
  }

</script>

<style scoped>


</style>