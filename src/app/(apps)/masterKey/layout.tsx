import Admin from '@cm/components/layout/Admin'

export default async function MasterKey_Layout(props) {
  const {children} = props

  return (
    <Admin
      {...{
        AppName: 'アプリデモ',
        PagesMethod: 'MasterKey_Pages',
        // PageBuilderGetter: {class: PageBuilder, getter: 'getGlobalIdSelector'},
      }}
    >
      <div>
        {/* <Tasks /> */}
        <div>{children}</div>
      </div>
    </Admin>
  )
}
