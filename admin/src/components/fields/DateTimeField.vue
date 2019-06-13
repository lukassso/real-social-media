<template>
  <form-field-bind :name="name" v-slot="{ error }">
    <FieldTemplate :errorText="errorText" :error="error" :label="label || name" :name="name">
      <b-input-group>
        <b-form-input type="date" v-model="date"></b-form-input>
        <b-form-input type="time" v-model="time" step="60"></b-form-input>
      </b-input-group>
    </FieldTemplate>
  </form-field-bind>
</template>

<script>
  import FieldTemplate from "./FieldTemplate.vue"
  import moment from "moment"

  export default {
    name: "DateTimeField",
    components: { FieldTemplate },
    inject: ["form"],
    props: {
      name: {
        type: String,
        required: true
      },
      label: {
        type: String
      },
      errorText: {
        type: Object
      }
    },
    data() {
      return {
        date: '',
        time: ''
      }
    },
    computed: {
      dateTime() {
        const dateParts = this.date.split('-')
        const timeParts = this.time.split(':')
        if(timeParts && timeParts.length<3) timeParts.push("00")
        //console.log("dtp", dateParts, timeParts)
        if(dateParts.length==3 && timeParts.length==3) {
          //const offset = moment().utcOffset()

          let dt = new Date(Date.UTC.apply(undefined,
              [ dateParts[0], +dateParts[1]-1, +dateParts[2]].concat(timeParts)))
          //dt = (new Date((dt.getTime())+(new Date()).getTimezoneOffset()*60000)).toISOString()
          let time = dt.getTime() + dt.getTimezoneOffset()*60000
          //console.log("TIME!!!", time, new Date(time))
          dt.setTime(time)
          return dt.toUTCString()
        }
        return null
      }
    },
    watch: {
      dateTime(v) {
        if(!this.connected) return;
        this.form.setFieldValue(this.name, v)
      }
    },
    methods: {
    },
    created() {
      this.valueObserver = (v) => {
        this.connected = false
        if(v) {
          const utcDate = v
          const offset = moment().utcOffset()
          this.time = moment.utc(utcDate).utcOffset(offset).format("HH:mm")
          this.date = moment.utc(utcDate).utcOffset(offset).format("YYYY-MM-DD")
        }
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