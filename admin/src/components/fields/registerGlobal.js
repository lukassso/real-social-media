import Vue from "vue"


import TextField from "./TextField.vue"
Vue.component('text-field', TextField)
import TextAreaField from "./TextAreaField.vue"
Vue.component('text-area-field', TextAreaField)
import PasswordField from "./PasswordField.vue"
Vue.component('password-field', PasswordField)
import DoublePasswordField from "./DoublePasswordField.vue"
Vue.component('double-password-field', DoublePasswordField)

import PhoneField from "./PhoneField.vue"
Vue.component('phone-field', PhoneField)

import CountryField from "./CountryField.vue"
Vue.component('country-field', CountryField)

import DateField from "./DateField.vue"
Vue.component('date-field', DateField)

import TimeField from "./TimeField.vue"
Vue.component('time-field', DateField)

import DateTimeField from "./DateTimeField.vue"
Vue.component('date-time-field', DateTimeField)

import ListField from "./ListField.vue"

import ObjectField from "./ObjectField.vue"

import RelationSingleSelect from "./RelationSingleSelect";


import ProjectCityField from "./ProjectCityField";

const editors = {
  byName: {
    "text": TextField,
    "textarea": TextAreaField,
    "password": PasswordField,
    "phone": PhoneField,
    "country": CountryField,
    "doublePassword": DoublePasswordField,
    "relationSingleSelect": RelationSingleSelect,
    "date": DateField,
    "time": TimeField,
    "dateTime": DateTimeField,
    "projectCity": ProjectCityField
  },
  byType: {
    "String": TextField,
    "Array": ListField,
    "Object": ObjectField,
    "Date": DateTimeField
  },
/*  defaultModel: EntityFinder,
    defaultStruct: JsonEditor,*/
  byDefinition(fieldDefinition) {
    let editor
    if(fieldDefinition.editor) {
      editor = editors.byName[fieldDefinition.editor]
      if(!editor) throw new Error("unknown editor "+fieldDefinition.editor)
      return editor
    }
    editor = editors.byType[fieldDefinition.type]
    if(!editor) throw new Error("no editor for field type "+fieldDefinition.type)
    return editor
  }
}

Vue.prototype.$editors = editors
