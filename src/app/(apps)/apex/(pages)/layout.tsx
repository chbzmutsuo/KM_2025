import {Metadata} from 'next'


const AppName = `AIシミュレーション`

export const metadata: Metadata = {title: AppName}

export default async function ApexLayout({children}) {
  return (
    <div className={[`mx-auto p-2`].join(` `)}>
      <div className={` text-sub-main md:container    md:text-xl   `}>
        <div>{children}</div>
      </div>
    </div>
  )
}
