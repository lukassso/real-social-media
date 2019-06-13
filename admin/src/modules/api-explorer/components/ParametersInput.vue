<template>
  <div>
    <div v-if="anyParametersNeeded">
      <pre>{{ JSON.stringify(parametersDefinition, null, "  ") }}</pre>
      <properties-editor
          :definition="parametersDefinition"
          :serviceDefinition="serviceDefinition"
          :value="value"
          @input="val => $emit('input', val)"
          @all="v => $emit('all',v)">
      </properties-editor>
    </div>
   <!-- <div v-if="!anyParametersNeeded">
      <h5>No parameters needed.</h5>
    </div>-->
  </div>
</template>

<script>
  import PropertiesEditor from "@/modules/api-explorer/components/PropertiesEditor.vue"

  export default {
    name: "ParametersInput",
    props: ["parametersDefinition", "serviceDefinition", "value"],
    components: { PropertiesEditor },
    computed: {
      anyParametersNeeded() {
        return this.parametersDefinition && (Object.keys(this.parametersDefinition).length > 0)
      }
    },
    mounted() {
      if(!this.anyParametersNeeded) {
        this.$emit("input",{})
        this.$emit("all", true)
      }

    }
  }
</script>

<style scoped>

</style>