import {PageBuilder} from '../(builders)/PageBuilder'
import Admin from '@cm/components/layout/Admin/Admin'

export default async function AppLayout(props) {
  const {children} = props

  return (
    <Admin
      {...{
        AppName: '健康管理',
        PagesMethod: 'health_PAGES',
        PageBuilderGetter: {class: PageBuilder, getter: 'getGlobalIdSelector'},
      }}
    >
      <div>
        {/* <Tasks /> */}
        <div>{children}</div>
      </div>
    </Admin>
  )
}
