<template>
  <b-breadcrumb :items="path"/>
</template>

<script>
  export default {
    name: "Model",
    props: ['serviceName', 'modelName'],
    computed: {
      path() {
        return [
          { text: this.serviceName,
            to: { name: 'service', params: { serviceName: this.serviceName } }
          },
          { text: 'models',
            active: true
          },
          { text: this.modelName,
            active: true
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>