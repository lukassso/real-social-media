<template>
  <span>
    <slot v-bind="{ value, error, setValue, setError }"></slot>
  </span>
</template>

<script>
  export default {
    name: "FormFieldBind",
    props: {
      name: {
        type: String,
        required: true
      }
    },
    inject: ['form'],
    data() {
      return {
        value: null,
        error: null,
      }
    },
    computed: {
      definition() {
        return form.getFieldDefinition(this.name)
      }
    },
    /// Commented out because it does not work and I don't know why
    /*watch: {
      value(v) {
        if(!this.connected) return;
        this.form.setFieldValue(this.name, v)
      },
      error(e) {
        if(!this.connected) return;
        this.form.setFieldError(this.name, e)
      }
    },*/
    methods: {
      setValue(value) {
        this.form.setFieldValue(this.name, value)
      },
      setError(error) {
        this.form.setFieldError(this.name, error)
      }
    },
    created() {
      this.valueObserver = (v) => {
        this.connected = false
        this.value = v
        this.connected = true
      }
      this.errorObserver = (e) => {
        this.connected = false
        this.error = e
        this.connected = true
      }
      this.form.observe(this.name, this.valueObserver)
      this.form.observeError(this.name, this.errorObserver)
      this.connected = true
    },
    beforeDestroy() {
      this.form.unobserve(this.name, this.valueObserver)
      this.form.unobserveError(this.name, this.errorObserver)
      this.connected = false
    }
  }
</script>

<style scoped>

</style>