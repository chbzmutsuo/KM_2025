export default function NotAvailable(props: {isAvailable?: boolean; reason?: any; alertOnClick?: string; children}) {
  const {isAvailable = false, reason, alertOnClick, children} = props
  if (isAvailable) {
    return <>{children}</>
  } else {
    return (
      <div
        className={` relative w-full`}
        onClick={e => {
          e.preventDefault()
          if (alertOnClick) {
            return alert(alertOnClick)
          }
        }}
      >
        <div className={`t-alert border-sub-main    bg-sub-light pointer-events-none opacity-30`}>{children}</div>
        <div className={`absolute-center    w-full  bg-opacity-100`}>
          <div className={` mx-auto w-fit`}>{reason ?? <p className={`text-error-main `}>現在利用できません</p>}</div>
        </div>
      </div>
    )
  }
}
