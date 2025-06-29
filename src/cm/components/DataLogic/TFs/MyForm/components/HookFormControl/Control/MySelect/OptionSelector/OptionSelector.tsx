'use client'

import {C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'

import {optionType} from 'src/cm/class/Fields/col-operator-types'

import {contextsType} from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/my-select-types'
import {SelectOption} from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/OptionSelector/SelectOption'
import {useSearchForm} from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/Search/OptionSearcher/useSearchForm'
// import Accordion from 'src/cm/components/utils/Accordions/Accordion'
import CreateForm from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/Create/CreateForm'
import OptionSearcher from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/Search/OptionSearcher/OptionSearcher'
import {useEffect, useState} from 'react'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@app/components/ui/accordion'

import {MagnifyingGlassIcon} from '@heroicons/react/20/solid'
export const optionTakeCount = 20
const OptionSelector = (props: {contexts: contextsType}) => {
  const contexts = props.contexts

  const {
    isOptionsVisible,
    setIsOptionsVisible,
    filteredOptions,
    allowCreateOptions,
    messageWhenNoHit,
    setFilteredOptions,
    options,
    selectId,
  } = contexts.MySelectContextValue

  const ctxValue = contexts.controlContextValue
  const {col, useResetValue, field, currentValue} = ctxValue

  const optionsISFromArray = Array.isArray(col?.forSelect?.optionsOrOptionFetcher)

  const optionWidth = (col?.forSelect?.option?.style.width ?? 220) as number

  const nohit = filteredOptions?.length === 0
  const creatable = !!allowCreateOptions

  const SearchFormHook = useSearchForm({contexts})
  useEffect(() => {
    setFilteredOptions(options ?? [])
  }, [options, isOptionsVisible])

  const accordionTriggerClass = `rounded-sm  bg-primary-main/80 px-2 py-1 text-white`

  const [openAccodionIndex, setOpenAccodionIndex] = useState<string>(`1`)
  useEffect(() => {
    if (nohit && allowCreateOptions) {
      setOpenAccodionIndex(`2`)
    }
  }, [nohit])

  return (
    <>
      <Accordion
        type="single"
        collapsible={false}
        // defaultValue="item-1"
        value={openAccodionIndex}
        onValueChange={setOpenAccodionIndex}
      >
        <AccordionItem value="1">
          {allowCreateOptions && <AccordionTrigger className={accordionTriggerClass}>検索</AccordionTrigger>}

          <AccordionContent>
            <section className={`p-2 `}>
              <OptionSearcher {...{SearchFormHook, contexts, optionsISFromArray, allowCreateOptions}} />
              {nohit && <small>{messageWhenNoHit}</small>}
              <C_Stack className={`max-h-[35vh] items-center  overflow-auto p-2 `}>
                {/* {!isNaN(currentValue) && currentValue && ( */}
                <button
                  className={`onHover text-gray-500`}
                  onClick={() => {
                    useResetValue({col, field})
                    setIsOptionsVisible(false)
                  }}
                >
                  選択解除
                </button>
                {/* )} */}

                <C_Stack className={` gap-3`}>
                  {filteredOptions?.map((option: optionType, i) => {
                    const optionStyle = col?.forSelect?.option?.style ?? {width: optionWidth}

                    return (
                      <div key={i}>
                        <SelectOption {...{option, contexts, optionStyle}} />
                      </div>
                    )
                  })}
                </C_Stack>
                <div>
                  {!optionsISFromArray && options?.length >= optionTakeCount && (
                    <div className=" text-sm text-gray-500">
                      <C_Stack className={`gap-0`}>
                        <R_Stack className={`gap-0`}>
                          <span>続きを表示するには</span>
                        </R_Stack>
                        <R_Stack className={`gap-0`}>
                          <span>検索してください</span>
                          <MagnifyingGlassIcon className={`h-4 w-4`} />
                        </R_Stack>
                      </C_Stack>
                    </div>
                  )}
                </div>
              </C_Stack>
            </section>
          </AccordionContent>
        </AccordionItem>
        {allowCreateOptions && (
          <AccordionItem value="2">
            <AccordionTrigger className={accordionTriggerClass}>新規作成</AccordionTrigger>
            <AccordionContent>
              <div className={`max-h-[35vh] overflow-y-scroll `}>
                <div className={`p-4`}>
                  <CreateForm {...{SearchFormHook, contexts}} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      {/* <div style={{maxHeight: maxHieghts.wrapper}}>
        <section
          className={` relative  min-w-[180px]  `}
          style={{
            overflow: `auto`,
            maxHeight: maxHieghts.options,
          }}
        >

          <Flex
            {...{
              wrapperWidth: 900,
              gapPixel: `10px 4px`,
              direction: alignment?.direction ?? 'row',
              itemWidth: optionWidth,
              items: [
                ...filteredOptions?.map((option: optionType, i) => {
                  const optionStyle = col?.forSelect?.option?.style ?? {width: optionWidth}

                  return (
                    <div key={i}>
                      <SelectOption {...{option, contexts, optionStyle}} />
                    </div>
                  )
                }),
              ],
            }}
          />
        </section>
      </div> */}
    </>
  )
}

export default OptionSelector
