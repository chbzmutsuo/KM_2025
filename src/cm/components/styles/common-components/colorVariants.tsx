export type colorVariants = '' | 'red' | 'blue' | 'green' | 'yellow' | 'sub' | 'primary' | 'gray' | 'orange'
export const colorClassMaster = {
  base: {
    gray: 'bg-gray-100 border-gray-400 text-gray-800',
    red: 'bg-red-50 border-red-400 text-sub-main',
    blue: 'bg-sky-50 border-sky-700 text-sub-main',
    green: 'bg-green-50 border-green-600 text-sub-main',
    orange: 'bg-orange-50 border-orange-400 text-sub-main',
    yellow: 'bg-yellow-50 border-yellow-400 text-sub-main',
    sub: 'bg-sub-light border-sub-main text-sub-main',
    primary: 'bg-primary-light border-primary-main text-sub-main',
  },
  btn: {
    gray: 'bg-gray-main text-white',
    red: 'bg-error-main text-white',
    blue: 'bg-blue-main text-white',
    green: 'bg-green-main text-white',
    orange: 'bg-orange-main text-white',
    yellow: 'bg-yellow-main text-sub-main',
    sub: 'bg-sub-main text-white',
    primary: 'bg-primary-main text-white',
  },
  text: {
    gray: 'text-gray-500 ',
    red: 'text-error-main',
    blue: 'text-blue-main',
    green: 'text-green-main',
    orange: 'text-orange-600',
    yellow: 'text-yellow-main ',
    sub: 'text-sub-main',
    primary: 'text-primary-main',
  },
}
