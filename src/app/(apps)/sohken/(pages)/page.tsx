import {formatDate, getMidnight} from '@class/Days'
import Redirector from '@components/utils/Redirector'
import {addQuerySentence} from '@lib/methods/urls'
import {addDays} from 'date-fns'

const Top = () => {
  return (
    <Redirector
      {...{redirectPath: '/sohken/genbaDay' + addQuerySentence({from: formatDate(addDays(getMidnight(), 1)), myPage: true})}}
    />
  )
}

export default Top
