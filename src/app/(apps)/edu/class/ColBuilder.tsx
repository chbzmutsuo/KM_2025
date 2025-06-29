'use client'

import {Grouping, ClassRoom} from '@app/(apps)/edu/class/Grouping'

import {colType, columnGetterType} from '@cm/types/types'

import {formatDate} from '@class/Days/date-utils/formatters'
import MemberViwer from '@cm/components/List/MemberViwer'
import {Fields} from '@cm/class/Fields/Fields'
import {addQuerySentence} from '@cm/lib/methods/urls'
import {doStandardPrisma} from '@lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'

import {Button} from '@components/styles/common-components/Button'

export class ColBuilder {
  static slide = (props: columnGetterType) => {
    const {useGlobalProps} = props
    const {session, query, router, rootPath, addQuery} = useGlobalProps

    const data: colType[] = [
      {
        id: 'title',
        label: 'スライドタイトル',
        form: {register: {required: '必須です'}},
        search: {},
      },
      {
        id: 'templateType',
        label: 'テンプレート',
        forSelect: {
          optionsOrOptionFetcher: [
            {value: 'normal', label: 'ノーマル'},
            {value: 'psychology', label: '心理アンケート'},
            {value: 'choice_quiz', label: '選択クイズ'},
            {value: 'free_text_quiz', label: '自由記述クイズ'},
            {value: 'summary_survey', label: 'まとめアンケート'},
          ],
        },
        form: {register: {required: '必須です'}},
        search: {},
      },
      {
        id: 'isActive',
        label: '現在表示中',
        type: 'boolean',
        format: value => (
          <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {value ? '表示中' : '非表示'}
          </span>
        ),
      },
      {
        id: 'sortOrder',
        label: '順序',
        type: 'number',
        form: {},
        td: {style: {width: 80}},
      },
      {
        id: 'actions',
        label: '操作',
        format: (value, row) => (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => router.push(`${rootPath}/slide/edit/${row.id}`)}>
              編集
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                await doStandardPrisma('slide', 'update', {
                  where: {id: row.id},
                  data: {isActive: !row.isActive},
                })
                router.refresh()
              }}
            >
              {row.isActive ? '非表示' : '表示'}
            </Button>
          </div>
        ),
        td: {style: {width: 150}},
      },
    ]

    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }

  static slideBlock = (props: columnGetterType) => {
    const data: colType[] = [
      {
        id: 'blockType',
        label: 'ブロック種別',
        forSelect: {
          optionsOrOptionFetcher: [
            {value: 'text', label: 'テキスト'},
            {value: 'image', label: '画像'},
            {value: 'link', label: 'リンク'},
            {value: 'quiz_question', label: 'クイズ問題'},
            {value: 'choice_option', label: '選択肢'},
          ],
        },
        form: {register: {required: '必須です'}},
      },
      {
        id: 'content',
        label: 'コンテンツ',
        type: 'textarea',
        form: {style: {minWidth: 300}},
      },
      {
        id: 'imageUrl',
        label: '画像URL',
        type: 'url',
        form: {},
      },
      {
        id: 'linkUrl',
        label: 'リンクURL',
        type: 'url',
        form: {},
      },
      {
        id: 'alignment',
        label: '配置',
        forSelect: {
          optionsOrOptionFetcher: [
            {value: 'left', label: '左寄せ'},
            {value: 'center', label: '中央'},
            {value: 'right', label: '右寄せ'},
          ],
        },
        form: {},
      },
      {
        id: 'textColor',
        label: 'テキスト色',
        type: 'color',
        form: {},
      },
      {
        id: 'backgroundColor',
        label: '背景色',
        type: 'color',
        form: {},
      },
      {
        id: 'fontWeight',
        label: '太字',
        forSelect: {
          optionsOrOptionFetcher: [
            {value: 'normal', label: '通常'},
            {value: 'bold', label: '太字'},
          ],
        },
        form: {},
      },
      {
        id: 'isCorrectAnswer',
        label: '正解',
        type: 'boolean',
        form: {},
      },
      {
        id: 'sortOrder',
        label: '順序',
        type: 'number',
        form: {},
        td: {style: {width: 80}},
      },
    ]

    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }

  static slideResponse = (props: columnGetterType) => {
    const data: colType[] = [
      {
        id: 'studentName',
        label: '生徒名',
        format: (value, row) => row.Student?.name || '',
        search: {},
      },
      {
        id: 'responseType',
        label: '回答種別',
        forSelect: {
          optionsOrOptionFetcher: [
            {value: 'choice', label: '選択'},
            {value: 'text', label: 'テキスト'},
            {value: 'psychology', label: '心理アンケート'},
          ],
        },
        search: {},
      },
      {
        id: 'choiceAnswer',
        label: '選択回答',
        format: value => value || '',
      },
      {
        id: 'textAnswer',
        label: 'テキスト回答',
        format: value => value || '',
      },
      {
        id: 'isCorrect',
        label: '正解',
        type: 'boolean',
        format: value => (value === null ? '' : value ? '○' : '×'),
      },
      {
        id: 'createdAt',
        label: '回答日時',
        format: value => formatDate(value, 'datetime'),
      },
    ]

    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }

  static learningRoleMaster = (props: columnGetterType) => {
    const session = props.useGlobalProps.session

    const data: colType[] = [
      {id: 'teacherId', label: '教員', form: {defaultValue: session?.id, disabled: true}, forSelect: {}},
      {id: 'name', label: '役割名', form: {register: {required: '必須です'}}},
      {id: 'color', label: '色', form: {}, type: `color`},
      {id: 'maxCount', label: '最大', form: {}, type: `number`, td: {style: {width: 40}}},
    ]
    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }
  static learningRoleMasterOnGame = (props: columnGetterType) => {
    const data = new Fields([
      {id: 'name', label: '役割名', form: {register: {required: '必須です'}}},
      {id: 'color', label: '色', form: {}, type: `color`},
      {id: 'maxCount', label: '最大', form: {}, type: `number`, td: {style: {width: 40}}},
    ]).customAttributes(({col}) => ({td: {...col.td, withLabel: false}}))
    return data.transposeColumns()
  }

  static school = (props: columnGetterType) => {
    const data: colType[] = [
      {
        id: 'name',
        type: 'text',
        label: '学校名',
        form: {register: {required: '必須です'}},
      },
    ]
    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }

  static student = (props: columnGetterType) => {
    const {
      ColBuilderExtraProps,
      useGlobalProps: {accessScopes},
    } = props
    const schoolId = accessScopes().getGroupieScopes().schoolId

    const data: colType[] = [
      {
        id: 'classroomId',
        label: 'クラス',
        forSelect: {
          config: {
            modelName: `classroom`,
            select: {name: false, grade: ``, class: ``},
            where: {schoolId},
            nameChanger: op => ({...op, name: new ClassRoom(op).className}),
          },
        },
        format: (value, row) => {
          return <>{new ClassRoom(row.Classroom).className}</>
        },
        form: {
          defaultValue: ColBuilderExtraProps?.classroom?.id,
        },
        search: {},
      },
      {
        id: 'attendanceNumber',
        label: '出席番号',
        type: 'number',
        form: {},
        search: {},
      },
      {
        id: 'name',
        label: '氏名',
        // type: 'text',
        form: {
          register: {required: '必須です'},
        },
        search: {},
      },
      {
        id: 'kana',
        type: 'text',
        label: 'かな',
        form: {},
        search: {},
      },
      {
        id: 'gender',

        label: '性別',
        forSelect: {optionsOrOptionFetcher: [`男`, `女`]},
        form: {},
        search: {},
      },

      {
        id: 'studentUnfitFellow',
        label: '要配慮指定',
        format: (value, row) => {
          const {id, UnfitFellow} = row
          const items = UnfitFellow?.map((u: any) => {
            const oponent = u.Student.find((s: any) => s.id !== id)
            return oponent?.name
          })

          return (
            <MemberViwer
              {...{
                style: {width: '100%'},
                items: items,
                itemStyle: {width: 80},
              }}
            />
          )
        },
      },
    ]

    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }

  static teacher = (props: columnGetterType) => {
    const {useGlobalProps} = props
    const {isSchoolLeader} = useGlobalProps.accessScopes().getGroupieScopes()

    const data: colType[] = [
      // {
      //   id: 'schoolId',
      //   label: '学校',
      //   forSelect: {},
      // },

      {
        id: 'name',
        label: '氏名',
        form: {
          register: {required: '必須です'},
          disabled: false,
        },
        sort: {},
        search: {},
      },
      {
        id: 'email',
        label: 'メールアドレス',

        form: {
          register: {required: '必須です'},
          disabled: false,
        },
        sort: {},
        search: {},
        type: 'email',
      },
      {
        id: 'password',
        label: 'パスワード',
        type: 'password',
        form: {register: {required: '必須です'}},
      },
      {
        id: 'type',
        label: '区分',
        forSelect: {optionsOrOptionFetcher: [{value: '責任者', color: '#B22222'}]},
        form: {
          register: {},
          disabled: !isSchoolLeader,
        },
        search: {},
        sort: {},
      },

      {
        id: 'classroom',
        label: '所属クラス',
        format: (value: any, row: any) => {
          return `${row?.TeacherClass?.length}`
        },
        affix: {label: '件'},
      },
    ]

    return Fields.transposeColumns(data, {
      ...props.transposeColumnsOptions,
      autoSplit: {form: 4},
    })
  }

  static classroom = (props: columnGetterType) => {
    const data: colType[] = [
      {
        id: 'grade',
        label: '学年',
        type: 'text',
        form: {register: {required: '必須です'}},
        affix: {label: '年'},
      },
      {
        id: 'class',
        label: '組',
        type: 'text',
        form: {register: {required: '必須です'}},
        affix: {label: '組'},
      },
      {
        id: 'teacher',
        label: '教員数',
        format: (value: any, row: any) => `${row?.TeacherClass?.length}`,
        affix: {label: '人'},
      },
      {
        id: 'students',
        label: '児童・生徒数',
        format: (value: any, row: any) => `${row?.Student?.length}`,
        affix: {label: '人'},
      },
    ]

    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }

  static game = (props: columnGetterType) => {
    const {useGlobalProps} = props
    const {session, accessScopes, status, query, asPath, router, pathname, rootPath, addQuery} = useGlobalProps
    const scopes = accessScopes()
    const {schoolId, teacherId} = scopes.getGroupieScopes()

    const data: colType[] = [
      {
        id: 'date',
        label: '日時',
        type: 'date',
        form: {register: {required: '必須です'}, defaultValue: formatDate(new Date(), 'iso')},
      },
      {
        id: 'name',
        label: '授業名',
        form: {register: {required: '必須です'}},
      },

      {
        id: 'subjectNameMasterId',
        label: '教科',
        form: {register: {required: '必須です'}},
        forSelect: {
          config: {
            modelName: `subjectNameMaster`,
            where: {schoolId: schoolId},
          },
        },
      },
      {
        id: 'learningContent',
        label: '学習内容(改行区切り)',
        type: `textarea`,
        form: {style: {minWidth: 400}, register: {required: '必須です'}},
      },
      {
        id: 'task',
        label: '学習課題',
        type: `textarea`,
        form: {style: {minWidth: 400}, register: {required: '必須です'}},
        // td: {style: {width: 150}},
      },

      {
        id: 'teacherId',
        label: '担当者',
        form: {
          defaultValue: teacherId,
          register: {required: '必須です'},
          disabled: true,
        },
        forSelect: {
          config: {
            modelName: `teacher`,
            where: {
              id: session?.id,
              schoolId: schoolId,
            },
          },
        },
      },

      {
        id: 'nthTime',
        label: '時数',
        type: 'number',
        form: {},
      },
      {
        id: 'slideCount',
        label: 'スライド数',
        format: (value, row) => `${row.Slide?.length || 0}`,
        affix: {label: '枚'},
      },
      {
        id: 'secretKey',
        label: 'Grouping開始',

        td: {style: {width: 50}},
        format: (value: any, row: any) => {
          const newPath = `/${rootPath}/Grouping/game/main/${row.secretKey}` + addQuerySentence({as: 'teacher'}, query)

          return (
            <Button
              className={`py-1.5 text-[.875rem]`}
              onClick={async e => {
                const {result: gameDetail} = await doStandardPrisma('game', 'findUnique', {
                  where: {id: row.id},
                  include: {
                    QuestionPrompt: {},
                    // Room: {
                    //   include: {
                    //     RoomStudent: {include: {Student: {}}},
                    //   },
                    // },
                  },
                })

                // const Students = gameDetail.Room.RoomStudent.map((rs: any) => rs.Student).flat()
                // const PromptLength = gameDetail.QuestionPrompt.length

                // if (PromptLength === 0) {
                //   if (
                //     !confirm(
                //       arrToLines([
                //         `初回のゲーム開始時は、現在招待されている【${Students.length}】人の生徒に自動でアンケートが開始されます。`,
                //         `ゲーム開始後に招待した参加者には、初回アンケートは実施できません。`,
                //         `開始してよろしいですか？`,
                //       ])
                //     )
                //   ) {
                //     return
                //   }
                // }
                router.push(newPath)
              }}
            >
              開始
            </Button>
          )
        },
      },
    ]

    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }

  static answer = (props: columnGetterType) => {
    const data: colType[] = [
      ...Grouping.QUESTIONS.map((q, idx) => {
        return q.questions.map((question, idx) => {
          const col: colType = {
            id: `${question.type}${idx}`,
            label: question.label,
            type: 'review',
          }
          return col
        })
      }).flat(),
    ]

    return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
  }
}
