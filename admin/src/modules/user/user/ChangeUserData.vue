<template>
  <div class="change-user-data col-10 card">
    <div class="" v-if="state == 'done'">
      <div class="">
        <h2 class="">{{ i18n().done.title }}</h2>
      </div>
      <div class="">
        {{ i18n().done.text }}
      </div>
    </div>
    <form class="col-12 card-block" v-on:submit="change" v-if="state != 'done' && state!='loading'">
      <div class="text-center">
        <h2 class="">{{ i18n().title }}</h2>
      </div>
      <div class="">

        <div :class="{blurred: state=='working'}" class="formsWrapper">
          <div class="serverError" v-if="error">{{ i18n().errors[error] || error }}</div>
            <b-form-group class="col-12 col-md-6" :label="i18n().firstName ">
              <b-form-input class="" type="text" id="firstName" v-model="editedUserData.firstName" required ref="firstName"/>
           </b-form-group>

          <b-form-group class="col-12 col-md-6" :label="i18n().lastName ">
            <b-form-input class="" type="text" id="lastName" v-model="editedUserData.lastName" required ref="lastName" />
          </b-form-group>

          <PhoneInput class="phoneNumber col-12 col-md-6"
                      :value.sync="editedUserData.phoneNumber" :required="required" :invalid="phoneNumberInvalid"
                      :label="i18n().phoneNumber">
          </PhoneInput>

          <b-form-group class="col-12 col-md-6" :label="i18n().companyName ">
            <b-form-input class="" type="text" id="companyName" v-model="editedUserData.companyName" required ref="companyName" />
          </b-form-group>

          <CountryInput class="country col-12 col-md-6 text-center"
                      :value.sync="editedUserData.country" :required="required" :invalid="countryInvalid"
                      :label="i18n().country">
          </CountryInput>

          <b-form-group class="col-12 col-md-6" :label="i18n().city ">
            <b-form-input class="" type="text" id="city" v-model="editedUserData.city" required ref="city" />
          </b-form-group>

          <b-form-group class="col-12 col-md-6" :label="i18n().addressLine1 ">
            <b-form-input class="" type="text" id="addressLine1" v-model="editedUserData.addressLine1" required ref="addressLine1" />
          </b-form-group>

          <b-form-group class="col-12 col-md-6" :label="i18n().addressLine2 ">
            <b-form-input class="" type="text" id="addressLine2" v-model="editedUserData.addressLine2" required ref="addressLine2" />
          </b-form-group>

          <b-form-group class="col-12 col-md-6" :label="i18n().postalCode ">
            <b-form-input class="" type="text" id="postalCode" v-model="editedUserData.postalCode" required ref="postalCode" />
          </b-form-group>

          <b-form-group class="col-12 col-md-6" :label="i18n().taxNumber">
            <b-form-input class="" type="text" id="taxNumber" v-model="editedUserData.taxNumber" required ref="taxNumber" />
          </b-form-group>

        </div>

        <div class="working" v-if="state == 'working'">
          <div class=""></div>
        </div>

      </div>

      <div class="col-12" :class="{blurred: state=='working'}">
        <button :disabled="!dataEdited" type="submit"  class="btn float-right">
          {{ i18n().submit }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import api from "api"
  import PhoneInput from "@/components/utils/PhoneInput.vue"
  import CountryInput from "@/components/utils/CountryInput.vue"
  import countries from "@/../../data/countries"

  export default {
    name: 'change-user-data',
    components: { PhoneInput, CountryInput },
    data () {
      return {
        editedUserData: {},
        state: 'loading',
        required: true,
        phoneNumberInvalid: false,
        countryInvalid: false,
        error: null,
        allFields: [ 'firstName', 'lastName', 'phoneNumber', 'companyName', 'country', 'addressLine1', 'addressLine2',
          'postalCode', 'taxNumber' ],
        requiredFields: [ 'firstName', 'lastName', 'phoneNumber', 'companyName', 'country', 'city', 'addressLine1' ]
      }
    },
    reactive: {
      user: ['user','user']
    },
    computed: {
      userData() {
        if(!this.user) return null
        let data = JSON.parse(JSON.stringify(this.user.userData || {}))

        return data
      },
      dataEdited() {
        return JSON.stringify(this.editedUserData) != JSON.stringify(this.userData)
      }
    },
    watch: {
      userData() {
        if(!this.userData) return;
        this.editedUserData = JSON.parse(JSON.stringify(this.userData))
        let fields = this.allFields
        for(let field of fields) {
          if(!this.editedUserData[field]) this.editedUserData[field] = ''
        }
        if(this.editedUserData['phoneNumber']!='' && this.editedUserData['country'] =='') {
          let prefix = this.editedUserData['phoneNumber'].split(' ')[0]
          let found = countries.filter(c=>c.dial_code == prefix)[0]
          this.editedUserData['country'] = found ? found.code : ""
        }
        for(let field of fields) {
          if(this.editedUserData[field]!='') {
            let el = this.$refs[field]
            if(el) el = el.parentElement
            if(el) el.setAttribute('class', el.getAttribute('class').replace('is-invalid','')+' is-dirty')
          }
        }
        this.state='ready'
      }
    },
    methods: {
      i18n() { return i18n().user.changeUserData },
      change(e) {
        e.preventDefault()

        let anyEmpty = false
        for(let field of this.requiredFields) if(this.editedUserData[field].trim()=='') {
          let el = this.$refs[field][0]
          if(el) el = el.parentElement
          if(el) el.setAttribute('class', el.getAttribute('class')+' is-invalid')
          console.log("EMPTY FIELD", field)
          anyEmpty = true
        }
        if(anyEmpty) {
          return
        }

        let phoneNumber = this.editedUserData.phoneNumber
        let sep = phoneNumber.indexOf(' ')
        console.log("PN",phoneNumber, sep)
        if( sep == -1
          || phoneNumber.slice(0, sep).trim().length == 0
          || phoneNumber.slice(sep+1).trim().length < 3
          || !phoneNumber.match(/^[0-9 #+-]+$/)) {
          console.log("PN INVALID",
            phoneNumber.slice(0, sep).trim().length == 0,
            phoneNumber.slice(sep+1).trim().length < 3,
            !phoneNumber.match(/^[0-9 #+-]+$/)
          )
          this.phoneNumberInvalid = false
          this.phoneNumberInvalid = true
          this.required = true
          return;
        }

        this.state = "working"
        api.request(["user", "updateUserData"], this.editedUserData).then(result => {
          this.state = "done"
        }).catch(error => {
          this.error = error
          this.state = "ready"
        })
      }
    },
    updated () {
    },
    mounted () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .change-user-data {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 2rem !important;
    padding: 10px;
  }

  .change-user-data .mdl-card {
    width: 600px;
    max-width: 95%;

  }
  .mdl-card__supporting-text {
    width: 100%;
  }
  .field {
    max-width: 250px;
    margin-right: 1em;
  }

  .mdl-card__actions button {
    float: right;
  }

  .blurred {
    filter: blur(2px) grayscale(50%);
  }

  .working {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    text-align: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.3);
  }
  .working div {
    margin: auto;
    height: 5em;
    width: 5em;
  }

  .serverError {
    color: darkred;
  }
  form {
    margin: 0 auto;
    height: 100%;
  }
  .formsWrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>
