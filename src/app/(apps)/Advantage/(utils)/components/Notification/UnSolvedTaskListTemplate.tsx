import {Alert} from '@components/styles/common-components/Alert'

const UnSolvedTaskListTemplate = ({data, query}) => {
  return (
    <div>
      {data.length === 0 && (
        <Alert color="blue" className={`text-center`}>
          未解決のコメントはありません
        </Alert>
      )}

      <div className={`sticky-table-wrapper  max-h-[400px]  text-center`}>
        <table>
          <thead>
            <tr>
              {data[0]?.map((v, idx) => {
                const {label} = v
                return <th key={idx}>{label}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((array, idx) => {
              return (
                <tr key={idx}>
                  {array.map((v, idx) => {
                    const {label, value} = v
                    return <td key={idx}>{value}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UnSolvedTaskListTemplate
