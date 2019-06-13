<template>
  <b-container>
    <b-row>
      <b-col sm="3">
        <loading :what="selectedInterests" name="selectedInterests">
          <b-card v-if="selectedInterests">
            <b-card-title>Selected</b-card-title>
            <ul>
              <li v-for="interestId in selectedInterests">
                <loading :what="interestById(interestId)" :name="`interest ${interestId}`" #default="{ value: interest }">
                  {{ interest.name }}
                </loading>
              </li>
            </ul>
            <b-card-text v-if="selectedInterests.length == 0">
              Select some interests to create account.
            </b-card-text>
            <b-button
                v-if="selectedInterests.length > 0 && !session.user"
                variant="success"
                :to="{name : 'user:register'}">
              Next >>
            </b-button>
          </b-card>
        </loading>
      </b-col>
      <b-col sm="9">
        <loading :what="interests" name="interests">
          <b-row>
            <b-col sm="4" v-for="interest in interests" :key="interest.id">
              <b-card
                :title="interest.name"
                img-src="https://picsum.photos/600/300/?image=25"
                :img-alt="interest.name"
                img-top class="mb-2">
                <b-card-text>Jakiś tekst?</b-card-text>
                <b-button variant="success" v-if="!isSelected(interest.id)" @click="select(interest.id)">
                  Add Interest
                </b-button>
                <b-button variant="danger" v-if="isSelected(interest.id)" @click="deselect(interest.id)">
                  Remove Interest
                </b-button>
              </b-card>
            </b-col>
          </b-row>
        </loading>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

  import api from "@/api"

  export default {
    name: "SelectInterests",

    inject: ['workingZone'],

    reactive: {
      interests: ['interests',"InterestAll"],
      serverSelectedInterests: ['interests',"MySelectedInterests"]
    },

    data() {
      return {
        clientSelectedInterests: null
      }
    },

    computed: {
      selectedInterests() {
        return this.clientSelectedInterests
      },
      session() {
        return api.session.session
      }
    },

    watch: {
      serverSelectedInterests(v) {
        if(!this.clientSelectedInterests) {
          this.clientSelectedInterests = v
          return
        }
        if(this.clientSelectedInterests.length != v.length) { // Handle change from another window/screen
          this.clientSelectedInterests = v
        }
      }
    },

    preFetch() {
      return Promise.all([
        api.get([ "interests", "InterestAll" ]),
        api.get([ 'interests', "MySelectedInterests"])
      ])
    },

    created() {
      if(this.serverSelectedInterests && ! this.clientSelectedInterests)
        this.clientSelectedInterests = this.serverSelectedInterests
    },

    methods: {
      interestById(id) {
        let found = this.interests.find(g => g.id == id)
        if(found) return found
        /// TODO: additional interests cache for ones selected before and not loaded now
        return null
      },
      isSelected(id) {
        if(!this.selectedInterests) return false
        return this.selectedInterests.find(g => g == id)
      },
      select(id) {
        this.clientSelectedInterests.push(id)
        api.request(['interests', 'SelectInterest'], { interest: id }).catch( err => {
          const task = this.workingZone.started({ name: 'selectInterest' })
          this.workingZone.failed(task)
        })
      },
      deselect(id) {
        const index = this.clientSelectedInterests.indexOf(id)
        if(index != -1) this.clientSelectedInterests.splice(index)
        api.request(['interests', 'DeselectInterest'], { interest: id }).catch( err => {
          const task = this.workingZone.started({ name: 'deselectInterest' })
          this.workingZone.failed(task)
        })
      }
    }
  }

</script>

<style scoped>

</style>