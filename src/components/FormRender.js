import $ from 'jquery'
import _ from 'lodash'
import Clipboard from './Clipboard'

const RE = /\[\]$/
const rename = code => code.replace(RE, '')

const preprocess = (field) => {
  let data = { ...field }
  let { code, type = 'String' } = data
  if (RE.test(code)) {
    type = 'Array'
    code = rename(code)
    data = { ...data, code, type }
  }
  return data
}

const DEFAULT_ARRAY = {
  type: Array,
  default() {
    return []
  },
}

const FormItem = {
  functional: true,
  render(h, context) {
    const { label } = context.props
    const { slots } = context
    const $slots = slots()
    return (
      <div class="form-item">
        <div class="form-item__label">
          {
            $slots.label ?
              $slots.label
              : label
          }
        </div>
        <div class="form-item__content">
          {
            $slots.default ?
              $slots.default
              : null
          }
        </div>
      </div>
    )
  },
}

const PrimitiveFormItem = {
  functional: true,
  render(h, context) {
    const { field, parentName, indexInArray } = context.props
    let { value } = context.props
    const { code, choices } = field
    let name = rename(code)
    if (parentName) {
      name = `${parentName}.${name}`
    }
    if (indexInArray !== undefined) {
      name = `${name}[${indexInArray}]`
    }
    return (
      <div class="form-item-primitive">
        <Clipboard
          data={choices}
          name={name}
          value={value}
          onInput={e => { value = e }}>
        </Clipboard>
      </div>
    )
  },
}

const HashFormItem = {
  functional: true,
  render(h, context) {
    const { field, parentName, value } = context.props
    const { fields } = field
    const items = fields.map(data => {
      const field = preprocess(data) // eslint-disable-line
      const { type } = field
      let typeNode
      if (type === 'String') {
        typeNode = <PrimitiveFormItem
          parentName={ parentName }
          value={value[field.code]}
          field={field}>
        </PrimitiveFormItem>
      } else if (type === 'Array') {
        typeNode = <ArrayFormItem
          parentName={ parentName }
          value={value[field.code]}
          field={field}>
        </ArrayFormItem>
      } else if (type === 'Object') {
        typeNode = <HashFormItem
          parentName={ parentName }
          value={value[field.code]}
          field={field}>
        </HashFormItem>
      }
      const node = (
        <li>
          <FormItem
            label={field.code}>
            {typeNode}
          </FormItem>
        </li>
      )
      return node
    })
    return (
      <ul class="form-item-hash">
        {
          items
        }
      </ul>
    )
  },
}

const ArrayFormItem = {
  props: {
    field: {
      type: Object,
      required: true,
    },
    parentName: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default() {
        return [{
          key: 0,
        }]
      },
    },
  },
  data() {
    return {
      key: 0,
    }
  },
  computed: {
    primitive() {
      const { field } = this
      const { fields } = field
      return (!fields || fields.length === 0)
    },
  },
  methods: {
    append() {
      const { primitive } = this
      this.key += 1
      this.value.push(primitive ? '' : {
        key: this.key,
      })
    },
    remove(index) {
      this.value.splice(index, 1)
    },
  },
  render() {
    const { field, parentName, value: models, primitive } = this
    const size = models.length
    const children = _.map(models, (model, index) => {
      let name = rename(field.code)
      if (parentName) {
        name = `${parentName}.${name}`
      }
      if (primitive) {
        // debugger
      }
      if (_.isString(model)) {
        // debugger
      }
      const node = <li class="form-item-array-item">
        <div class="form-item-array-item__content">
          {
            primitive ?
              <PrimitiveFormItem
                indexInArray={index}
                value={ _.isUndefined(model.key) ? model : '' }
                field={field}>
              </PrimitiveFormItem>
              :
              <HashFormItem
                parentName={`${name}[${index}]`}
                value={model}
                field={field}>
              </HashFormItem>
          }
        </div>
        <div class="form-item-array-item__actions">
          {
            size > 1 ?
              <base-button
                type="danger"
                size="mini"
                icon="base-icon-delete"
                onClick={() => this.remove(index)}>
              </base-button>
              :
              null
          }
        </div>
      </li>
      return node
    })
    return (
      <ul class="form-item-array">
        <div style="padding: 0 5px;">
          <base-button
            type="primary"
            size="mini"
            icon="base-icon-plus"
            onClick={ this.append }>
          </base-button>
        </div>
        {
          children
        }
      </ul>
    )
  },
}

export default {
  name: 'RecursionForm',
  props: {
    data: DEFAULT_ARRAY,
    value: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    fields() {
      return this.data
    },
  },
  render() {
    const { value, fields } = this
    const items = fields.map(field => {
      const { code, type = 'String' } = preprocess(field)
      let item
      if (type === 'String') {
        item = (
          <PrimitiveFormItem
            value={value[code]}
            field={field}>
          </PrimitiveFormItem>
        )
      } else if (type === 'Array') {
        item = (
          <ArrayFormItem
            value={value[code]}
            field={ field }>
          </ArrayFormItem>
        )
      } else if (type === 'Object') {
        item = <HashFormItem
          parentName={field.code}
          value={value[code]}
          field={field}>
        </HashFormItem>
      }

      return (
        <li>
          <FormItem
            label={ code }>
            { item }
          </FormItem>
        </li>
      )
    })
    return (
      <ul class="recursion-form">
        { items }
      </ul>
    )
  },
  methods: {
    getData() {
      const data = {}
      $(this.$el).find('.base-input__inner').each(function (){ // eslint-disable-line
        const name = $(this).attr('name')
        const value = $(this).val()
        data[name] = value
      })
      this.$emit('input', data)
      return data
    },
  },
}
