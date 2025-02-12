export const adjustBasicFormProps = props => {
  const {alignMode = `col`, ControlOptions = {}, ...restProps} = props

  const wrapperClass = props.wrapperClass
    ? props.wrapperClass
    : alignMode === 'row'
    ? 'row-stack gap-0   !items-start   flex-wrap gap-5 gap-y-3'
    : 'col-stack  justify-center  gap-6'

  if (alignMode === 'row') {
    //4月23日(火)変更 GlobalIdSelectorの幅が狭いので、minHeightを削除
    ControlOptions.ControlStyle = {...ControlOptions?.ControlStyle, minHeight: undefined}
    ControlOptions.direction = 'horizontal'
  }

  return {
    ...restProps,
    alignMode,
    wrapperClass,
    ControlOptions,
  }
}
