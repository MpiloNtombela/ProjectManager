import utcToZonedTime from 'date-fns-tz/utcToZonedTime'
import format from 'date-fns-tz/format'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import differenceInDays from 'date-fns/differenceInDays'

export const getTimezoneValue = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const toZonedFormat = (date, formatString = "dd/MM/yy") => {
  return format(utcToZonedTime(date, getTimezoneValue()), formatString)
}

export const timeDiffFromNow = (date) => {
  return formatDistanceToNowStrict(utcToZonedTime(date, getTimezoneValue()), {addSuffix: true})
}

export const diffInDaysFromNow = (date) => {
  const dateLeft = new Date(date)
  const dateRight = new Date()
  return differenceInDays(dateLeft, dateRight)
}