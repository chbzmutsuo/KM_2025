import React from 'react'

export default function page() {
  return <div>page</div>
}

// 'use client'

// import {useEffect, useState} from 'react'
// import {useForm} from 'react-hook-form'
// import {z} from 'zod'
// import {zodResolver} from '@hookform/resolvers/zod'
// import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from 'src/components/ui/form'
// import {Button} from 'src/components/ui/button'
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from 'src/components/ui/select'
// import {Textarea} from 'src/components/ui/textarea'

// const resultFormSchema = z.object({
//   result: z.enum(['承認', '却下']),
//   comment: z.string().min(1, 'コメントを入力してください'),
// })

// type ResultFormValues = z.infer<typeof resultFormSchema>

// interface LeaveRequest {
//   id: string
//   startDate: string
//   endDate: string
//   leaveType: string
//   reason: string | null
//   requester: {
//     name: string
//   }
// }

// export default function LeaveResultPage() {
//   const [requests, setRequests] = useState<LeaveRequest[]>([])
//   const [loading, setLoading] = useState(true)

//   const form = useForm<ResultFormValues>({
//     resolver: zodResolver(resultFormSchema),
//     defaultValues: {
//       result: '承認',
//       comment: '',
//     },
//   })

//   useEffect(() => {
//     fetchRequests()
//   }, [])

//   const fetchRequests = async () => {
//     try {
//       const response = await fetch('/api/leave-requests/pending')
//       if (!response.ok) {
//         throw new Error('データの取得に失敗しました')
//       }
//       const data = await response.json()
//       setRequests(data)
//     } catch (error) {
//       console.error('Error:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const onSubmit = async (data: ResultFormValues) => {
//     try {
//       const response = await fetch('/api/leave-requests/approve', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       })

//       if (!response.ok) {
//         throw new Error('結果の更新に失敗しました')
//       }

//       // 成功時の処理
//       alert('結果を更新しました')
//       form.reset()
//       fetchRequests()
//     } catch (error) {
//       console.error('Error:', error)
//       alert('エラーが発生しました')
//     }
//   }

//   if (loading) {
//     return <div className="container mx-auto p-6">読み込み中...</div>
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="mb-6 text-2xl font-bold">有給結果入力</h1>

//       <div className="space-y-6">
//         {requests.map(request => (
//           <div key={request.id} className="rounded-lg border p-6">
//             <div className="mb-4 grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">申請者</p>
//                 <p>{request.requester.name}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">休暇区分</p>
//                 <p>{request.leaveType}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">開始日</p>
//                 <p>{new Date(request.startDate).toLocaleDateString('ja-JP')}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">終了日</p>
//                 <p>{new Date(request.endDate).toLocaleDateString('ja-JP')}</p>
//               </div>
//               <div className="col-span-2">
//                 <p className="text-sm text-gray-500">理由</p>
//                 <p>{request.reason || '-'}</p>
//               </div>
//             </div>

//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="result"
//                   render={({field}) => (
//                     <FormItem>
//                       <FormLabel>結果</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="結果を選択" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="承認">承認</SelectItem>
//                           <SelectItem value="却下">却下</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="comment"
//                   render={({field}) => (
//                     <FormItem>
//                       <FormLabel>コメント</FormLabel>
//                       <FormControl>
//                         <Textarea {...field} placeholder="コメントを入力してください" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <Button type="submit">結果を更新</Button>
//               </form>
//             </Form>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
