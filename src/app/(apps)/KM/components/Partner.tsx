'use client'
import {Kaizen} from '@app/(apps)/KM/class/Kaizen'
 

import {cl} from '@cm/lib/methods/common'
import {C_Stack, Flex, R_Stack} from '@components/styles/common-components/common-components'
import {ImageLabel} from '@components/styles/common-components/ImageLabel'
import Link from 'next/link'
import {Fragment} from 'react'

export const Partners = ({kaizenClient}) => {
  return (
    <C_Stack>
      <Flex
        {...{
          wrapperWidth: 1100,
          itemWidth: 300,

          items: kaizenClient.map((p, index) => {
            const {name, organization, website, KaizenWork} = p

            return (
              <Fragment key={index}>
                <Partner {...{p, index}} />
              </Fragment>
            )
          }),
        }}
      />
      {/* <R_Stack className={` items-stretch justify-around gap-6`}>
        {kaizenClient.map((p, index) => {
          const {name, organization, website, KaizenWork} = p

          return (
            <Fragment key={index}>
              <Partner {...{p, index}} />
            </Fragment>
          )
        })}
      </R_Stack> */}
    </C_Stack>
  )
}

export const PartnerBasicInfo = (props: {KaizenClient: any; showWebsite?: boolean}) => {
  const {KaizenClient, showWebsite = true} = props
  const {name, organization, website} = KaizenClient ?? {}
  return (
    <C_Stack className={`gap-0 leading-5`}>
      <R_Stack>
        <div>
          {organization && <span>{organization}</span>}
          <R_Stack className={`w-full justify-between`}>
            {name && <span>{name}</span>}
            <small>様</small>
          </R_Stack>
        </div>
      </R_Stack>
      {showWebsite && (
        <Link className={`text-sm`} target="_blank" href={website ?? ''}>
          {website ?? ''}
        </Link>
      )}
    </C_Stack>
  )
}

export const Partner = ({p, index}) => {
  return (
    <R_Stack
      className={cl(
        `  flex h-[80px] w-[350px]  max-w-[90vw] p-2  `,
        'rounded-md shadow-md',
        index % 2 === 0 ? 'bg-gray-50   ' : 'bg-gray-200   '
      )}
      style={{
        backgroundBlendMode: 'lighten',
        background: Kaizen.const.gradient.coolMiddle,
        color: 'white',
      }}
      key={index}
    >
      <div className={`w-[60px] `}>
        <ImageLabel
          {...{
            style: {width: 50},
            src: p?.iconUrl,
          }}
        />
      </div>

      <div className={``}>
        <PartnerBasicInfo {...{KaizenClient: p}} />
      </div>
    </R_Stack>
  )
}
