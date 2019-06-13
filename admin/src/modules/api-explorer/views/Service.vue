<template>
  <div>
    <b-breadcrumb :items="path"/>

    <div v-if="!service">
      Loading...
    </div>

    <div v-if="service">
      <service-summary :service="service"></service-summary>
    </div>
  </div>
</template>

<script>
  import ServiceSummary from "@/modules/api-explorer/components/ServiceSummary"

  export default {
    name: "Service",
    props: ['serviceName'],
    components: { ServiceSummary },
    reactive: {
      serviceDefinitions: ['metadata', 'serviceDefinitions']
    },
    computed: {
      path() {
        return [
          { text: this.serviceName,
            active: true
          }
        ]
      },
      service() {
        if(!this.serviceDefinitions) return null;
        for(let service of this.serviceDefinitions) {
          if(service.name == this.serviceName) return service
        }
      }
    }
  }
</script>

<style scoped>

</style>