<template>
  <form-field-bind :name="name" v-slot="{ value, error }">
    <b-form-group :label="label || name">
      <ul>
        <li v-for="(val, id) in value">
          <slot :name="name+'.'+id">
            <component :is="editorComponent()" :name="name + '.' + id" :label="''+id"></component>
          </slot>
        </li>
      </ul>
      <small class="text-danger" v-if="error">
        {{ (errorText && errorText[error]) || error }}
      </small>
      <b-button @click="add">Add Element</b-button>
    </b-form-group>
  </form-field-bind>
</template>

<script>
  export default {
    name: "ListField",
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
        definition: null,
        value: []
      }
    },
    methods: {
      add() {
        console.log("F",this.form)
        this.form.addElementToArray(this.name)
      },
      editorComponent() {
        let fieldDefinition = this.definition.of
        return this.$editors.byDefinition(fieldDefinition)
      }
    },
    created() {
      this.definition = this.form.getFieldDefinition(this.name)
      console.log("CF defn", this.definition)
    }
  }
</script>

<style scoped>

</style>