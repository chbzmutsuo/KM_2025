'use client'
import * as React from 'react'
import {useForm} from 'react-hook-form'

const Form = React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>(({className, ...props}, ref) => {
  return <form ref={ref} {...props} />
})
Form.displayName = 'Form'

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => {
  return <div ref={ref} className="space-y-2" {...props} />
})
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({className, ...props}, ref) => {
    return <label ref={ref} className="text-sm font-medium" {...props} />
  }
)
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({...props}, ref) => {
  return <div ref={ref} {...props} />
})
FormControl.displayName = 'FormControl'

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({className, children, ...props}, ref) => {
    const {
      formState: {errors},
    } = useForm()
    if (!errors) return null

    return (
      <p ref={ref} className="text-sm text-red-500" {...props}>
        {children}
      </p>
    )
  }
)
FormMessage.displayName = 'FormMessage'

const FormField = ({name, ...props}: {name: string} & React.HTMLAttributes<HTMLDivElement>) => {
  const {register} = useForm() ?? {}

  return <div {...register(name)} {...props} />
}

export {Form, FormItem, FormLabel, FormControl, FormMessage, FormField}
