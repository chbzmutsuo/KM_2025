import {ModelBuilder} from '@app/(apps)/Advantage/(utils)/class/ModelBuilder'
import {PageBuilder} from '@app/(apps)/Advantage/(utils)/class/PageBuilder'
import Admin from '@cm/components/layout/Admin'

export default async function AdminLayout(props) {
  const {children} = props
  return (
    <Admin
      {...{
        AppName: 'Advantage',
        PagesMethod: 'Advantage_PAGES',
        PageBuilderGetter: {class: PageBuilder, getter: 'getGlobalIdSelector'},
        ModelBuilder,
      }}
    >
      <div>{children}</div>
    </Admin>
  )
}
