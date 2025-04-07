import React from 'react'

export default function page() {
  return <div>page</div>
}

// 'use client'

// import {useForm} from 'react-hook-form'
// import {z} from 'zod'
// import {zodResolver} from '@hookform/resolvers/zod'
// import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from 'src/components/ui/form'
// import {Button} from 'src/components/ui/button'
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from 'src/components/ui/select'
// import {Textarea} from 'src/components/ui/textarea'

// const leaveFormSchema = z.object({
//   startDate: z.string().min(1, '開始日を選択してください'),
//   endDate: z.string().min(1, '終了日を選択してください'),
//   leaveType: z.enum(['1日', '年休休', '午後休', '特別休暇', '慶弔休暇', '産前産後休暇', '代休', '欠勤', '早退', '遅刻']),
//   reason: z.string().optional(),
// })

// type LeaveFormValues = z.infer<typeof leaveFormSchema>

// export default function LeaveRequestPage() {
//   const form = useForm<LeaveFormValues>({
//     resolver: zodResolver(leaveFormSchema),
//     defaultValues: {
//       startDate: '',
//       endDate: '',
//       leaveType: '1日',
//       reason: '',
//     },
//   })

//   const onSubmit = async (data: LeaveFormValues) => {
//     try {
//       const response = await fetch('/api/leave-requests', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       })

//       if (!response.ok) {
//         throw new Error('申請の送信に失敗しました')
//       }

//       // 成功時の処理
//       alert('申請を送信しました')
//       form.reset()
//     } catch (error) {
//       console.error('Error:', error)
//       alert('エラーが発生しました')
//     }
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="mb-6 text-2xl font-bold">有給申請フォーム</h1>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="startDate"
//             render={({field}) => (
//               <FormItem>
//                 <FormLabel>開始日</FormLabel>
//                 <FormControl>
//                   <input
//                     type="date"
//                     {...field}
//                     className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="endDate"
//             render={({field}) => (
//               <FormItem>
//                 <FormLabel>終了日</FormLabel>
//                 <FormControl>
//                   <input
//                     type="date"
//                     {...field}
//                     className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="leaveType"
//             render={({field}) => (
//               <FormItem>
//                 <FormLabel>休暇区分</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="休暇区分を選択" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="1日">1日</SelectItem>
//                     <SelectItem value="年休休">年休休</SelectItem>
//                     <SelectItem value="午後休">午後休</SelectItem>
//                     <SelectItem value="特別休暇">特別休暇</SelectItem>
//                     <SelectItem value="慶弔休暇">慶弔休暇</SelectItem>
//                     <SelectItem value="産前産後休暇">産前産後休暇</SelectItem>
//                     <SelectItem value="代休">代休</SelectItem>
//                     <SelectItem value="欠勤">欠勤</SelectItem>
//                     <SelectItem value="早退">早退</SelectItem>
//                     <SelectItem value="遅刻">遅刻</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="reason"
//             render={({field}) => (
//               <FormItem>
//                 <FormLabel>理由</FormLabel>
//                 <FormControl>
//                   <Textarea {...field} placeholder="申請理由を入力してください" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button type="submit">送信</Button>
//         </form>
//       </Form>
//     </div>
//   )
// }
