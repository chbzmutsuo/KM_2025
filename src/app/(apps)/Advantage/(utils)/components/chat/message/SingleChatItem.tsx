import {formatDate} from '@cm/class/Days'

import {cl} from '@cm/lib/methods/common'

import {breakLines} from '@cm/lib/value-handler'
import {BellIcon, CheckIcon} from '@heroicons/react/20/solid'
import { generarlFetchUniversalAPI} from '@lib/methods/api-fetcher'

import useGlobal from '@hooks/globalHooks/useGlobal'
import {R_Stack} from '@components/styles/common-components/common-components'
import ContentPlayer from '@components/utils/ContentPlayer'
import {PrismaModelNames} from '@cm/types/prisma-types'

export default function SingleChatItem({modelName = `comment`, setmessages, commentObject, useGlobalProps}) {
  const {session} = useGlobal()
  const {toggleLoad} = useGlobalProps
  const {id, User, message, url, read, userId} = commentObject

  const alignClass = userId === session?.id ? 'ml-auto' : 'mr-auto'
  const justify = userId === session?.id ? ' items-end' : 'items-start'
  const readBtnClass = cl(userId !== session?.id ? '-right-2 -top-2' : ' hidden', read ? 'bg-lime-500' : 'bg-red-400')
  const NoticeIcon = read ? CheckIcon : BellIcon

  const isCoach = User?.membershipName === 'コーチ'

  const colors = isCoach ? `bg-yellow-50 border-yellow-500` : `border-lime-500 bg-lime-50`

  return (
    <div className={`col-stack relative w-full   gap-1  p-1 ${alignClass}`}>
      <div
        className={cl(alignClass, `relative w-full rounded border-2 ${colors} p-1 text-right `)}
        style={{
          minHeight: 30,
          width: 'fit-content',
          maxWidth: 220,
        }}
      >
        <NoticeIcon
          onClick={async e => {
            setmessages(prev => {
              const newMessages = prev.map(m => (m.id === id ? {...m, read: true} : m))
              return newMessages
            })
            const {result} = await generarlFetchUniversalAPI(modelName as PrismaModelNames, 'update', {
              where: {id},
              data: {
                read: !read,
              },
            })
          }}
          className={`icon-btn absolute w-4  rounded-full bg-green-500 p-0.5  text-white ${readBtnClass} `}
        />

        {message && (
          <div className={`row-stack ${alignClass}`}>
            <div className={`max-w-[200px] text-start text-sm`}>{breakLines(message)}</div>
          </div>
        )}

        {url && <ContentPlayer {...{src: url, style: {width: 100}}} />}
      </div>

      <div className={`row-stack justify-end   ${alignClass}`}>
        <R_Stack className={`${justify} gap-0 text-[8px]  `}>
          <span>{formatDate(new Date(), 'YYYY-MM-DD HH:mm')}</span>
          <R_Stack>
            <span className={` px-2`}>{User?.name}</span>
          </R_Stack>
        </R_Stack>
      </div>
    </div>
  )
}
