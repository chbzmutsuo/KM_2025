import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@class/Fields/Fields'

import {PrismaModelNames} from '@cm/types/prisma-types'
import {allowCreateOptionsType, colType, forSelectConfig} from '@cm/types/types'
import {arrToLines, MarkDownDisplay} from '@components/utils/texts/MarkdownDisplay'

export const getStorageCols = () => {
  const cols1 = new Fields([
    {id: `createdAt`, label: `入荷日`, type: `date`, form: {defaultValue: new Date()}},
    ...chainAttributes([
      {...{id: 'sankoshaClientAId', label: 'お客様名'}, td: {style: {width: 110}}},
      {...{id: 'sankoshaClientBId', label: '物流センター'}},
      {...{id: 'sankoshaClientCId', label: '担当支店'}},
      {...{id: 'sankoshaClientDId', label: '販売店'}},
      {...{id: 'sankoshaClientEId', label: 'エンドユーザー'}},
    ]),
  ])

  return [...cols1.buildFormGroup({groupName: `入荷時情報`}).plain]
}

export const chainAttributes = (array: colType[]) => {
  return new Fields(array)
    .customAttributes(props => {
      const colId = props.col.id.replace(`Id`, '') as PrismaModelNames
      const colLabel = props.col.label
      const allowCreateOptions = getAllowCreateOptions(colId, colLabel)
      const config = getConfig(colId)
      const colProps = getColProps(props.col)

      const result = {
        ...props.col,
        ...colProps,
        forSelect: {
          dependenceColIds: [
            `sankoshaClientAId`,
            `sankoshaClientBId`,
            `sankoshaClientCId`,
            `sankoshaClientDId`,
            `sankoshaClientEId`,
          ],
          allowCreateOptions,
          config,
        },
      }

      return result
    })
    .aggregateOnSingleTd().plain
}

const getAllowCreateOptions = (colId: PrismaModelNames, colLabel: string) => {
  const allowCreateOptions: allowCreateOptionsType =
    colId === `sankoshaClientA`
      ? {}
      : {
          creator: () => {
            return {
              getCreatFormProps: props => {
                const columns = new Fields([
                  {
                    id: `sankoshaClientAId`,
                    label: `お客様`,
                    forSelect: {},
                    form: {
                      disabled: true,
                      defaultValue: props?.latestFormData?.sankoshaClientAId,
                      ...defaultRegister,
                    },
                  },
                  {
                    id: `name`,
                    label: colLabel,
                    form: {
                      defaultValue: props.searchFormData?.name,
                    },
                  },
                ]).transposeColumns()

                const formData = {}
                return {
                  columns,
                  formData,
                }
              },
            }
          },
        }

  return allowCreateOptions
}

const getConfig = (colId: PrismaModelNames) => {
  const config: forSelectConfig =
    colId === `sankoshaClientA`
      ? {modelName: `sankoshaClientA`}
      : {
          modelName: colId,
          messageWhenNoHit: `選択されているお客様に関連するデータのみが表示されます。`,
          where: props => {
            return {
              sankoshaClientAId: props.latestFormData.sankoshaClientAId ?? 0,
            }
          },
        }

  return config
}

export const getClientCommonColumnFields = () => {
  return {id: `name`, label: `名称`, form: {...defaultRegister}}
}
const getColProps = col => {
  const colProps =
    col.id === `sankoshaClientAId`
      ? {
          format: (value, row) => {
            const {SankoshaClientA, SankoshaClientB, SankoshaClientC, SankoshaClientD, SankoshaClientE} = row
            const nameArr = [SankoshaClientA, SankoshaClientB, SankoshaClientC, SankoshaClientD, SankoshaClientE]
              .filter(d => d?.name)
              .map((d, i) => {
                return `${d?.name}`
              })

            return <MarkDownDisplay className={`!leading-5`}>{arrToLines(nameArr)}</MarkDownDisplay>
          },
        }
      : {
          th: {hidden: true},
          td: {hidden: true},
        }

  return colProps
}
