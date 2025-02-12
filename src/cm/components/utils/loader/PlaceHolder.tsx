export default function PlaceHolder(props: {children?: any}) {
  return (
    <div
      data-placeholder=""
      className="AlignJustCenter relative mb-2 min-h-8  animate-pulse overflow-hidden rounded-md  bg-gray-300/80 "
    >
      {props.children}
    </div>
  )
}
