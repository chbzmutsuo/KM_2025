import GenbaSelector from '@app/(apps)/tsukurunger/(parts)/GenbaSelector'
import {PageBuilder} from '@app/(apps)/tsukurunger/class/PageBuilder'
import Admin from '@cm/components/layout/Admin'

export default async function Groupie_Admin_Layout(props) {
  const {children} = props

  return (
    <>
      <Admin
        {...{
          AppName: '日報アプリ',
          PagesMethod: 'tsukurunger_PAGES',
          PageBuilderGetter: {class: PageBuilder, getter: 'getGlobalIdSelector'},
          additionalHeaders: [<GenbaSelector />],
        }}
      >
        <div>{children}</div>
      </Admin>
    </>
  )
}
