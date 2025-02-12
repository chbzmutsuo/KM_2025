import {Alert} from 'src/cm/components/styles/common-components/Alert'
import {XMarkIcon} from '@heroicons/react/20/solid'

export const SearchedItem = ({value, onClick, closeBtn = false}) => {
  return (
    <Alert color={`yellow`} className={` onHover w-fit p-0.5 py-0`} onClick={onClick}>
      <div className={`flex`}>
        {value}
        {closeBtn && <XMarkIcon className={` w-4`} />}
      </div>
    </Alert>
  )
}
