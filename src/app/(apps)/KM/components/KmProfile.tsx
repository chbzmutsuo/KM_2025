import {Center} from '@components/styles/common-components/common-components'
import Image from 'next/image'

const KmProfile = () => {
  return (
    <Center className={`p-4 `}>
      <div>
        <div>
          <Image className={`rounded shadow`} alt={`プロフィール`} width={1600} height={1200} src={`/image/KM/profile.png`} />
        </div>
        <div>
          <Image
            className={`rounded shadow`}
            alt={`ご依頼までのプロセス`}
            width={1600}
            height={1200}
            src={`/image/KM/process.png`}
          />
        </div>
      </div>
    </Center>
  )
}

export default KmProfile
