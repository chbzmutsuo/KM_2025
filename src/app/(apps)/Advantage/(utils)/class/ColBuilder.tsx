'use client'
import {Advantage} from '@app/(apps)/Advantage/(utils)/class/Advantage'
import {formatDate} from '@class/Days'
import {Fields} from '@class/Fields/Fields'
import {colType, columnGetterType} from '@cm/types/types'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import {Alert} from '@components/styles/common-components/Alert'
import {R_Stack} from '@components/styles/common-components/common-components'
import {PaperLarge} from '@components/styles/common-components/paper'
import {HREF} from '@cm/lib/methods/urls'

export class ColBuilder {
  static product = (props: columnGetterType & {dataModelName: string}) => {
    const col1: colType[] = [
      {
        id: 'name',
        label: '商品名',
        form: {register: {required: '必須です'}},
      },
      {
        id: 'price',
        label: '金額',
        type: 'price',
        form: {register: {required: '必須です'}},
      },
      {
        id: 'imageUrl',
        label: '商品名',
        type: 'file',
        form: {file: {backetKey: 'moll-product'}, register: {required: '必須です'}},
      },
      {
        id: 'description',
        label: '説明',
        type: 'textarea',

        form: {register: {required: '必須です'}, style: {width: 350}},
      },
    ]
    const data: colType[] = col1
    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }
  static systemChatRoom = (props: columnGetterType & {dataModelName: string}) => {
    const {useGlobalProps} = props
    const {query} = useGlobalProps ?? {}
    const col1: colType[] = [
      {
        id: 'userId',
        label: 'ユーザー',
        form: {},
        forSelect: {
          config: Advantage.const.optionConfigs.studentOptionsConfig(),
        },
        format: (value, row) => {
          return row?.User?.name
        },
      },
    ]
    const data: colType[] = col1
    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }
  static dynamicMasterModel = (props: columnGetterType & {dataModelName: string}) => {
    const col1: colType[] = [
      {id: 'name', label: '名称', form: {register: {required: '必須です'}}},
      {id: 'color', label: '色', type: 'color', form: {register: {required: '必須です'}}},
    ]
    const data: colType[] = col1
    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }
  static user = (props: columnGetterType) => {
    const data: colType[] = [
      {
        id: 'name',
        label: '氏名',
        form: {},
        search: {},
      },
      {
        id: 'email',
        label: 'メールアドレス',
        type: 'email',
        form: {},
      },
      {
        id: 'password',
        label: 'パスワード',
        type: 'password',
        form: {register: {required: '必須です'}},
      },

      {
        id: 'membershipName',
        label: '会員種別',
        forSelect: {
          optionsOrOptionFetcher: Advantage.const.userTypes,
        },
        form: {
          disabled: true,
          defaultValue: props?.ColBuilderExtraProps?.membershipName,
          register: {},
        },
      },
    ]
    return Fields.transposeColumns([...data], {...props.transposeColumnsOptions})
  }

  static ticket = (props: columnGetterType) => {
    const {
      useGlobalProps: {accessScopes},
    } = props
    const {inLessonPage} = props?.ColBuilderExtraProps ?? {}
    const AdvantageScope = accessScopes().getAdvantageProps()

    const data: colType[] = [
      ...(inLessonPage
        ? []
        : [
            {
              id: 'LessonLog.Lesson.MiddleCategory.BigCategory.name',
              label: 'レッスン',
              form: {disabled: true},
            },
            {id: 'LessonLog.Lesson.MiddleCategory.name', label: 'レッスン', form: {disabled: true}},
            {id: 'LessonLog.Lesson.name', label: 'レッスン', form: {disabled: true}},
            {id: 'userId', label: 'ユーザー', forSelect: {}, form: {disabled: true}},
          ]),
      {id: 'createdAt', label: '購入日', type: 'date', format: value => formatDate(value, 'M/D')},
      {
        id: 'payedAt',
        label: '入金日',
        type: 'date',
        form: AdvantageScope.isCoach ? {} : undefined,
        format: (value, row, col) => {
          const date = row[col.id]
          return date && <Alert color={date ? 'green' : 'red'}>{formatDate(date ?? '未入金', 'M/D')}</Alert>
        },
      },
      {
        id: 'usedAt',
        label: '利用日',
        type: 'date',
        form: AdvantageScope.isCoach ? {} : undefined,
        format: (value, row, col) => {
          const date = row[col.id]
          return date && <Alert color={date ? 'sub' : 'green'}>{formatDate(date ?? '未使用', 'M/D')}</Alert>
        },
      },
      {id: 'type', label: '備考', form: {}},
    ]
    return Fields.transposeColumns([...data], {...props.transposeColumnsOptions})
  }

  static lesson = (props: columnGetterType) => {
    const data: colType[] = [
      {
        id: 'name',
        label: 'レッスン名',
        form: {register: {required: '必須です'}},
        td: {
          style: {
            width: 150,
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: 18,
          },
          getRowColor: (value, row) => {
            return 'white'
            return row.MiddleCategory?.BigCategory?.color
          },
        },
      },
      {
        id: 'description',
        label: '詳細説明',
        type: 'textarea',
        form: {},
        td: {style: {width: 400}},
      },
    ]
    return Fields.transposeColumns([...data], {...props.transposeColumnsOptions})
  }
  static lessonImage = (props: columnGetterType) => {
    const data: colType[] = [
      {
        id: 'name',
        label: '画像/動画名',
        td: {style: {width: 100}},
        form: {register: {required: '必須です'}},
      },
      {
        id: 'description',
        label: '詳細説明',
        td: {style: {width: 300}},
        type: 'textarea',
        form: {register: {required: '必須です'}},
      },
      {
        id: 'url',
        type: 'file',
        label: '画像/動画',
        form: {
          register: {},
          file: {
            accept: {
              'video/mp4': ['.mov', '.mp4', '.mpeg'],
              'image/jpeg': ['.jpg', '.jpeg', '.png'],
            },
            backetKey: 'lessonImage',
          },
        },
      },
    ]
    return Fields.transposeColumns([...data], {...props.transposeColumnsOptions})
  }
  static lessonLog = (props: columnGetterType) => {
    const data: colType[] = [
      {
        id: 'userId',
        label: 'ユーザー',
        forSelect: {},
        td: {
          linkTo: {
            href: record => {
              return HREF(`/Advantage/lessonLog/${record?.id}`, {}, props.useGlobalProps.query)
            },
          },
        },
      },
      {
        id: 'Lesson.MiddleCategory.BigCategory.name',
        label: '大ジャンル',
      },
      {
        id: 'Lesson.MiddleCategory.name',
        label: '中ジャンル',
      },
      {
        id: 'lessonId',
        label: 'レッスン名称',
        forSelect: {},
      },

      {
        id: 'userId',
        label: 'ユーザー名',
        forSelect: {
          config: Advantage.const.optionConfigs.studentOptionsConfig(),
        },
        form: {},
        td: {hidden: true},
      },
      {
        id: 'createdAt',
        label: '申込日',
        type: 'date',
      },
      {
        id: 'isPaid',
        label: '入金済み',
        type: 'boolean',
        form: {},
      },

      {
        id: 'isPassed',
        label: '合否',
        type: 'boolean',
        form: {},
      },
      {
        id: 'authorizerUser',
        label: '承認者',
        format: (value, row) => {
          const {LessonLogAuthorizedUser} = row
          return (
            <R_Stack>
              {LessonLogAuthorizedUser?.filter(log => log.active).map(log => (
                <div key={log.id} className={`icon-btn bg-primary-main text-white`}>
                  {log.User.name}
                </div>
              ))}
            </R_Stack>
          )
        },
      },
    ]
    return Fields.transposeColumns([...data], {...props.transposeColumnsOptions})
  }

  static middleCategory = (props: columnGetterType) => {
    const {query} = props.useGlobalProps
    const data: colType[] = [
      {
        id: 'name',
        label: '中カテゴリ名',
        form: {register: {required: '必須です'}},
        td: {
          getRowColor: (value, row) => {
            return 'white'
            return row.BigCategory.color
          },
          style: {fontWeight: 'bold', fontSize: 20, width: 150},
        },
      },
      {
        id: 'lessons',
        label: 'レッスン詳細',

        format: (value, row) => {
          const dataModelName = 'middleCategory'
          const ParentData = row

          return (
            <PaperLarge style={{margin: 0, background: '#ffffff'}}>
              <ChildCreator
                {...{
                  ParentData: ParentData,
                  models: {
                    parent: dataModelName,
                    children: 'lesson',
                  },

                  columns: ColBuilder.lesson(props),
                  allow: {create: {label: 'レッスン'}, header: false},
                  additional: {
                    where: {middleCategoryId: ParentData?.id},
                  },
                  styles: {stripedTableRow: false},
                  nonRelativeColumns: [],
                  onEditFunction: {},
                  useGlobalProps: props.useGlobalProps,
                  myForm: undefined,
                  myTable: {header: false},
                  editType: {
                    type: 'page',
                    pathnameBuilder: ({record, pathname, rootPath}) => {
                      return HREF(`/Advantage/lesson/${record?.id}`, {}, query)
                    },
                  },
                }}
              />
            </PaperLarge>
          )
        },
      },
    ]

    return Fields.transposeColumns([...data], {...props.transposeColumnsOptions})
  }
  static bigCategory = (props: columnGetterType) => {
    const data: colType[] = [
      {
        id: 'name',
        label: '大カテゴリ名',
        form: {register: {required: '必須です'}},
        format: value => <div className={`text-2xl font-bold`}>{value}</div>,
        td: {
          getRowColor: (value, row) => {
            return 'white'
            return row.color
          },
        },
      },

      {
        id: 'color',
        label: 'カラー',
        type: 'color',
        td: {hidden: true},
        form: {register: {required: '必須です'}},
      },

      {
        id: 'MiddleCategory',
        label: '中カテゴリ',
        format: (value, row) => {
          const dataModelName = 'bigCategory'
          const ParentData = row

          return (
            <PaperLarge style={{margin: 0, background: '#ffffff'}}>
              <ChildCreator
                {...{
                  ParentData: ParentData,
                  models: {
                    parent: 'bigCategory',
                    children: 'middleCategory',
                  },
                  columns: ColBuilder.middleCategory(props),
                  allow: {
                    create: {label: '中カテゴリ'},
                    header: false,
                  },
                  additional: {
                    where: {bigCategoryId: ParentData?.id},
                    include: {BigCategory: {}},
                  },
                  styles: {stripedTableRow: false},
                  nonRelativeColumns: [],
                  onEditFunction: {},
                  useGlobalProps: props.useGlobalProps,
                  myForm: undefined,
                  myTable: {header: false},
                }}
              />
            </PaperLarge>
          )
        },
      },
    ]
    return Fields.transposeColumns([...data], {...props.transposeColumnsOptions})
  }
  static lessonLogAuthorizedUser = (props: columnGetterType) => {
    const data: colType[] = [
      {
        id: 'userId',
        label: 'コーチ',
        forSelect: {},
        form: {defaultValue: props?.ColBuilderExtraProps?.userId, disabled: true},
      },
      {
        id: 'comment',
        label: '合格コメント',
        type: 'textarea',
        form: {},
      },
    ]
    return Fields.transposeColumns([...data], {...props.transposeColumnsOptions})
  }
}
