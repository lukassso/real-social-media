<template>
  <div>
    <label :for="id" class="col-form-label">{{definition.title || name}}</label>
<!--    <pre>{{ JSON.stringify(relatedViews, null, "  ") }}</pre>-->
    <div class="card text-center">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item" v-for="anyView in relatedViews">
            <a class="nav-link"
               :class="{ active: selectedView && selectedView.name == anyView.name}"
               href="#"
               @click="() => selectedView = anyView">
              {{ anyView.title || anyView.name }}
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link"
               :class="{ active: !selectedView}"
               @click="() => selectedView = null"
               href="#">Enter ID</a>
          </li>
        </ul>
      </div>
      <div v-if="selectedView" class="card-body">
        <one-entity-from-view
            v-if="selectedView.returns.type == definition.type"
            :viewDefinition="selectedView"
            :requiredType="definition.type"
            :serviceDefinition="serviceDefinition"
            :value = "value"
            @input = "v => $emit('input', v)">
        </one-entity-from-view>
        <entity-select-from-view
            v-if="selectedView.returns.type == 'Array' && selectedView.returns.of.type == definition.type"
            :viewDefinition="selectedView"
            :requiredType="definition.type"
            :serviceDefinition="serviceDefinition"
            :value = "value"
            @input = "v => $emit('input', v)">
        </entity-select-from-view>
      </div>
      <div v-if="!selectedView" class="card-body">
        <b-row>
          <label :for="id" class="col-sm-2 col-form-label">Entity Id:</label>
          <b-col sm="10">
            <b-form-input :id="id"
                          :value="value"
                          @input="v => $emit('input', v)"
                          type="text"></b-form-input>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
  import EntitySelectFromView from "./EntitySelectFromView.vue"
  import OneEntityFromView from "./OneEntityFromView.vue"

  export default {
    name: "EntityFinder",
    props: ["placeholder", "name", "definition", "serviceDefinition", "value"],
    components: { EntitySelectFromView, OneEntityFromView},
    data() {
      return {
        selectedView: null
      }
    },
    computed: {
      id () {
        return ''+this._uid
      },
      relatedViews() {
        let found = []
        for(let viewName in this.serviceDefinition.views) {
          const view = this.serviceDefinition.views[viewName]
          const returns = view.returns
          if(returns.type == "Array") {
            const element = returns.of
            if(element.type == this.definition.type) found.push(view)
          }
          if(returns.type == this.definition.type) {
            found.push(view)
          }
        }
        return found
      }
    },
    watch: {
      relatedViews() {
        this.preSelectView()
      }
    },
    methods: {
      preSelectView() {
        let found = false
        if(this.selectedView) {
          for (let view of this.relatedViews) {
            if (this.selectedView == view || this.selectedView.name == view.name) found = true;
          }
        }
        if(this.relatedViews.length > 0 ) {
          if(!found || !this.selectedView) {
            this.selectedView = this.relatedViews[0]
          }
        } else {
          this.selectedView = null
        }
      }
    },
    mounted() {
      this.preSelectView()
    }
  }
</script>

<style scoped>

</style>