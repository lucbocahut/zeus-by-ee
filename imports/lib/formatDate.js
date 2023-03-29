import dayjs from 'dayjs'

const formatDate = function (d) {
  return dayjs(d).format('YYYY/MM/DD')
}

export default formatDate
