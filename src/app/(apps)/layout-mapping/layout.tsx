import {PageBuilder} from '@app/(apps)/layout-mapping/builders/PageBuilder'
import Admin from '@cm/components/layout/Admin'

export default async function Groupie_Admin_Layout(props) {
  const {children} = props

  return (
    <Admin
      {...{
        AppName: 'テストアプリ',
        PagesMethod: 'layoutMapping_PAGES',
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
