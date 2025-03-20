'use client'

import {useState} from 'react'
import {FitMargin, R_Stack} from '@components/styles/common-components/common-components'
import {Button} from '@components/styles/common-components/Button'
import usefetchUniversalAPI_SWR from '@cm/hooks/usefetchUniversalAPI_SWR'
import useGlobal from '@hooks/globalHooks/useGlobal'
import Loader from '@cm/components/utils/loader/Loader'
import {fetchUniversalAPI, fetchTransactionAPI} from '@lib/methods/api-fetcher'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  TrashIcon,
  ArrowsUpDownIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'

// インライン編集コンポーネント
const InlineEdit = ({value, onSave, placeholder = '名前を入力'}) => {
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  const handleEdit = e => {
    e.stopPropagation()
    setEditing(true)
  }

  const handleSave = e => {
    e.stopPropagation()
    if (inputValue.trim() !== '') {
      onSave(inputValue)
      setEditing(false)
    }
  }

  const handleCancel = e => {
    e.stopPropagation()
    setInputValue(value)
    setEditing(false)
  }

  const handleChange = e => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSave(e)
    } else if (e.key === 'Escape') {
      handleCancel(e)
    }
  }

  if (editing) {
    return (
      <div className="flex items-center" onClick={e => e.stopPropagation()}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="mr-2 rounded border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none"
          autoFocus
          placeholder={placeholder}
        />
        <button onClick={handleSave} className="mr-1 rounded-full bg-green-100 p-1 text-green-600 hover:bg-green-200">
          <CheckIcon className="h-4 w-4" />
        </button>
        <button onClick={handleCancel} className="rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200">
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      <span className="mr-2">{value}</span>
      <button onClick={handleEdit} className="rounded-full bg-gray-100 p-1 text-gray-600 hover:bg-gray-200">
        <PencilIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

// ドラッグ可能なアイテムコンポーネント
const SortableItem = ({id, children, handle = false}) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {handle ? (
        <div className="flex items-center">
          <div className="cursor-grab p-1" {...attributes} {...listeners}>
            <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
          </div>
          {children}
        </div>
      ) : (
        <div {...attributes} {...listeners}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function CategoryManagementPage() {
  const useGlobalProps = useGlobal()
  const {query, session} = useGlobalProps

  // bigCategoryデータを取得
  const {data: bigCategories, mutate: mutateBigCategories} = usefetchUniversalAPI_SWR(
    'bigCategory',
    'findMany',
    {
      orderBy: {sortOrder: 'asc'},
      include: {
        MiddleCategory: {
          orderBy: {sortOrder: 'asc'},
          include: {
            Lesson: {
              orderBy: {sortOrder: 'asc'},
            },
          },
        },
      },
    },
    {deps: []}
  )

  // 新しいbigCategoryを作成する関数
  const createNewBigCategory = async () => {
    try {
      await fetchUniversalAPI('bigCategory', 'create', {
        data: {name: '新しいカテゴリ', color: '#3498db', sortOrder: 0},
      })
      mutateBigCategories()
    } catch (error) {
      console.error('カテゴリ作成エラー:', error)
    }
  }

  // 新しいmiddleCategoryを作成する関数
  const createNewMiddleCategory = async bigCategoryId => {
    try {
      await fetchUniversalAPI('middleCategory', 'create', {
        data: {
          name: '新しい中カテゴリ',
          bigCategoryId,
        },
      })
      mutateBigCategories()
    } catch (error) {
      console.error('中カテゴリ作成エラー:', error)
    }
  }

  // 新しいlessonを作成する関数
  const createNewLesson = async middleCategoryId => {
    try {
      await fetchUniversalAPI('lesson', 'create', {
        data: {
          name: '新しいレッスン',
          description: 'レッスンの説明を入力してください',
          middleCategoryId,
        },
      })
      mutateBigCategories()
    } catch (error) {
      console.error('レッスン作成エラー:', error)
    }
  }

  // カテゴリを削除する関数
  const deleteCategory = async (type, id: any) => {
    if (confirm('削除しますか？')) {
      if (prompt('本当に削除しますか？この操作は元に戻せません。削除する場合は、「削除」と入力してください。') === '削除') {
        try {
          await fetchUniversalAPI(type as any, 'delete', {where: {id}} as never)
          mutateBigCategories()
        } catch (error) {
          console.error('削除エラー:', error)
        }
      }
    }
  }

  // 名前を更新する関数
  const updateName = async (type, id, newName) => {
    try {
      await fetchUniversalAPI(type as any, 'update', {
        where: {id},
        data: {name: newName},
      } as never)
      mutateBigCategories()
    } catch (error) {
      console.error('名前更新エラー:', error)
    }
  }

  // 開閉状態を管理
  const [openBigCategories, setOpenBigCategories] = useState({})
  const [openMiddleCategories, setOpenMiddleCategories] = useState({})

  const toggleBigCategory = id => {
    setOpenBigCategories(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleMiddleCategory = id => {
    setOpenMiddleCategories(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // DnDセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px以上ドラッグしたときに有効化
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // 大カテゴリの並び替え処理
  const handleBigCategoryDragEnd = async event => {
    const {active, over} = event
    if (active.id !== over?.id) {
      const oldIndex = bigCategories.findIndex(item => item.id === active.id)
      const newIndex = bigCategories.findIndex(item => item.id === over.id)

      // 並び替えた配列を作成
      const updatedItems = arrayMove(bigCategories, oldIndex, newIndex)

      // トランザクションクエリを作成
      const transactionQueryList: transactionQuery[] = updatedItems.map((item: any, idx) => ({
        model: 'bigCategory',
        method: 'update',
        queryObject: {
          where: {id: item.id},
          data: {sortOrder: idx},
        },
      }))

      // データベースを更新
      await fetchTransactionAPI({transactionQueryList: transactionQueryList})
      mutateBigCategories()
    }
  }

  // 中カテゴリの並び替え処理
  const handleMiddleCategoryDragEnd = async (event, bigCategoryId) => {
    const {active, over} = event
    if (active.id !== over?.id) {
      const bigCategory = bigCategories.find(bc => bc.id === bigCategoryId)
      if (!bigCategory) return

      const oldIndex = bigCategory.MiddleCategory.findIndex(item => item.id === active.id)
      const newIndex = bigCategory.MiddleCategory.findIndex(item => item.id === over.id)

      // 並び替えた配列を作成
      const updatedItems = arrayMove(bigCategory.MiddleCategory, oldIndex, newIndex)

      // トランザクションクエリを作成
      const transactionQueryList: transactionQuery[] = updatedItems.map((item: any, idx) => ({
        model: 'middleCategory',
        method: 'update',
        queryObject: {
          where: {id: item.id},
          data: {sortOrder: idx},
        },
      }))

      // データベースを更新
      await fetchTransactionAPI({transactionQueryList})
      mutateBigCategories()
    }
  }

  // レッスンの並び替え処理
  const handleLessonDragEnd = async (event, middleCategoryId) => {
    const {active, over} = event
    if (active.id !== over?.id) {
      // 該当する中カテゴリを見つける
      let targetMiddleCategory: any = null
      for (const bc of bigCategories) {
        const mc = bc.MiddleCategory.find(mc => mc.id === middleCategoryId)
        if (mc) {
          targetMiddleCategory = mc
          break
        }
      }

      if (!targetMiddleCategory) return

      const oldIndex = targetMiddleCategory.Lesson.findIndex(item => item.id === active.id)
      const newIndex = targetMiddleCategory.Lesson.findIndex(item => item.id === over.id)

      // 並び替えた配列を作成
      const updatedItems = arrayMove(targetMiddleCategory.Lesson, oldIndex, newIndex)

      // トランザクションクエリを作成
      const transactionQueryList: transactionQuery[] = updatedItems.map((item: any, idx) => ({
        model: 'lesson',
        method: 'update',
        queryObject: {
          where: {id: item.id},
          data: {sortOrder: idx},
        },
      }))

      // データベースを更新
      await fetchTransactionAPI({transactionQueryList: transactionQueryList as transactionQuery[]})
      mutateBigCategories()
    }
  }

  if (!bigCategories) {
    return <Loader />
  }

  return (
    <FitMargin className="p-4">
      <h1 className="mb-6 text-2xl font-bold">カテゴリ管理</h1>

      <R_Stack className="mb-4 justify-end">
        <Button onClick={createNewBigCategory} color="primary">
          新しい大カテゴリを作成
        </Button>
      </R_Stack>

      {/* 大カテゴリのドラッグ＆ドロップ */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleBigCategoryDragEnd}>
        <SortableContext items={bigCategories.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="   space-y-4">
            {bigCategories.map(bigCategory => (
              <SortableItem key={bigCategory.id} id={bigCategory.id} handle={true}>
                <div className="overflow-hidden rounded-lg border">
                  {/* 大カテゴリヘッダー */}
                  <div
                    className="flex w-[900px] items-center justify-between bg-gray-100 p-4 "
                    style={{borderLeft: `5px solid ${bigCategory.color || '#3498db'}`}}
                  >
                    <div className="flex items-center  ">
                      <div className={` cursor-pointer`} onClick={() => toggleBigCategory(bigCategory.id)}>
                        {openBigCategories[bigCategory.id] ? (
                          <ChevronDownIcon className="mr-2 h-5 w-5" />
                        ) : (
                          <ChevronRightIcon className="mr-2 h-5 w-5" />
                        )}
                      </div>
                      <InlineEdit
                        value={bigCategory.name}
                        onSave={newName => updateName('bigCategory', bigCategory.id, newName)}
                        placeholder="大カテゴリ名を入力"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={e => {
                          e.stopPropagation()
                          createNewMiddleCategory(bigCategory.id)

                          setOpenBigCategories(prev => ({
                            ...prev,
                            [bigCategory.id]: true,
                          }))
                        }}
                        color="sub"
                        size="sm"
                      >
                        中カテゴリ追加
                      </Button>

                      <Button
                        onClick={e => {
                          e.stopPropagation()
                          deleteCategory('bigCategory', bigCategory.id)
                        }}
                        color="red"
                        size="sm"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* 大カテゴリの編集フォーム */}
                  {openBigCategories[bigCategory.id] && (
                    <div className="border-t p-4">
                      {/* 中カテゴリ一覧 */}
                      <div className="ml-6 mt-4 space-y-3">
                        {/* 中カテゴリのドラッグ＆ドロップ */}
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={event => handleMiddleCategoryDragEnd(event, bigCategory.id)}
                        >
                          <SortableContext
                            items={bigCategory.MiddleCategory.map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {bigCategory.MiddleCategory.map(middleCategory => (
                              <SortableItem key={middleCategory.id} id={middleCategory.id} handle={true}>
                                <div className="overflow-hidden rounded-lg border">
                                  {/* 中カテゴリヘッダー */}
                                  <div className="flex 　  flex-nowrap items-center justify-between  bg-gray-50 p-3 ">
                                    <R_Stack className="w-[600px] ">
                                      <div className={` cursor-pointer`} onClick={() => toggleMiddleCategory(middleCategory.id)}>
                                        {openMiddleCategories[middleCategory.id] ? (
                                          <ChevronDownIcon className="mr-2 h-4 w-4" />
                                        ) : (
                                          <ChevronRightIcon className="mr-2 h-4 w-4" />
                                        )}
                                      </div>
                                      <InlineEdit
                                        value={middleCategory.name}
                                        onSave={newName => updateName('middleCategory', middleCategory.id, newName)}
                                        placeholder="中カテゴリ名を入力"
                                      />
                                    </R_Stack>

                                    <div className="flex space-x-2">
                                      <Button
                                        onClick={e => {
                                          e.stopPropagation()
                                          createNewLesson(middleCategory.id)

                                          setOpenMiddleCategories(prev => ({
                                            ...prev,
                                            [middleCategory.id]: true,
                                          }))
                                        }}
                                        color="sub"
                                        size="sm"
                                      >
                                        <span>レッスン追加</span>
                                      </Button>

                                      <Button
                                        onClick={e => {
                                          e.stopPropagation()
                                          deleteCategory('middleCategory', middleCategory.id)
                                        }}
                                        color="red"
                                        size="sm"
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* 中カテゴリの編集フォーム */}
                                  {openMiddleCategories[middleCategory.id] && (
                                    <div className="border-t p-3">
                                      {/* レッスン一覧 */}
                                      <div className="ml-6 mt-3">
                                        {/* レッスンのドラッグ＆ドロップ */}
                                        <DndContext
                                          sensors={sensors}
                                          collisionDetection={closestCenter}
                                          onDragEnd={event => handleLessonDragEnd(event, middleCategory.id)}
                                        >
                                          <SortableContext
                                            items={middleCategory.Lesson.map(item => item.id)}
                                            strategy={verticalListSortingStrategy}
                                          >
                                            <div className="space-y-2">
                                              {middleCategory.Lesson.map(lesson => (
                                                <SortableItem key={lesson.id} id={lesson.id} handle={true}>
                                                  <div className="flex w-[400px] items-center justify-between rounded border bg-white p-2">
                                                    <InlineEdit
                                                      value={lesson.name}
                                                      onSave={newName => updateName('lesson', lesson.id, newName)}
                                                      placeholder="レッスン名を入力"
                                                    />
                                                    <div className="flex space-x-2">
                                                      <Button onClick={() => deleteCategory('lesson', lesson.id)} color="red">
                                                        <TrashIcon className="h-4 w-4" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                </SortableItem>
                                              ))}
                                            </div>
                                          </SortableContext>
                                        </DndContext>

                                        {middleCategory.Lesson.length === 0 && (
                                          <div className="p-2 text-sm text-gray-500">レッスンがありません</div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </SortableItem>
                            ))}
                          </SortableContext>
                        </DndContext>

                        {bigCategory.MiddleCategory.length === 0 && (
                          <div className="p-2 text-gray-500">中カテゴリがありません</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {bigCategories.length === 0 && (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-gray-500">カテゴリがありません</p>
          <Button onClick={createNewBigCategory} color="primary" className="mt-4">
            最初のカテゴリを作成
          </Button>
        </div>
      )}
    </FitMargin>
  )
}
