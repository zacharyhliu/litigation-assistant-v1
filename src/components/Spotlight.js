import _ from 'lodash'
import './Spotlight.less'

export default {
  name: 'CompSpotlight',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    service: {
      type: Function,
      required: true,
    },
    selection: {
      type: String,
    },
  },
  data() {
    return {
      fields: [],
      currentFieldIndex: -1,
      pCurrentFieldValue: '',
      record: {
        plaintiff: [{
          name: '',
          representative: [{
            name: '',
          }],
          agent: [{
            name: '',
          }],
        }],
      },
    }
  },
  computed: {
    currentFieldValue: {
      get() {
        const { pCurrentFieldValue } = this
        if (pCurrentFieldValue) {
          return pCurrentFieldValue
        }
        return this.selection
      },
      set(value) {
        this.pCurrentFieldValue = value
      },
    },
    noFields() {
      return this.fields.length === 0
    },
    currentField() {
      return this.fields[this.currentFieldIndex]
    },
    fieldRender() {
      const { currentField } = this
      if (!currentField) {
        return null
      }

      const fieldType = currentField.type || 'String'

      if (fieldType === 'String') {
        const { choices } = currentField
        if (choices && choices.length > 0) {
          const options = choices.map(choice => {
            const option = (
              <base-option
                label={ choice }
                value={ choice }>
              </base-option>
            )
            return option
          })
          return (
            <div>
              <base-select
                style="width: 100%;"
                value={ this.currentFieldValue }
                onInput={ value => { this.currentFieldValue = value }}
                placeholder="请选择">
                { options }
              </base-select>
            </div>
          )
        }
        return (
          <base-input
            type="textarea"
            value={ this.currentFieldValue }
            onInput={ value => { this.currentFieldValue = value }}>
          </base-input>
        )
      }
      return null
    },
  },
  render() {
    const { noFields, fields, currentFieldIndex, currentField, fieldRender, clickField } = this
    const options = fields.map((field, index) => {
      const option =
        <li
          class={{ 'comp-spotlight__fields__item': true, active: (currentFieldIndex === index) }}
          onClick={ () => clickField(index) }>
          { field.code }
        </li>
      return option
    })
    return (
      <base-dialog
        class={{ 'no-fields': noFields, 'comp-spotlight': true }}
        title="提示"
        modal={ false }
        showClose={ false }
        modalAppendToBody={ true }
        visible={ this.visible }
        onClose={ this.hide }
        nativeOnKeyup={this.keyup}>
        <span slot="title">
          <base-input
            prefix-icon="base-icon-search"
            placeholder="type keywords for field"
            onInput={ this.debounceChange() }>
          </base-input>
        </span>
        {
          !noFields ?
            <ul
              class="comp-spotlight__fields">
              { options }
            </ul>
            : null
        }
        {
          currentField ?
            <div class="comp-spotlight__field-render">
              <h4>{ currentField.code }</h4>
              { fieldRender }
              <div class="comp-spotlight__field-render__button-group">
                <base-button type="primary" size="small" round onClick={this.save}>Save</base-button>
              </div>
            </div>
            : null
        }
      </base-dialog>
    )
  },
  methods: {
    save() {
    },
    clickField(index) {
      this.currentFieldIndex = index
      this.pCurrentFieldValue = ''
    },
    hide() {
      this.$emit('update:visible', false)
    },
    async change(value) {
      if (!value.trim()) {
        this.fields = []
        this.currentFieldIndex = -1
        return
      }
      this.pCurrentFieldValue = ''
      this.fields = await this.service(value)
      this.currentFieldIndex = 0
    },
    debounceChange() {
      return _.debounce(this.change, 250)
    },
    keyup(event) {
      const { keyCode } = event
      const max = this.fields.length - 1
      if (keyCode === 40) {
        if (this.currentFieldIndex === max) {
          this.currentFieldIndex = 0
        } else {
          this.currentFieldIndex++
        }
        this.pCurrentFieldValue = ''
      } else if (keyCode === 38) {
        if (this.currentFieldIndex === 0) {
          this.currentFieldIndex = max
        } else {
          this.currentFieldIndex--
        }
        this.pCurrentFieldValue = ''
      }
    },
  },
}
