// import * as React from 'react'

// interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   onValueChange?: (value: string) => void
// }

// const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({className, children, onValueChange, ...props}, ref) => {
//   return (
//     <select
//       className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//       ref={ref}
//       onChange={e => onValueChange?.(e.target.value)}
//       {...props}
//     >
//       {children}
//     </select>
//   )
// })
// Select.displayName = 'Select'

// const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
//   ({className, children, ...props}, ref) => {
//     return (
//       <div ref={ref} className="relative" {...props}>
//         {children}
//       </div>
//     )age
//   }
// )
// SelectTrigger.displayName = 'SelectTrigger'

// const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
//   ({className, children, ...props}, ref) => {
//     return (
//       <span ref={ref} className="block truncate" {...props}>
//         {children}
//       </span>
//     )
//   }
// )
// SelectValue.displayName = 'SelectValue'

// const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
//   ({className, children, ...props}, ref) => {
//     return (
//       <div
//         ref={ref}
//         className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
//         {...props}
//       >
//         {children}
//       </div>
//     )
//   }
// )
// SelectContent.displayName = 'SelectContent'

// const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {value: string}>(
//   ({className, children, value, ...props}, ref) => {
//     return (
//       <option
//         ref={ref}
//         className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100"
//         data-value={value}
//         {...props}
//       >
//         {children}
//       </option>
//     )
//   }
// )
// SelectItem.displayName = 'SelectItem'

// export {Select, SelectTrigger, SelectValue, SelectContent, SelectItem}
