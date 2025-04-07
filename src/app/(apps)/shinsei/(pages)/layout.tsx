import {PageBuilder} from '@app/(apps)/shinsei/(builders)/PageBuilder'
import Admin from '@cm/components/layout/Admin'

export default async function Layout(props) {
  const {children} = props

  // await doTransaction({
  //   transactionQueryList: [`吉田`, `部長A`, `統括A`, `役員`, `営業X`, `工場長`].map(name => {
  //     return {
  //       model: `user`,
  //       method: `upsert`,
  //       queryObject: {
  //         where: {email: name},
  //         create: {name, email: name, password: name, apps: [`shinsei`]},
  //         update: {name, email: name, password: name, apps: [`shinsei`]},
  //       },
  //     }
  //   }),
  // })

  return (
    <Admin
      {...{
        AppName: 'TEST',
        PagesMethod: 'shinsei_PAGES',
        PageBuilderGetter: {class: PageBuilder, getter: 'getGlobalIdSelector'},
      }}
    >
      <div>
        <div className={`p-2`}>{children}</div>
      </div>
    </Admin>
  )
}
