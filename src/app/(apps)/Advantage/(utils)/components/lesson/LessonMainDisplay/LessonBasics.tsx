'use client'
import React from 'react'

import ContentPlayer from '@cm/components/utils/ContentPlayer'

import {breakLines} from '@cm/lib/value-handler'
import {C_Stack} from '@components/styles/common-components/common-components'
import {TitleDescription} from '@components/styles/common-components/Notation'

const LessonBasics = ({Lesson}) => {
  return (
    <section>
      <div>
        <C_Stack className={` p-1`}>
          <TitleDescription {...{title: '進め方', description: Lesson?.description}} />
          <C_Stack>
            {[...(Lesson?.LessonImage ?? [])]?.map((image, i) => {
              return (
                <div key={i} className={`mx-auto mb-20 w-[240px]`}>
                  <h3>{image.name}</h3>
                  <C_Stack key={i} className={` items-center  `}>
                    {image?.url && (
                      <div className={`mb-4`}>
                        <ContentPlayer
                          {...{
                            src: image.url,
                            styles: {thumbnail: {width: 240, height: 180}},
                          }}
                        />
                      </div>
                    )}

                    <div className={` break-words  `}>{breakLines(image.description)}</div>
                  </C_Stack>
                </div>
              )
            })}
          </C_Stack>
        </C_Stack>
      </div>
    </section>
  )
}

export default LessonBasics
