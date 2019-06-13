<template>
  <b-form-group :label="label || name" class="object">
    <div v-for="prop in properties" class="prop">
      <component :is="editorComponent(prop)" :name="name + '.' + prop" :label="prop"></component>
    </div>
  </b-form-group>
</template>

<script>
  export default {
    name: "ObjectField",
    inject: ['form'],
    props: {
      name: {
        type: String,
        required: true
      },
      label: {
        type: String,
      }
    },
    data() {
      return {
        definition: null
      }
    },
    computed: {
      properties() {
        return this.definition && Object.keys(this.definition.properties)
      }
    },
    mounted() {
      this.definition = this.form.getFieldDefinition(this.name)
      console.log("CF defn", this.definition)
    },
    methods: {
      editorComponent(fieldName) {
        let fieldDefinition = this.definition.properties[fieldName]
        return this.$editors.byDefinition(fieldDefinition)
      }
    }
  }
</script>

<style scoped>
  .object {

  }
  .prop {
    padding-left: 2em;
  }
</style>