import {Metadata} from 'next'
import Image from 'next/image'

import {Zen_Old_Mincho} from 'next/font/google'

import {Center, Padding} from '@components/styles/common-components/common-components'
import Link from 'next/link'

const font = Zen_Old_Mincho({
  weight: ['400', '500', '600', '700', '900'],
  style: 'normal',
  subsets: ['latin', 'latin-ext'],
})

const AppName = ``

export const metadata: Metadata = {title: AppName}

export default async function ApexLayout({children}) {
  return (
    <div className={[font.className].join(` `)}>
      <Padding>
        <Center>
          <Link href={`/apex`}>
            <Image className={`rounded-full`} src={'/apex/header.png'} width={450} height={100} alt="" />
          </Link>
        </Center>
      </Padding>
      <div className={` text-sub-main `}>
        <div>{children}</div>
      </div>
    </div>
  )
}
