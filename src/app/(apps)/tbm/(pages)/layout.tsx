import {PageBuilder} from '@app/(apps)/tbm/(builders)/PageBuilders/PageBuilder'
import Admin from '@cm/components/layout/Admin'

export default async function Groupie_Admin_Layout(props) {
  const {children} = props

  return (
    <Admin
      {...{
        AppName: '',
        PagesMethod: 'tbm_PAGES',
        PageBuilderGetter: {class: PageBuilder, getter: 'getGlobalIdSelector'},
      }}
    >
      <div>
        <div>{children}</div>
      </div>
    </Admin>
  )
}
