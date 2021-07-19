<template>
  <div>
    <div class="scroll-list-container">
      <div class="scroll-list mt-3">
        <b-table borderless small class="summary-table mr-5 mb-0" :fields="tableFields" :items="items">
          <template #cell(color)="data">
            <div class="color-key" :style="data.index<5 ? 'background-color: ' + colors[data.index] : 'background-color: ' + colors[5]" />
          </template>
          <template #cell(item)="data">
            <abbr :title="data.item.item">{{ data.item.item | truncate(20, '...') }}</abbr>
          </template>
        </b-table>
      </div>
      <div class="scroll-list-overlay" />
    </div>
    <div class="scroll-list-footer mt-2">
      <span class="small text-muted">{{ lastUpdatedDate }} | IATI</span>
      <span>(USD)</span>
    </div>
  </div>
</template>
<style scoped>

</style>
<script>
export default {
  name: 'RankedList',
  components: {},
  filters: {
    truncate (text, length, suffix) {
      if (text.length > length) {
        return text.substring(0, length) + suffix
      } else {
        return text
      }
    }
  },
  props: [
    'items',
    'colors',
    'lastUpdatedDate'
  ],
  data () {
    return {
      tableFields: [
        { key: 'color', label: 'Color' },
        'item',
        'value'
      ]
    }
  },
  methods: {

  }
}
</script>
