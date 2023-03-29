import dayjs from 'dayjs'

const formatDate = function (d) {
  return dayjs(d).format('D MMM YYYY à H[h]mm')
}

export default formatDate
