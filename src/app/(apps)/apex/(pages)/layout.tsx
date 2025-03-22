import {Metadata} from 'next'
import Image from 'next/image'

import {Center} from '@components/styles/common-components/common-components'
import Link from 'next/link'

const AppName = `AIシミュレーション`

export const metadata: Metadata = {title: AppName}

export default async function ApexLayout({children}) {
  return (
    <div className={[`mx-auto max-w-[480px]`].join(` `)}>
      <div>
        <Center>
          <Link href={`/apex`}>
            <Image src={'/apex/header.png'} width={470} height={100} alt="" />
          </Link>
        </Center>
      </div>
      <div className={` text-sub-main `}>
        <div>{children}</div>
      </div>
    </div>
  )
}
