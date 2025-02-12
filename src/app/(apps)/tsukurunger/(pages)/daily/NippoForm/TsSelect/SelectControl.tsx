export const SelectControl = ({theOption, controlClass, ArrayIndex, handleOpen}) => {
  const {label, displayLabel} = theOption
  return (
    <div
      {...{
        onClick: () => {
          handleOpen({ArrayIndex})
        },
        className: `${controlClass} text-sm  p-0.5  w-[130px] truncate  `,
      }}
    >
      {label}
    </div>
  )
}
