import {getIncludeType, includeProps, roopMakeRelationalInclude} from '@cm/class/builders/QueryBuilderVariables'
import {Prisma} from '@prisma/client'

export class QueryBuilder {
  static getInclude = (includeProps: includeProps) => {
    const student = {
      include: {
        UnfitFellow: {include: {Student: {include: {Classroom: {}}}}},
        Classroom: {},
      },
    }

    const teacher = {
      include: {
        School: {},
        TeacherClass: {include: {Classroom: {}}},
      },
    }

    const classroom = {
      include: {
        School: {},
        Student: student,
        TeacherClass: {include: {Teacher: {}}},
      },
    }

    const school = {
      include: {Teacher: teacher, Student: {}, Classroom: {}},
    }

    const questionPrompt: Prisma.QuestionPromptFindManyArgs = {
      orderBy: {id: 'asc'},
      include: {
        Game: {
          include: {},
        },
        Group: {},
      },
    }

    const squad = {
      include: {
        StudentRole: {
          include: {
            Student: {},
            LearningRoleMasterOnGame: {},
          },
        },
        Student: {
          include: {
            // Answer: {},
            Classroom: {},
          },
        },
      },
    }

    const game: Prisma.GameFindManyArgs = {
      include: {
        GroupCreateConfig: {},
        GameStudent: {
          include: {
            Student: {
              include: {
                Classroom: {},
              },
            },
          },
        },
        SubjectNameMaster: {},
        QuestionPrompt: questionPrompt,
        LearningRoleMasterOnGame: {},

        // Room: {
        //   include: {
        //     RoomStudent: {
        //       orderBy: [
        //         {Student: {Classroom: {grade: 'asc'}}},
        //         {Student: {Classroom: {class: 'asc'}}},
        //         {Student: {attendanceNumber: 'asc'}},
        //       ],
        //       include: {
        //         Student: {
        //           include: student.include,
        //         },
        //       },
        //     },

        //     //⬇︎当該ルームの保存済みプロジェクトも引っ張ってくる
        //     Game: {
        //       include: {
        //         Group: {
        //           where: {isSaved: true},
        //           include: {
        //             Game: {},
        //             Squad: squad,
        //           },
        //         },
        //       },
        //     },
        //   },
        // },

        Teacher: {},
        Group: {
          include: {
            Game: {},
            Squad: squad,
          },
        },
        Answer: {orderBy: {id: 'asc'}},
      },
    }

    const group = {
      include: {
        Game: game,
        Squad: squad,
      },
    }

    const include: getIncludeType = {
      // room,
      questionPrompt,
      classroom,
      student,
      school,
      game,
      group,
      teacher,
    }

    Object.keys(include).forEach(key => {
      roopMakeRelationalInclude({
        parentName: key,
        parentObj: include[key],
      })
    })

    return include
  }
}
