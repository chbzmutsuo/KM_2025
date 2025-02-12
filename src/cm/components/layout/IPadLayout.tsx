const IPadLayout = props => {
  const normal = {
    width: 1024,
    height: 768,
  }
  const pro = {
    width: 1366,
    height: 1024,
  }
  return (
    <div
      style={{
        ...normal,
        overflow: 'auto',
        margin: 'auto',
      }}
    >
      <div className={`controlBorderClass border-2`}>
        <div>{props.children}</div>
      </div>
    </div>
  )
}

export default IPadLayout
