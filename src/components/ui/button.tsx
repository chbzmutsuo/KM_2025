import * as React from 'react'

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({className, ...props}, ref) => {
    return (
      <button
        className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export {Button}
