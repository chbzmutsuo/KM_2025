import {PageBuilder} from '@app/(apps)/sohken/class/PageBuilder'
import Admin from '@cm/components/layout/Admin'

export default async function Groupie_Admin_Layout(props) {
  const {children} = props

  return (
    <Admin
      {...{
        AppName: '工程管理',
        PagesMethod: 'sohken_PAGES',
        PageBuilderGetter: {class: PageBuilder, getter: 'getGlobalIdSelector'},
      }}
    >
      <div>
        <div>{children}</div>
      </div>
    </Admin>
  )
}
