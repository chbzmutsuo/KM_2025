export {}

// 'use client'
// import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
// import React from 'react'
// import {Days, formatDate, getMidnight} from '@class/Days'
// import {CssString} from '@components/styles/cssString'
// import useModal from '@components/utils/modal/useModal'
// import {cl} from '@lib/methods/common'
// import {Button} from '@components/styles/common-components/Button'
// import BasicTabs from '@components/utils/tabs/BasicTabs'

// import {WorkRecordForm} from '@app/(apps)/yoshinari/(pages)/daily/WorkRecordForm'

// export default function HolidayCC({days, ysWorkRecord, ysHolidayRequest}) {
//   const {Modal, open: selectedRow, handleOpen} = useModal()
//   const today = getMidnight()

//   return (
//     <div className={`mx-auto max-w-md`}>
//       <Modal>
//         <BasicTabs
//           {...{
//             id: `daily-tab`,
//             TabComponentArray: [{label: '出勤', component: <WorkRecordForm {...{selectedRow}} />}],
//           }}
//         ></BasicTabs>
//       </Modal>
//       <div className={`mx-auto w-fit`}>
//         <NewDateSwitcher {...{monthOnly: true}} />
//       </div>
//       <div className={`sticky-table-wrapper t-paper mx-2 rounded-lg text-center`}>
//         <table className={cl(CssString.table.borderCerlls)}>
//           <thead>
//             <tr>
//               <th>日付</th>
//               <th>出勤</th>
//               <th>退勤</th>
//               <th>休憩</th>
//               <th>振替</th>
//               <th>申請</th>
//             </tr>
//           </thead>

//           <tbody>
//             {days.map((date, i) => {
//               const theLog = ysWorkRecord.find(theLog => Days.isSameDate(theLog.date, date))
//               const theRequest = ysHolidayRequest.find(theLog => Days.isSameDate(theLog.date, date))

//               const isToday = Days.isSameDate(date, today)
//               const requestStatus: any = {status: ``, color: ``}
//               if (theRequest?.ysApprovement?.every(d => d.status === '却下')) {
//                 requestStatus.status = '却下'
//                 requestStatus.color = 'red'
//               } else if (theRequest?.ysApprovement?.every(d => d.status === '承認')) {
//                 requestStatus.status = '承認'
//                 requestStatus.color = 'green'
//               } else if (theRequest) {
//                 requestStatus.status = '申請中'
//                 requestStatus.color = 'yellow'
//               }

//               return (
//                 <tr key={i} className={isToday ? 'bg-yellow-main' : ''} onClick={() => handleOpen({date, theLog, theRequest})}>
//                   <td width={30}>{formatDate(date, 'M/D(ddd)')}</td>
//                   <td>{formatDate(theLog?.from, 'HH:mm')}</td>
//                   <td>{formatDate(theLog?.to, 'HH:mm')}</td>
//                   <td>{theLog?.breakTime}</td>
//                   <td>{requestStatus.status && <Button color={requestStatus.color}>{requestStatus.status}</Button>}</td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
