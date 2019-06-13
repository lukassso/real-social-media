<template>
  <form-field-bind :name="name" v-slot="{ value, setValue, error, setError }">
    <FieldTemplate :errorText="errorText" :error="error" :label="label" :name="name">
      <b-form-input type="password" :id="''+_uid" :value="value" @input="setValue" ref="field"
                    class="{ 'is-invalid': !!error }" />
    </FieldTemplate>
    <FieldTemplate :label="retypeLabel" :name="name">
      <b-form-input type="password" :id="'second'+_uid" v-model="second" ref="field2"
                    class="{ 'is-invalid': !!error }" />
    </FieldTemplate>
  </form-field-bind>
</template>

<script>
  import FieldTemplate from "./FieldTemplate.vue"

  export default {
    name: "TextField",
    components: { FieldTemplate },
    inject: ['form'],
    props: {
      name: {
        type: String,
        required: true
      },
      label: {
        type: String
      },
      retypeLabel: {
        type: String
      },
      errorText: {
        type: Object
      }
    },
    data() {
      return {
        second: ''
      }
    },
    methods: {
    },
    created() {
      this.validator = () => {
        let value = this.form.getFieldValue(this.name)
        console.log("PASSWORDS MATCH?", this.second, value)
        if(value != this.second) return "notMatch"
      }
      this.form.addValidator(this.name, this.validator)
    },
    beforeDestroy() {
      this.form.removeValidator(this.name, this.validator)
    }
  }

</script>

<style scoped>

</style>