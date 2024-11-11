
import  {uuid} from '@/utils'

// let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00'
  },
 /*  {
    id: createEventId(),
    title: 'test set data',
    start: todayStr + 'T12:00:00',
    end: '2024-07-02T02:15:15'
  } */
]

export function createEventId() {
  return uuid(); //String(eventGuid++)
}
