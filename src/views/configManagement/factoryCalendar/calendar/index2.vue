<template>
  <div class='demo-app'>
   <!--  <div class='demo-app-sidebar'>
      <div class='demo-app-sidebar-section'>
        <el-button @click="test"> Add </el-button>
        <el-button @click="show"> show </el-button>
      </div>

      <div class='demo-app-sidebar-section' style="height: calc(100vh - 300px); overflow: hidden;">
        <h2>所有事件 ({{ currentEvents.length }})</h2>
        <ul style="height: calc(100% - 30px); overflow-y: auto;">
          <li v-for='event in currentEvents' :key='event.id'>
            <b>{{ event.startStr }}</b>
            <div style="width: inherit; overflow: hidden; text-overflow: ellipsis;" :title="event.title">{{ event.title
              }}</div>
          </li>
        </ul>
      </div>
    </div> -->
    <div class='demo-app-main' style="height: 100%;">
      <FullCalendar ref="FullCalendarRef" class='demo-app-calendar' :options='calendarOptions'
        @dateClick="handleDateClick">
        <template #eventContent='arg'>
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
    <ShiftToCalendar ref="ShiftToCalendarRef" v-loading="loading" @setData="handleSetData" @delete="handleDelete">
    </ShiftToCalendar>
  </div>
</template>


<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin from '@fullcalendar/interaction'
import { uuid } from '@/utils'
import ShiftToCalendar from './addShiftToCalendar.vue'
import {
  ShiftUPHDelete,
  // ShiftUPHGetList,
  ShiftGetAllList,
  ShiftUPHGetAllList,
} from '@/api/config.js'


/* calendar */
export default {

  components: {
    FullCalendar, // make the <FullCalendar> tag available
    ShiftToCalendar
  },

  data: function () {
    return {
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
          multiMonthPlugin
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        // initialEvents: INITIAL_EVENTS, // 初始化数据
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true, //是否缩略显示事件--按天
        weekends: true, //是否显示周末
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        allDaySlot: true,
        fixedWeekCount: false, //一个月显示几周
        showNonCurrentDates: false, //不显示上月和下月
        displayEventEnd: true,
        /*  views: {
           multiMonthFourMonth: {
             type: 'multiMonth',
             duration: { months: 4 }
           }
         }, */
        slotLabelFormat: [
          // { month: 'short', year: 'numeric' }, // top level of text
          // { weekday: 'short' } // lower level of text
          {
            hour: '2-digit',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short',
            hour12: false
          }
        ],
        slotDuration: '00:15', //时间间隔
        eventTimeFormat: { //显示时间格式化
          hour: '2-digit', //两位数显示
          minute: '2-digit',
          second: '2-digit',
          meridiem: false,
          hour12: false, //24小时制
        },
        views: {
          /*  customTimeLineWeek: {
             type: 'resourceTimeline',
             duration: { weeks: 1 },
             slotDuration: { days: 1 },
             buttonText: 'Custom Week',
             slotLabelFormat: {
               weekday: 'long',
               month: 'numeric',
               day: 'numeric',
               omitCommas: true,
             },
           } */
          // timeGrid: {
          //   dayMaxEventRows: 6 // adjust to 6 only for timeGridWeek/timeGridDay
          // }
        },
        /* you can update a remote database when these fire:*/
        eventAdd: this.handleEventAdd,
        eventChange: this.handleEventChange,
        eventRemove: this.handleEventRemove,
        events: []
      },
      currentEvents: [],
      // eventsData:
      shiftOptions: [],
      loading: true
    }
  },
  mounted() {
    // this.getShift()
    this.getData()
  },
  methods: {
    show() {
      console.log(this.currentEvents)
    },
    handleDateClick(arg) {
      // handle date click
      alert('Date: ' + arg.dateStr)
    },
    /*  getData(val) {
       console.log(val)
       return INITIAL_EVENTS
     }, */
    handleEventAdd(val) {
      // debugger
      // console.log(val)
    },
    handleEventChange(val) {
      debugger
      console.log(val)
    },
    handleEventRemove(val) {
      console.log(val)
    },
    test() {
      // console.log(INITIAL_EVENTS)
      let calendarApi = this.$refs.FullCalendarRef.getApi()
      console.log(calendarApi.getEvents())
      console.log(calendarApi)
      calendarApi.addEvent({ id: uuid(), title: uuid(), date: new Date(), 'shift': ['D', 'N', 'H'] })
      // this.calendarOptions.events.push({ id: uuid(), title: uuid(), date: new Date() })
      // console.log(this.currentEvents)
      /*  calendarApi.events = [
           { title: 'event 1', date: '2024-06-01' },
           { title: 'event 3', date: '2024-06-01' },
           { title: 'event 4', date: '2024-06-01' },
           { title: 'event 5', date: '2024-06-01' },
           { title: 'event 2', date: '2024-06-02' }
         ] */
      /*    this.$refs.FullCalendarRef.setDates({
           startInput: '2024-07-02T02:15:15',
           endInput: '2024-06-02T02:15:15',
           title: 'test set input'
         }) */
      /*   calendarApi.setEvents({
          id: '32343',
          start: '2024-07-02T02:15:15',
          end: '2024-06-02T02:15:15',
          title: 'test set input'
        }) */
    },
    handleWeekendsToggle(val) {
      console.log(val)
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },

    handleDateSelect(selectInfo) {
      let calendarApi = selectInfo.view.calendar
      calendarApi.unselect() // clear date selection


      this.$refs.ShiftToCalendarRef.show(this.$t('Added'), selectInfo, true)

      /*  console.log(selectInfo)
       let title = prompt('Please enter a new title for your event')
       let calendarApi = selectInfo.view.calendar

       calendarApi.unselect() // clear date selection

       if (title) {
         calendarApi.addEvent({
           id: uuid(),
           title,
           start: selectInfo.startStr,
           end: selectInfo.endStr,
           allDay: selectInfo.allDay
         })
       } */
    },
    handleSetData(data, events, isAdd) {
      console.log(data)
      console.log(events)
      console.log(isAdd)
      let calendarApi = this.$refs.FullCalendarRef.getApi()
      calendarApi.unselect()
      console.log(calendarApi)
      if (isAdd) {
        calendarApi.addEvent({
          id: uuid(),
          title: data.desc,
          start: events.startStr,
          end: events.endStr,
          allDay: events.allDay,
          /* extendedProps: {
            shift: data.shift,
            UPHTarget: data.UPHTarget
          } */
          shift: data.shift,
          UPHTarget: data.UPHTarget
        })
      } else {
        //修改
        let es = calendarApi.getEvents();
        let cacheRes = JSON.parse(JSON.stringify(es))
        let item = cacheRes.find(res => res.id === events.id)
        if (item) {
          item.title = data.desc;
          item.shift = data.shift,
            item.UPHTarget = data.UPHTarget
          this.$set(this.calendarOptions, 'events', cacheRes)
        }
      }
    },
    handleDelete(event) {
      // event.remove()
    },
    handleEventClick(clickInfo) {
      /*  if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
         clickInfo.event.remove()
       } */
      console.log(clickInfo.event)
      this.$refs.ShiftToCalendarRef.show(this.$t('edit'), clickInfo.event, false)
    },

    handleEvents(events) {
      this.currentEvents = events
    },

    async getData() {
      this.loading = true
      this.calendarOptions.events = [];
      let data = await ShiftGetAllList()
      if (data.Success) {
        this.shiftOptions = [...data.ResData]
      }


      ShiftUPHGetAllList().then(res => {
        console.log(res)
        let list = res.ResData
        if (res.Success && list) {
          let calendarApi = this.$refs.FullCalendarRef.getApi()
          calendarApi.unselect()
          // calendarApi.
          // console.log(calendarApi)
          list.forEach(item => {
            let title = this.shiftOptions.find(r => r.ID == item.ShiftID)
            // console.log(title)
            // console.log(this.shiftOptions)
            let end = new Date(item.ShiftDate)
            calendarApi.addEvent({
              id: item.ID,
              title: title ? title.ShiftCode : 'no title',
              start: new Date(item.ShiftDate).format('yyyy-MM-dd'),
              end: new Date(end.setDate(end.getDate() + 1)).format('yyyy-MM-dd'),
              allDay: true,
              extendedProps: item
            })
          })


        }
        this.loading = false
      }, error => {
        this.loading = false

      })


    },
    getShift() {
      ShiftGetAllList().then(res => {
        if (res.Success) {
          this.shiftOptions = [...res.ResData]
        }
      })
    },

  }
}
</script>



<style lang='scss' scoped >
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
  // min-height: 100%;
  // font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  background-color: #fff;
  height: inherit;
  min-width: 500px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 1em;
  box-sizing: border-box;

  .demo-app-calendar{
    height: calc(100% - 1em);
  }
}

.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}

.fc-daygrid-event-harness{
  overflow: hidden;
  text-overflow: ellipsis;
  width: inherit;
}

.fc-daygrid-dot-event {
  overflow: hidden;
  text-overflow: ellipsis;
  width: inherit;
}

// 影响全选
/* .fc-daygrid-day-frame{
  overflow: hidden;
  text-overflow: ellipsis;
  width: inherit;
} */

.fc .fc-popover {
  z-index: 101;
}
</style>
