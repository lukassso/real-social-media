import Vue from 'vue'

import TextEditor from "@/modules/api-explorer/editors/TextEditor.vue"
import BooleanEditor from "@/modules/api-explorer/editors/BooleanEditor.vue"
import EntityFinder from "@/modules/api-explorer/editors/EntityFinder.vue"
import JsonEditor from "@/modules/api-explorer/editors/JsonEditor.vue"
import UnknownTypeEditor from "@/modules/api-explorer/editors/UnknownTypeEditor.vue"

const config = {
  editorsByName: {
    TextEditor
  },
  defaultTypeEditors: {
    "String": TextEditor,
    "Boolean": BooleanEditor
  },
  defaultModelEditor: EntityFinder,
  defaultStructEditor: JsonEditor,
}

function findEditor(definition, serviceDefinition) {
  if(definition.editor) {
    let name, props = {}
    if(definition.editor instanceof String) {
      name = definition.editor
    } else {
      name = definition.editor.name
      props = definition.editor
    }

    let byName = config.editorsByName[definition.editor]
    if(byName) {
      if(byName.component) {
        return {
          ...byName,
          ...props
        }
      }
      return {
        ...props,
        component: byName
      }
    }
    console.log("Not found editor with name ", name)
  }
  let editor = config.defaultTypeEditors[definition.type]
  if(editor) {
    if (!editor.component) return { component: editor }
    return editor
  }
  if(serviceDefinition.models && serviceDefinition.models[definition.type]) { // It's model
    let editor = config.defaultModelEditor
    if (!editor.component) return { component: editor }
    return editor
  }
  if(serviceDefinition.structs && serviceDefinition.struct[definition.type]) { // It's struct
    let editor = config.defaultStructEditor
    if (!editor.component) return { component: editor }
    return editor
  }
  return {
    component: UnknownTypeEditor
  }
}

let PropertyEditor = {

  config,

  name: 'PropertyEditor',
  props: ["value", "definition", "serviceDefinition", "name"],

  render(createElement) {
    const editor = findEditor(this.definition, this.serviceDefinition)
    const component = editor.component
    delete editor.component
    const props = {
      props: {
        ...editor,
        name: this.name,
        definition: this.definition,
        serviceDefinition: this.serviceDefinition,
        value: this.value
      },
      on: {
        input: (val) => this.$emit('input', val)
      }
    }
    return createElement(component, props, [])
  }
}

export default PropertyEditor