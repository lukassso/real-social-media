<template>
  <div>
    <div v-for="propName in Object.keys(definition)">
      <property-editor
          :definition="definition[propName]"
          :serviceDefinition="serviceDefinition"
          :value="valueData[propName]"
          :name="propName"
          @input="v => updatePropertyValue(propName, v)" >
      </property-editor>
    </div>
  </div>
</template>

<script>
  import PropertyEditor from "@/modules/api-explorer/components/PropertyEditor.js"

  export default {
    name: "PropertiesEditor",
    props: ["definition", "serviceDefinition", "value"],
    components: { PropertyEditor },
    data() {
      let value = this.value
      if(!value) value = {}
      for(let propName in this.definition) {
        if(!value.hasOwnProperty(propName)) {
          let prop = this.definition[propName]
          value[propName] = prop.default || null
        }
      }
      return {
        valueData: value
      }
    },
    computed: {
      all() {
        let all = true
        for (let propName in this.definition) {
          const prop = this.definition[propName]
          if (this.valueData[propName] == null && !prop.optional) all = false
        }
        return all
      }
    },
    watch: {
      value(v) {
        this.valueData = v
      },
      all(v) {
        this.$emit('all', v)
      }
    },
    methods: {
      updatePropertyValue(name, value) {
        this.valueData[name] = value
        this.valueData = this.valueData
        this.$emit('input', this.valueData)
      }
    },
    mounted() {
      this.$emit('all', this.all)
    }
  }
</script>

<style scoped>

</style>