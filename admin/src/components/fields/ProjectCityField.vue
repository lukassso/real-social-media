<template>
  <form-field-bind :name="name" v-slot="{ value, setValue, error }">
    <FieldTemplate :errorText="errorText" :error="error" :label="label || name" :name="name">
      <loading :what="cities" :name="'group cities'">
        <SingleSelectWithSearch :options="cities" :value="value" @input="setValue">
        </SingleSelectWithSearch>
      </loading>
    </FieldTemplate>
  </form-field-bind>
</template>

<script>
  import FieldTemplate from "./FieldTemplate.vue"
  import SingleSelectWithSearch from "@/components/inputs/SingleSelectWithSearch.vue"

  export default {
    name: "ProjectCityField",
    components: { FieldTemplate, SingleSelectWithSearch },
    inject: ['form'],
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
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    reactive: {
      groupData() {
        if(!this.group) return null
        return ['groups', 'GroupOne', { group: this.group }]
      },
      cities() {
        if(!this.groupData) return null
        return ['geo', 'citiesByCountry', this.groupData.country]
      }
    },
    data() {
      return {
        group: null
      }
    },

    created() {
      this.groupValueObserver = (v) => {
        this.group = v
        console.log("GROUP", v)
      }
      this.form.observe("group", this.groupValueObserver)
    },
    beforeDestroy() {
      this.form.unobserve("group", this.groupValueObserver)
    }
  }
</script>

<style scoped>

</style>