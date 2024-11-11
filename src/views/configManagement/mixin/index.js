import ZQuery from '@/components/configQuery/ZQuery.vue';
import '../style/common.scss';

export default {
  components: {
    ZQuery
  },
  data() {
    return {
      loading: false,
      expandAll: false,
      update: true,
      total: 0,
      showAdd: false,
      tableData: [],
      selectList: []
    }
  },
  methods: {
    handleReset() {
      Object.keys(this.form).forEach(key => {
        if (key !== 'PageSize' && key !== 'CurrentPageIndex') {
          if (Array.isArray(this.form[key])) {
            this.$set(this.form, key, [])
          } else {
            this.$set(this.form, key, '')
          }
        }
      })
    },
    handleRowStyle({ row, rowIndex }) {
      if (row.StatusID == 2 || row.Status == 2) {
        return { backgroundColor: '#eee' }
      }
    },
    handleSelectionChange(list) {
      this.selectList = list
    },
    handleBeachDelete() {
      if (this.selectList.length === 0) return
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.selectList.forEach(res => {
          this.delete(res.ID)
        })
      }).catch(() => {
      });
    }
  },
}
