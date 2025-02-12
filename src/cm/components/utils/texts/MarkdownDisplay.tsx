import {cl} from 'src/cm/lib/methods/common'
import {CSSProperties} from 'react'
import ReactMarkdown from 'react-markdown'

export const MarkDownDisplay = props => {
  const {className, ...rest} = props
  if (!props.children) return <></>
  let text = props.children
  text = String(text).replace(/\n|\r/g, '\n\n')

  return (
    <ReactMarkdown
      {...{
        className: cl('react-markdown  ', className),
        ...rest,
      }}
    >
      {text}
    </ReactMarkdown>
  )
  return text.split('\n').map((line, i) => {
    const style: CSSProperties = {
      marginBottom: line === '' ? 20 : 0,
    }

    return (
      <div>
        <ReactMarkdown
          {...{
            className: cl('react-markdown ', className),
            style: {...style, ...rest.style},
            ...rest,
          }}
        >
          {line}
        </ReactMarkdown>
      </div>
    )
  })

  return text.split('<br/>').map((line, i) => {
    return (
      <ReactMarkdown className={cl('react-markdown pb-4', className)} {...rest}>
        {line}
      </ReactMarkdown>
    )
  })
  return (
    <div>
      <ReactMarkdown className={cl('react-markdown', className)} {...rest}>
        {text}
      </ReactMarkdown>
    </div>
  )
}

export const arrToLines = arr => {
  return arr.join('\n')
}

export const addMarkdownNotation = (props: {arr: string[]; prefix?: string; affix?: string}) => {
  const {arr, prefix, affix} = props
  const result = arr.map((d, i) => {
    return `${prefix ?? ''}${d}${affix ?? ''}\n`
  })

  return result
}
