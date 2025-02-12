export {}
// import {wrapWithLogging} from '@app/Logging/AppLogBuilders/class/ActionLogger'
// import {requestResultType} from '@cm/types/types'
// import useGlobal from '@hooks/globalHooks/useGlobal'
// import {isServer} from '@lib/methods/common'
// import React, {useEffect} from 'react'

// export default function useLogOnPageRender() {
//   const {session, asPath} = useGlobal()

//   const dependencies = [isServer, asPath, session]

//   useEffect(() => {
//     if (!isServer) {
//       const title = document.title
//       const [appName, pageTitle] = title.split(':')
//       if (pageTitle) {
//         const pageLoaded = () => {
//           const result: requestResultType = {
//             success: true,
//             message: `ページ読み込み:${pageTitle}`,
//             result: pageTitle,
//           }
//           return result
//         }

//         wrapWithLogging({pageLoaded}, session, ``)()
//       }
//     }
//   }, dependencies)
// }
