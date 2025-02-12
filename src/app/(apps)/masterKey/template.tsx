'use client'
import useMasterkeyDisplayedContents from '@app/(apps)/masterKey/lib/useMasterkeyDisplayedContents'
import useTargetMasterKeyClientIds from '@app/(apps)/masterKey/lib/useTargetMasterKeyClientIds'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack, Flex, R_Stack} from '@components/styles/common-components/common-components'
import {IconBtn} from '@components/styles/common-components/IconBtn'
import GlobalAccordion from '@components/utils/Accordions/GlobalAccordion'
import BasicModal from '@components/utils/modal/BasicModal'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {jotai_masterKeyDisplayedContentsSelector, useJotai} from '@hooks/useJotai'

import React from 'react'

export default function Template({children}) {
  const {query, session, addQuery} = useGlobal()
  const {ClientIdJQ, clients} = useTargetMasterKeyClientIds()
  const {displayedContentsMaster, displayedContents, setdisplayedContents, toggle} = useMasterkeyDisplayedContents()
  const accordionWrapperClass = `bg-blue-main border-blue-main border-double border-4  p-0 `

  const [masterKeyDisplayedContentsSelector, setmasterKeyDisplayedContentsSelector] = useJotai(
    jotai_masterKeyDisplayedContentsSelector
  )

  return (
    <div className={`p-2`}>
      <R_Stack className={` flex-nowrap items-start`}>
        <section className={``}>
          <GlobalAccordion
            {...{
              id: `masterKeyDisplayedContentsSelector`,
              styling: {
                classes: {
                  wrapper: accordionWrapperClass,
                  label: `bg-blue-main text-white !text-base !p-0`,
                },
              },
              label: `表示データ絞り込み`,
            }}
          >
            <C_Stack>
              {/* 求人、募集セレクタ */}
              <section>
                <R_Stack>
                  {displayedContentsMaster.map(d => {
                    const isActive = displayedContents.includes(d.id)
                    const onClick = async () => toggle(d.id)

                    return (
                      <Button onClick={onClick} active={isActive} key={d.id}>
                        {d.label}
                      </Button>
                    )
                  })}
                </R_Stack>
              </section>
            </C_Stack>
          </GlobalAccordion>
        </section>

        <section>
          <R_Stack onClick={() => setmasterKeyDisplayedContentsSelector(true)}>
            <strong>表示中のクライアント:</strong>
            {clients
              .filter(client => ClientIdJQ.checkIsActive({modelData: client}))
              .map(client => {
                return (
                  <IconBtn color={`blue`} key={client.id}>
                    {client.name}
                  </IconBtn>
                )
              })}
          </R_Stack>

          <BasicModal
            {...{open: masterKeyDisplayedContentsSelector, handleClose: () => setmasterKeyDisplayedContentsSelector(false)}}
          >
            <section>
              <Flex
                {...{
                  itemWidth: 200,
                  items: clients.map(client => {
                    const isActive = ClientIdJQ.checkIsActive({modelData: client})
                    const onClick = async () => {
                      const newQuery = ClientIdJQ.buildQueryStr({modelData: client})

                      addQuery({masterKeyClientIds: newQuery}, `push`, true)
                    }
                    return (
                      <Button className={`w-[190px] truncate  text-start`} onClick={onClick} active={isActive} key={client.id}>
                        {client.name}
                      </Button>
                    )
                  }),
                }}
              ></Flex>
            </section>
          </BasicModal>
        </section>
      </R_Stack>
      {children}
    </div>
  )
}
