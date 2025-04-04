
export const prismaSchemaString = `

model BigCategory {
 id             Int              @id @default(autoincrement())
 createdAt      DateTime         @default(now())
 updatedAt      DateTime?        @default(now()) @updatedAt()
 active         Boolean          @default(true)
 sortOrder      Float
 name           String           @unique
 color          String?
 MiddleCategory MiddleCategory[]
}

model MiddleCategory {
 id            Int         @id @default(autoincrement())
 createdAt     DateTime    @default(now())
 updatedAt     DateTime?   @default(now()) @updatedAt()
 active        Boolean     @default(true)
 sortOrder     Float       @default(0)
 name          String
 bigCategoryId Int
 Lesson        Lesson[]
 BigCategory   BigCategory @relation(fields: [bigCategoryId], references: [id], onDelete: Cascade)

 // @@unique([bigCategoryId, name], name: "unique_bigCategoryId_name")
}

model Lesson {
 id               Int            @id @default(autoincrement())
 createdAt        DateTime       @default(now())
 updatedAt        DateTime?      @default(now()) @updatedAt()
 active           Boolean        @default(true)
 sortOrder        Float          @default(0)
 name             String
 description      String?
 middleCategoryId Int
 MiddleCategory   MiddleCategory @relation(fields: [middleCategoryId], references: [id], onDelete: Cascade)
 LessonImage      LessonImage[]
 LessonLog        LessonLog[]

 // @@unique([middleCategoryId, name], name: "unique_middleCategoryId_name")
}

model Ticket {
 id        Int       @id @default(autoincrement())
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 createdAt DateTime? @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 payedAt   DateTime?
 usedAt    DateTime?
 type      String?

 lessonLogId Int?
 userId      Int?
 LessonLog   LessonLog? @relation(fields: [lessonLogId], references: [id], onDelete: Cascade)
 User        User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Payment {
 id          Int       @id @default(autoincrement())
 createdAt   DateTime  @default(now())
 updatedAt   DateTime? @default(now()) @updatedAt()
 active      Boolean   @default(true)
 sortOrder   Float     @default(0)
 lessonLogId Int
 userId      Int
 LessonLog   LessonLog @relation(fields: [lessonLogId], references: [id], onDelete: Cascade)
 User        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model LessonLogAuthorizedUser {
 id          Int       @id @default(autoincrement())
 createdAt   DateTime  @default(now())
 updatedAt   DateTime? @default(now()) @updatedAt()
 active      Boolean   @default(true)
 sortOrder   Float     @default(0)
 userId      Int
 lessonLogId Int
 LessonLog   LessonLog @relation(fields: [lessonLogId], references: [id], onDelete: Cascade)

 comment String?

 User User @relation(fields: [userId], references: [id], onDelete: Cascade)

 @@unique([userId, lessonLogId], name: "unique_userId_lessonLogId")
}

model LessonLog {
 id           Int       @id @default(autoincrement())
 createdAt    DateTime  @default(now())
 updatedAt    DateTime? @default(now()) @updatedAt()
 active       Boolean   @default(true)
 sortOrder    Float     @default(0)
 isPassed     Boolean   @default(false)
 authorizerId Int?
 isPaid       Boolean   @default(false)
 userId       Int
 lessonId     Int
 isSuspended  Boolean   @default(false)
 Comment      Comment[]
 Lesson       Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
 User         User      @relation(fields: [userId], references: [id], onDelete: Cascade)

 LessonLogAuthorizedUser LessonLogAuthorizedUser[]
 Payment                 Payment[]
 Ticket                  Ticket[]
 VideoFromUser           VideoFromUser[]

 @@unique([userId, lessonId], name: "unique_userId_lessonId")
}

model VideoFromUser {
 id          Int       @id @default(autoincrement())
 createdAt   DateTime  @default(now())
 updatedAt   DateTime? @default(now()) @updatedAt()
 active      Boolean   @default(true)
 sortOrder   Float     @default(0)
 lessonLogId Int
 userId      Int
 LessonLog   LessonLog @relation(fields: [lessonLogId], references: [id], onDelete: Cascade)
 User        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model LessonImage {
 id          Int       @id @default(autoincrement())
 createdAt   DateTime  @default(now())
 updatedAt   DateTime? @default(now()) @updatedAt()
 active      Boolean   @default(true)
 sortOrder   Float     @default(0)
 name        String
 description String?
 type        String?
 url         String?
 lessonId    Int
 Lesson      Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)

 @@unique([lessonId, name], name: "unique_lessonId_name")
}

model Comment {
 id          Int       @id @default(autoincrement())
 createdAt   DateTime  @default(now())
 updatedAt   DateTime? @default(now()) @updatedAt()
 active      Boolean   @default(true)
 sortOrder   Float     @default(0)
 message     String?
 read        Boolean   @default(false)
 userId      Int
 lessonLogId Int
 url         String?
 LessonLog   LessonLog @relation(fields: [lessonLogId], references: [id], onDelete: Cascade)
 User        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model SystemChatRoom {
 id         Int          @id @default(autoincrement())
 createdAt  DateTime     @default(now())
 updatedAt  DateTime?    @default(now()) @updatedAt()
 active     Boolean      @default(true)
 sortOrder  Float        @default(0)
 userId     Int          @unique
 SystemChat SystemChat[]
 User       User         @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model SystemChat {
 id               Int            @id @default(autoincrement())
 createdAt        DateTime       @default(now())
 updatedAt        DateTime?      @default(now()) @updatedAt()
 active           Boolean        @default(true)
 sortOrder        Float          @default(0)
 message          String?
 url              String?
 read             Boolean        @default(false)
 systemChatRoomId Int
 userId           Int
 SystemChatRoom   SystemChatRoom @relation(fields: [systemChatRoomId], references: [id], onDelete: Cascade)
 User             User           @relation("user", fields: [userId], references: [id], onDelete: Cascade)
}

 
model ApRequestTypeMaster {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  name          String
  color         String?
  description   String?
  ApCustomField ApCustomField[]
  ApRequest     ApRequest[]
}

model ApCustomField {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  name     String // フィールド名
  type     String // データ型
  required Boolean @default(false)
  // 必須かどうか
  remarks  String? // 備考

  ApCustomFieldValue    ApCustomFieldValue[]
  ApRequestTypeMaster   ApRequestTypeMaster? @relation(fields: [apRequestTypeMasterId], references: [id], onDelete: Cascade)
  apRequestTypeMasterId Int?
}

model ApRequest {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  status              String? // 申請ステータス
  withdrawn           Boolean?
  forceApproved       Boolean?
  ApRequestTypeMaster ApRequestTypeMaster @relation(fields: [approvalRequestTypeMasterId], references: [id], onDelete: Cascade)

  ApSender           ApSender             @relation(fields: [apSenderId], references: [id], onDelete: Cascade)
  ApReceiver         ApReceiver[]
  ApCustomFieldValue ApCustomFieldValue[]

  apSenderId                  Int
  approvalRequestTypeMasterId Int
}

model ApSender {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  User   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId Int

  ApRequest ApRequest[]
}

model ApReceiver {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  status  String? // 承認ステータス
  comment String? // コメント

  User        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      Int
  ApRequest   ApRequest @relation(fields: [apRequestId], references: [id], onDelete: Cascade)
  apRequestId Int
}

model ApCustomFieldValue {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  string String? // 文字列の場合
  number Float? // 数値の場合
  date   DateTime? // 日付の場合

  ApRequest     ApRequest     @relation(fields: [approvalRequestId], references: [id], onDelete: Cascade)
  ApCustomField ApCustomField @relation(fields: [customFieldId], references: [id], onDelete: Cascade)

  approvalRequestId     Int
  customFieldId         Int
  apRequestTypeMasterId Int?

  @@unique([approvalRequestId, customFieldId], name: "unique_approvalRequestId_customFieldId")
}

 
model School {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()

 active            Boolean             @default(true)
 sortOrder         Float               @default(0)
 name              String
 Classroom         Classroom[]
 Game              Game[]
 Student           Student[]
 SubjectNameMaster SubjectNameMaster[]
 Teacher           Teacher[]
 User              User[]
}

model LearningRoleMasterOnGame {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 name      String
 color     String?
 maxCount  Int?

 Game        Game          @relation(fields: [gameId], references: [id], onDelete: Cascade)
 gameId      Int
 StudentRole StudentRole[]
}

model SubjectNameMaster {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 name      String
 color     String?
 schoolId  Int
 Game      Game[]
 School    School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
}

model Teacher {
 id                   Int       @id @default(autoincrement())
 createdAt            DateTime  @default(now())
 updatedAt            DateTime? @default(now()) @updatedAt()
 active               Boolean   @default(true)
 sortOrder            Float     @default(0)
 name                 String
 kana                 String?
 schoolId             Int?
 email                String?   @unique
 password             String?
 role                 String?
 tempResetCode        String?
 tempResetCodeExpired DateTime?
 type                 String?
 Game                 Game[]

 School       School?        @relation(fields: [schoolId], references: [id], onDelete: Cascade)
 TeacherClass TeacherClass[]
}

model Student {
 id               Int       @id @default(autoincrement())
 createdAt        DateTime  @default(now())
 updatedAt        DateTime? @default(now()) @updatedAt()
 active           Boolean   @default(true)
 sortOrder        Float     @default(0)
 name             String
 kana             String?
 gender           String?
 attendanceNumber Int?
 schoolId         Int
 classroomId      Int
 Answer           Answer[]

 Classroom   Classroom     @relation(fields: [classroomId], references: [id], onDelete: Cascade)
 School      School        @relation(fields: [schoolId], references: [id], onDelete: Cascade)
 Squad       Squad[]       @relation("SquadToStudent")
 UnfitFellow UnfitFellow[] @relation("StudentToUnfitFellow")
 GameStudent GameStudent[]
 StudentRole StudentRole[]

 @@unique([schoolId, classroomId, attendanceNumber], name: "unique_schoolId_classroomId_attendanceNumber")
}

model UnfitFellow {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 Student   Student[] @relation("StudentToUnfitFellow")
}

model Classroom {
 id           Int            @id @default(autoincrement())
 createdAt    DateTime       @default(now())
 updatedAt    DateTime?      @default(now()) @updatedAt()
 active       Boolean        @default(true)
 sortOrder    Float          @default(0)
 grade        String?
 class        String?
 schoolId     Int
 School       School         @relation(fields: [schoolId], references: [id], onDelete: Cascade)
 Student      Student[]
 TeacherClass TeacherClass[]

 @@unique([schoolId, grade, class], name: "unique_schoolId_grade_class")
}

model TeacherClass {
 id          Int       @id @default(autoincrement())
 sortOrder   Float     @default(0)
 teacherId   Int
 classroomId Int
 Classroom   Classroom @relation(fields: [classroomId], references: [id], onDelete: Cascade)
 Teacher     Teacher   @relation(fields: [teacherId], references: [id], onDelete: Cascade)

 @@unique([teacherId, classroomId], name: "unique_teacherId_classroomId")
}

model GameStudent {
 id        Int       @id @default(autoincrement())
 sortOrder Float     @default(0)
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 gameId    Int
 studentId Int
 Game      Game      @relation(fields: [gameId], references: [id], onDelete: Cascade)
 Student   Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)

 @@unique([gameId, studentId], name: "unique_gameId_studentId")
}

model Game {
 id                       Int                        @id @default(autoincrement())
 createdAt                DateTime                   @default(now())
 updatedAt                DateTime?                  @default(now()) @updatedAt()
 active                   Boolean                    @default(true)
 sortOrder                Float                      @default(0)
 name                     String
 date                     DateTime
 secretKey                String                     @unique
 absentStudentIds         Int[]
 schoolId                 Int
 teacherId                Int
 subjectNameMasterId      Int?
 status                   String?
 activeGroupId            Int?
 activeQuestionPromptId   Int?
 nthTime                  Int?
 randomTargetStudentIds   Int[]
 learningContent          String?
 task                     String?
 Answer                   Answer[]
 School                   School                     @relation(fields: [schoolId], references: [id], onDelete: Cascade)
 SubjectNameMaster        SubjectNameMaster?         @relation(fields: [subjectNameMasterId], references: [id], onDelete: Cascade)
 Teacher                  Teacher                    @relation(fields: [teacherId], references: [id], onDelete: Cascade)
 Group                    Group[]
 QuestionPrompt           QuestionPrompt[]
 GameStudent              GameStudent[]
 LearningRoleMasterOnGame LearningRoleMasterOnGame[]
 GroupCreateConfig        GroupCreateConfig?
}

model GroupCreateConfig {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)

 groupCreationMode String?
 count             Int?
 criteria          String?
 genderConfig      String?

 Game   Game @relation(fields: [gameId], references: [id])
 gameId Int  @unique
}

model Group {
 id             Int             @id @default(autoincrement())
 createdAt      DateTime        @default(now())
 updatedAt      DateTime?       @default(now()) @updatedAt()
 active         Boolean         @default(true)
 sortOrder      Float           @default(0)
 name           String
 isSaved        Boolean
 Game           Game            @relation(fields: [gameId], references: [id], onDelete: Cascade)
 Squad          Squad[]
 QuestionPrompt QuestionPrompt? @relation(fields: [questionPromptId], references: [id], onDelete: Cascade)

 gameId           Int
 questionPromptId Int?
}

model Squad {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 name      String
 groupId   Int
 Group     Group     @relation(fields: [groupId], references: [id], onDelete: Cascade)
 Student   Student[] @relation("SquadToStudent")

 StudentRole StudentRole[]
}

model StudentRole {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)

 Squad Squad @relation(fields: [squadId], references: [id])

 Student Student @relation(fields: [studentId], references: [id])

 LearningRoleMasterOnGame   LearningRoleMasterOnGame @relation(fields: [learningRoleMasterOnGameId], references: [id])
 studentId                  Int
 learningRoleMasterOnGameId Int
 squadId                    Int
}

model QuestionPrompt {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 gameId    Int
 asSummary Boolean   @default(false)
 Answer    Answer[]
 Group     Group[]
 Game      Game      @relation(fields: [gameId], references: [id], onDelete: Cascade)
}

model Answer {
 id                 Int             @id @default(autoincrement())
 createdAt          DateTime        @default(now())
 updatedAt          DateTime?       @default(now()) @updatedAt()
 active             Boolean         @default(true)
 sortOrder          Float           @default(0)
 curiocity1         Int?
 curiocity2         Int?
 curiocity3         Int?
 curiocity4         Int?
 curiocity5         Int?
 efficacy1          Int?
 efficacy2          Int?
 efficacy3          Int?
 efficacy4          Int?
 efficacy5          Int?
 impression         String?
 gameId             Int
 studentId          Int
 questionPromptId   Int?
 asSummary          Boolean         @default(false)
 lessonImpression   String?
 lessonSatisfaction Int?
 Game               Game            @relation(fields: [gameId], references: [id], onDelete: Cascade)
 QuestionPrompt     QuestionPrompt? @relation(fields: [questionPromptId], references: [id], onDelete: Cascade)
 Student            Student         @relation(fields: [studentId], references: [id], onDelete: Cascade)

 @@unique([gameId, studentId, questionPromptId], name: "unique_gameId_studentId_questionPromptId")
}

 
model KaizenClient {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name                    String?
 organization            String?
 iconUrl                 String?
 bannerUrl               String?
 website                 String?
 note                    String?
 public                  Boolean?       @default(false)
 introductionRequestedAt DateTime?
 KaizenWork              KaizenWork[]
 KaizenReview            KaizenReview[]

 @@unique([name, organization], name: "unique_name_organization")
}

model KaizenReview {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 username String?
 review   String?
 platform String?

 KaizenClient   KaizenClient? @relation(fields: [kaizenClientId], references: [id], onDelete: Cascade)
 kaizenClientId Int?
}

model KaizenWork {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 uuid String? @unique @default(uuid())

 date              DateTime?
 title             String?
 subtitle          String?
 status            String?
 description       String?
 points            String?
 clientName        String?
 organization      String?
 dealPoint         Float?
 toolPoint         Float?
 impression        String?
 reply             String?
 jobCategory       String? //製造、飲食
 systemCategory    String? //GAS / アプリ
 collaborationTool String? //Freee / Insta

 KaizenWorkImage KaizenWorkImage[]
 showName        Boolean?          @default(false)

 KaizenClient   KaizenClient? @relation(fields: [kaizenClientId], references: [id], onDelete: Cascade)
 kaizenClientId Int?

 allowShowClient Boolean? @default(false)
 isPublic        Boolean? @default(false)

 correctionRequest String?

 @@unique([title, subtitle], name: "unique_title_subtitle")
}

model KaizenWorkImage {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 url String @unique

 KaizenWork   KaizenWork? @relation(fields: [kaizenWorkId], references: [id], onDelete: Cascade)
 kaizenWorkId Int?
}

model KaizenCMS {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 contactPageMsg   String?
 principlePageMsg String?
}

 
model AppLog {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  active    Boolean   @default(true)
  sortOrder Float     @default(0)

  diffTime Int? // 前回のアクションからの経過時間（ミリ秒）（省略可能）

  userAgent           String? // ユーザーのブラウザやデバイスの情報（省略可能）
  referrerUrl         String? // リファラーURL（省略可能）
  timestamp           DateTime @default(now()) // アクションが発生した日時
  pageName            String? // ページの名称（タイトル）
  pageUrl             String? // ページのURL
  pageParams          Json? // ページのパラメータ
  dataLogComponent    Json? // DOMツリーのdata-Log-Sectionを階層構造で示した配列
  functionName        String? // 関数名
  functionArgs        Json? // 関数の引数
  functionReturnValue Json? // 関数の返り値（省略可能）
  consoleInfo         String[] // console.infoで示された内容（省略可能）
  actionType          String? // アクションタイプ（クリック、スクロールなど）（省略可能）
  pageLoadTime        Int? // ページ読み込み時間（ミリ秒）（省略可能）
  errorMessage        String? // エラーログ（スタックトレースなど）（省略可能）
  sessionDuration     Int? // セッションの継続時間（秒）（省略可能）

  User   User? @relation(fields: [userId], references: [id])
  userId Int?
}

 
// ユーザーテーブル
// model User {
//  id        Int       @id @default(autoincrement())
//  createdAt DateTime  @default(now())
//  updatedAt DateTime? @default(now()) @updatedAt()
//  sortOrder Float     @default(0)

//  name       String
//  email      String  @unique
//  department String
//  role       String
//  position   String?

//  // リレーション
//  PurchaseRequest PurchaseRequest[]
//  LeaveRequest    LeaveRequest[]
//  Approval        Approval[]
// }

// 商品マスターテーブル
model Product {
 id          Int       @id @default(autoincrement())
 createdAt   DateTime  @default(now())
 updatedAt   DateTime? @default(now()) @updatedAt()
 sortOrder   Float     @default(0)
 productCode String?   @unique
 name        String?
 maker       String?
 unit        String?

 // リレーション
 PurchaseRequest PurchaseRequest[]
}

// 発注履歴テーブル
model PurchaseRequest {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 purchaseType    String // 新規/折損/リピート
 quantity        Int
 reason          String
 result          String?
 approverComment String?
 trashed         Boolean @default(false)

 // リレーション
 Approval  Approval[]
 User      User       @relation(fields: [userId], references: [id])
 userId    Int
 Product   Product    @relation(fields: [productId], references: [id])
 productId Int
}

// 休暇申請履歴テーブル
model LeaveRequest {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 startDate DateTime
 endDate   DateTime
 leaveType String // 1日/年休休/午後休/特別休暇/慶弔休暇/産前産後休暇/代休/欠勤/早退/遅刻
 reason    String

 // リレーション
 Approval Approval[]
 User     User       @relation(fields: [userId], references: [id])
 userId   Int
}

// 承認テーブル
model Approval {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 status  String // 承認/却下
 comment String?

 // 発注申請の承認
 PurchaseRequest   PurchaseRequest? @relation(fields: [purchaseRequestId], references: [id])
 purchaseRequestId Int?

 // 休暇申請の承認
 LeaveRequest   LeaveRequest? @relation(fields: [leaveRequestId], references: [id])
 leaveRequestId Int?

 User   User @relation(fields: [userId], references: [id])
 userId Int
}

 
// 一回の購入
model AqSaleCart {
 id Int @id @default(autoincrement())

 baseOrderId   String?   @unique
 createdAt     DateTime  @default(now())
 updatedAt     DateTime? @default(now()) @updatedAt()
 sortOrder     Float     @default(0)
 date          DateTime
 paymentMethod String

 User         User?          @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId       Int?
 AqCustomer   AqCustomer     @relation(fields: [aqCustomerId], references: [id], onDelete: Cascade)
 aqCustomerId Int
 AqSaleRecord AqSaleRecord[]
}

// 購入商品の1迷彩
model AqSaleRecord {
 baseSaleRecordId String?   @unique
 id               Int       @id @default(autoincrement())
 createdAt        DateTime  @default(now())
 updatedAt        DateTime? @default(now()) @updatedAt()
 sortOrder        Float     @default(0)

 date       DateTime
 quantity   Int
 price      Float
 taxRate    Float? // 税率
 taxedPrice Float? // 税込価格
 remarks    String?

 User   User? @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId Int?

 AqCustomer   AqCustomer @relation(fields: [aqCustomerId], references: [id], onDelete: Cascade)
 aqCustomerId Int

 AqProduct   AqProduct @relation(fields: [aqProductId], references: [id], onDelete: Cascade)
 aqProductId Int

 AqPriceOption   AqPriceOption? @relation(fields: [aqPriceOptionId], references: [id], onDelete: Cascade)
 aqPriceOptionId Int?

 AqSaleCart   AqSaleCart @relation(fields: [aqSaleCartId], references: [id], onDelete: Cascade)
 aqSaleCartId Int

 AqCustomerSubscription AqCustomerSubscription? @relation(fields: [aqCustomerSubscriptionId], references: [id])

 aqCustomerSubscriptionId Int?

 subscriptionYearMonth DateTime?

 @@unique([aqCustomerId, aqProductId, subscriptionYearMonth], name: "unique_aqCustomerId_aqProductId_subscriptionYearMonth")
}

// 商品
model AqProduct {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 productCode               String?
 name                      String                   @unique
 AqProductCategoryMaster   AqProductCategoryMaster? @relation(fields: [aqProductCategoryMasterId], references: [id], onDelete: Cascade)
 aqProductCategoryMasterId Int?

 fromBase Boolean? @default(false)

 cost                  Float   @default(0)
 // price                 Float   @default(0)
 // sku                   String?
 // taxType               String?
 taxRate               Float   @default(10)
 stock                 Int     @default(0)
 inInventoryManagement Boolean @default(true)

 AqPriceOption AqPriceOption[]
 AqSaleRecord  AqSaleRecord[]

 AqCustomerPriceOption  AqCustomerPriceOption[]
 AqInventoryRegister    AqInventoryRegister[]
 AqCustomerSubscription AqCustomerSubscription[]

 AqDefaultShiireAqCustomer   AqCustomer? @relation(fields: [aqDefaultShiireAqCustomerId], references: [id])
 aqDefaultShiireAqCustomerId Int?

 AqInventoryByMonth AqInventoryByMonth[]
}

// 商品価格
model AqPriceOption {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)
 name      String
 price     Float?

 AqProduct   AqProduct? @relation(fields: [aqProductId], references: [id], onDelete: Cascade)
 aqProductId Int?

 AqCustomerPriceOption AqCustomerPriceOption[]
 AqSaleRecord          AqSaleRecord[]
}

model AqCustomer {
 id             Int       @id @default(autoincrement())
 createdAt      DateTime  @default(now())
 updatedAt      DateTime? @default(now()) @updatedAt()
 sortOrder      Float     @default(0)
 email          String?   @unique
 customerNumber String?   @unique

 fromBase Boolean? @default(false)

 companyName          String?
 jobTitle             String?
 name                 String? @unique
 defaultPaymentMethod String?

 tel           String?
 tel2          String?
 fax           String?
 invoiceNumber String?
 status        String? @default("継続")

 domestic Boolean @default(true)
 postal   String?
 state    String?
 city     String?
 street   String?
 building String?
 remarks  String?

 firstVisitDate DateTime?
 lastVisitDate  DateTime?

 maintananceYear  Int?
 maintananceMonth Int?

 AqSaleCart                     AqSaleCart[]
 AqCustomerRecord               AqCustomerRecord[]
 AqCustomerPriceOption          AqCustomerPriceOption[]
 AqCustomerSupportGroupMidTable AqCustomerSupportGroupMidTable[]
 AqCustomerDealerMidTable       AqCustomerDealerMidTable[]
 AqCustomerDeviceMidTable       AqCustomerDeviceMidTable[]
 AqCustomerServiceTypeMidTable  AqCustomerServiceTypeMidTable[]
 AqSaleRecord                   AqSaleRecord[]
 User                           User?                            @relation(fields: [userId], references: [id])
 userId                         Int?
 AqInventoryRegister            AqInventoryRegister[]
 AqCustomerSubscription         AqCustomerSubscription[]

 AqProduct AqProduct[]
}

model AqCustomerSubscription {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 active Boolean @default(true)

 maintananceYear  Int
 maintananceMonth Int

 AqCustomer       AqCustomer     @relation(fields: [aqCustomerId], references: [id], onDelete: Cascade)
 aqCustomerId     Int
 AqDeviceMaster   aqDeviceMaster @relation(fields: [aqDeviceMasterId], references: [id])
 aqDeviceMasterId Int

 AqProduct   AqProduct @relation(fields: [aqProductId], references: [id])
 aqProductId Int

 remarks      String?
 AqSaleRecord AqSaleRecord[]
}

model AqCustomerPriceOption {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 AqCustomer   AqCustomer @relation(fields: [aqCustomerId], references: [id], onDelete: Cascade)
 aqCustomerId Int

 AqProduct AqProduct @relation(fields: [aqProductId], references: [id], onDelete: Cascade)

 aqProductId Int

 AqPriceOption   AqPriceOption @relation(fields: [aqPriceOptionId], references: [id], onDelete: Cascade)
 aqPriceOptionId Int

 @@unique([aqCustomerId, aqProductId], name: "unique_aqCustomerId_aqProductId")
}

model AqCustomerRecord {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date    DateTime?
 status  String?
 type    String?
 content String?
 remarks String?

 AqCustomerRecordAttachment AqCustomerRecordAttachment[]

 AqCustomer   AqCustomer @relation(fields: [aqCustomerId], references: [id], onDelete: Cascade)
 aqCustomerId Int
 User         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId       Int
}

model AqCustomerRecordAttachment {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 title String?
 url   String?

 AqCustomerRecord   AqCustomerRecord? @relation(fields: [aqCustomerRecordId], references: [id], onDelete: Cascade)
 aqCustomerRecordId Int?
}

model AqSupportGroupMaster {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name                           String                           @unique
 color                          String?
 AqCustomerSupportGroupMidTable AqCustomerSupportGroupMidTable[]
}

model AqProductCategoryMaster {
 id        Int         @id @default(autoincrement())
 createdAt DateTime    @default(now())
 updatedAt DateTime?   @default(now()) @updatedAt()
 sortOrder Float       @default(0)
 name      String      @unique
 color     String?
 AqProduct AqProduct[]
}

model AqServiecTypeMaster {
 id                            Int                             @id @default(autoincrement())
 createdAt                     DateTime                        @default(now())
 updatedAt                     DateTime?                       @default(now()) @updatedAt()
 sortOrder                     Float                           @default(0)
 name                          String                          @unique
 color                         String?
 AqCustomerServiceTypeMidTable AqCustomerServiceTypeMidTable[]
}

model AqDealerMaster {
 id                       Int                        @id @default(autoincrement())
 createdAt                DateTime                   @default(now())
 updatedAt                DateTime?                  @default(now()) @updatedAt()
 sortOrder                Float                      @default(0)
 name                     String                     @unique
 color                    String?
 AqCustomerDealerMidTable AqCustomerDealerMidTable[]
}

model aqDeviceMaster {
 id                       Int                        @id @default(autoincrement())
 createdAt                DateTime                   @default(now())
 updatedAt                DateTime?                  @default(now()) @updatedAt()
 sortOrder                Float                      @default(0)
 name                     String                     @unique
 color                    String?
 AqCustomerDeviceMidTable AqCustomerDeviceMidTable[]
 AqCustomerSubscription   AqCustomerSubscription[]
}

model AqCustomerDealerMidTable {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 AqCustomer       AqCustomer     @relation(fields: [aqCustomerId], references: [id], onDelete: Cascade)
 aqCustomerId     Int
 AqDealerMaster   AqDealerMaster @relation(fields: [aqDealerMasterId], references: [id], onDelete: Cascade)
 aqDealerMasterId Int

 @@unique([aqCustomerId, aqDealerMasterId], name: "unique_aqCustomerId_aqDealerMasterId")
}

model AqCustomerServiceTypeMidTable {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 AqCustomer   AqCustomer @relation(fields: [aqCustomerId], references: [id], onDelete: Cascade)
 aqCustomerId Int

 AqServiecTypeMaster   AqServiecTypeMaster? @relation(fields: [aqServiecTypeMasterId], references: [id], onDelete: Cascade)
 aqServiecTypeMasterId Int?

 @@unique([aqCustomerId, aqServiecTypeMasterId], name: "unique_aqCustomerId_aqServiecTypeMasterId")
}

model AqCustomerDeviceMidTable {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 AqCustomer   AqCustomer @relation(fields: [aqCustomerId], references: [id], onDelete: Cascade)
 aqCustomerId Int

 AqDeviceMaster   aqDeviceMaster @relation(fields: [aqDeviceMasterId], references: [id], onDelete: Cascade)
 aqDeviceMasterId Int

 @@unique([aqCustomerId, aqDeviceMasterId], name: "unique_aqCustomerId_aqDeviceMasterId")
}

model AqCustomerSupportGroupMidTable {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 from                   DateTime
 to                     DateTime?
 AqSupportGroupMaster   AqSupportGroupMaster? @relation(fields: [aqSupportGroupMasterId], references: [id], onDelete: Cascade)
 aqSupportGroupMasterId Int?
 AqCustomer             AqCustomer            @relation(fields: [aqCustomerId], references: [id], onDelete: Cascade)
 aqCustomerId           Int

 @@unique([aqCustomerId, aqSupportGroupMasterId], name: "unique_aqCustomerId_aqSupportGroupMasterId")
}

model AqInventoryRegister {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 aqProductId  Int
 aqCustomerId Int
 date         DateTime
 quantity     Int
 remarks      String?

 AqProduct  AqProduct  @relation(fields: [aqProductId], references: [id], onDelete: Cascade)
 AqCustomer AqCustomer @relation(fields: [aqCustomerId], references: [id], onDelete: Cascade)
}

model AqInventoryByMonth {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 key       String   @unique
 yearMonth DateTime

 AqProduct   AqProduct @relation(fields: [aqProductId], references: [id])
 count       Int       @default(0)
 aqProductId Int
}

 
model DemoUser {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name  String?
 email String? @unique

 DemoUserDepartment DemoUserDepartment[]
 DemoTask           DemoTask[]
}

model DemoDepartment {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name               String?
 DemoUserDepartment DemoUserDepartment[]
 DemoTask           DemoTask[]
 DemoStock          DemoStock[]
}

model DemoUserDepartment {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 demoUserId       Int
 demoDepartmentId Int
 DemoUser         DemoUser       @relation(fields: [demoUserId], references: [id], onDelete: Cascade)
 DemoDepartment   DemoDepartment @relation(fields: [demoDepartmentId], references: [id], onDelete: Cascade)

 @@unique([demoUserId, demoDepartmentId], name: "unique_demoUserId_demoDepartmentId")
}

model DemoStock {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name     String?
 quantity Int?

 DemoDepartment   DemoDepartment? @relation(fields: [demoDepartmentId], references: [id], onDelete: Cascade)
 demoDepartmentId Int?
 DemoItem         DemoItem?       @relation(fields: [demoItemId], references: [id], onDelete: Cascade)
 demoItemId       Int?

 @@unique([demoDepartmentId, demoItemId], name: "unique_demoDepartmentId_demoItemId")
}

model DemoItem {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name      String?
 imageUrl  String?
 DemoStock DemoStock[]
}

model DemoTask {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name        String?
 description String?
 status      String?

 taskType     String?
 goal         Float?
 ratio        Float?
 startedAt    DateTime?
 finishedAt   DateTime?
 requestType  String?
 category1    String?
 cateogry2    String?
 priority     String?
 requiredTime Float?
 detail       String?
 url          String?
 imageUrl     String?
 remarks      String?

 DemoUser         DemoUser?       @relation(fields: [demoUserId], references: [id], onDelete: Cascade)
 demoUserId       Int?
 DemoDepartment   DemoDepartment? @relation(fields: [demoDepartmentId], references: [id], onDelete: Cascade)
 demoDepartmentId Int?
 DemoResult       DemoResult[]
}

model DemoResult {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date       DateTime
 status     Boolean?
 kpi        Float?
 DemoTask   DemoTask @relation(fields: [demoTaskId], references: [id], onDelete: Cascade)
 demoTaskId Int
}

 
model Vehicle {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name           String // 車両名
 basePrice      Float // ベース金額
 fuelEfficiency Float // 燃費
 memo           String? // メモ欄

 CarCost  CarCost[] // 諸費用
 Estimate Estimate[]
}

model CarCost {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name  String
 price Float // 諸費用の金額

 Vehicle   Vehicle @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
 vehicleId Int
}

model CommonCost {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name  String
 price Float // 諸費用の金額
}

model GasolinePrice {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date       DateTime? // 更新日
 prefecture String? // 都道府県名
 price      Float // ガソリン単価
}

model Estimate {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)
 key       String?
 email     String?

 departureTime String
 origin        String
 destination   String
 useHighway    String

 waypoint1 String?
 waypoint2 String?
 waypoint3 String?

 gasolinePrice Float // ガソリン単価
 vehiclePrice  Float // 車両価格 + 車両諸費用
 commonCost    Float // 共通諸費用
 distance      Float // 距離
 time          Float // 所要時間

 totalAmount Float // 計算結果の合計金額

 Vehicle   Vehicle @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
 vehicleId Int
}

model TabitakuMarkDown {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)

 notesOnModal String?
 introduction String?

 date           String?
 time           String?
 numberOfPeople String?
 vehicle        String?
 origin         String?
 destination    String?
 useHighway     String?
 peopleCount    String?
 request        String?

 name               String?
 tel                String?
 email              String?
 email_confirmation String?

 resultNotification String?

 confirmation String?
}

 
model LmLocation {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 name      String // レイアウトの名前

 Pdf Pdf[]
}

model Pdf {
 id           Int         @id @default(autoincrement())
 createdAt    DateTime    @default(now())
 updatedAt    DateTime?   @default(now()) @updatedAt()
 active       Boolean     @default(true)
 sortOrder    Float       @default(0)
 name         String // アップロードされたPDFの名前
 url          String // S3に保存されたPDFのURL
 json         Json? // PDFのデータ（JSON形式）
 PdfLayer     PdfLayer[] // レイヤーとの関連付け
 LmLocation   LmLocation? @relation(fields: [lmLocationId], references: [id])
 lmLocationId Int?
}

model PdfLayer {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 layerType String // レイヤーの種類
 pdfId     String // 関連するPDFのID
 Pdf       Pdf       @relation(fields: [pDFId], references: [id])
 data      Json // レイヤーのデータ（JSON形式）
 pDFId     Int
}

 
model MasterKeyClientGroup {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name            String            @unique
 MasterKeyClient MasterKeyClient[]
 User            User[]
}

model MasterKeyClient {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name  String?
 email String  @unique

 MasterKeyJob           MasterKeyJob[]
 MasterKeyApplicant     MasterKeyApplicant[]
 MasterKeyClientGroup   MasterKeyClientGroup @relation(fields: [masterKeyClientGroupId], references: [id])
 masterKeyClientGroupId Int
}

model MasterKeyJob {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 MasterKeyClient   MasterKeyClient? @relation(fields: [masterKeyClientId], references: [id])
 masterKeyClientId Int?

 // 案件№ 案件名 取引企業名	職種名	勤務地	応募用メールアドレス
 projectNumber      String?
 projectName        String?
 jobTitle           String?
 workLocation       String?
 MasterKeyApplicant MasterKeyApplicant[]

 @@unique([projectName, jobTitle, workLocation, masterKeyClientId], name: "unique_projectName_jobTitle_workLocation_masterKeyClientId")
}

model MasterKeyApplicant {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 MasterKeyClient   MasterKeyClient? @relation(fields: [masterKeyClientId], references: [id])
 masterKeyClientId Int?

 //案件名 案件No 求人名	勤務地	担当者	進捗状況	進捗詳細（面接日など）	勤務開始日	氏名	ふりがな	TEL	Mail	住所	性別	生年月日	年齢	備考・メッセージ・職歴など
 projectName     String?
 projectNumber   String?
 jobTitle        String?
 workLocation    String?
 personInCharge  String?
 progressStatus  String?
 progressDetails String?
 startDate       DateTime?
 name            String?
 kana            String?
 tel             String?
 email           String?
 address         String?
 gender          String?
 birthDate       DateTime?
 age             Int?
 remarks         String?

 // KPI関係
 // 有効応募数	不在	通電	面談確定	着席数	不採用	内定	内定後辞退	入社	退職
 validApplications  Boolean? @default(false)
 absent             Boolean? @default(false)
 connected          Boolean? @default(false)
 interviewConfirmed Boolean? @default(false)
 seated             Boolean? @default(false)
 rejected           Boolean? @default(false)
 offer              Boolean? @default(false)
 offerDeclined      Boolean? @default(false)
 joined             Boolean? @default(false)
 resigned           Boolean? @default(false)

 MasterKeyJob   MasterKeyJob @relation(fields: [masterKeyJobId], references: [id])
 masterKeyJobId Int

 @@unique([projectName, jobTitle, workLocation, masterKeyClientId], name: "unique_projectName_jobTitle_workLocation_masterKeyClientId")
}

 
model SankoshaClientA {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)
 name      String?

 relatedClientIds String[]
 SankoshaProcess  SankoshaProcess[]

 SankoshaClientB SankoshaClientB[]
 SankoshaClientC SankoshaClientC[]
 SankoshaClientD SankoshaClientD[]
 SankoshaClientE SankoshaClientE[]
}

model SankoshaClientB {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name              String?
 SankoshaProcess   SankoshaProcess[]
 SankoshaClientA   SankoshaClientA   @relation(fields: [sankoshaClientAId], references: [id], onDelete: Cascade)
 sankoshaClientAId Int
}

model SankoshaClientC {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name              String?
 SankoshaProcess   SankoshaProcess[]
 SankoshaClientA   SankoshaClientA   @relation(fields: [sankoshaClientAId], references: [id], onDelete: Cascade)
 sankoshaClientAId Int
}

model SankoshaClientD {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name              String?
 SankoshaProcess   SankoshaProcess[]
 SankoshaClientA   SankoshaClientA   @relation(fields: [sankoshaClientAId], references: [id], onDelete: Cascade)
 sankoshaClientAId Int
}

model SankoshaClientE {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name              String?
 SankoshaProcess   SankoshaProcess[]
 SankoshaClientA   SankoshaClientA   @relation(fields: [sankoshaClientAId], references: [id], onDelete: Cascade)
 sankoshaClientAId Int
}

model SankoshaProductMaster {
 id              Int               @id @default(autoincrement())
 createdAt       DateTime          @default(now())
 updatedAt       DateTime?         @updatedAt()
 sortOrder       Float             @default(0)
 name            String?
 color           String?
 SankoshaProcess SankoshaProcess[]
}

model SankoshaSizeMaster {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name            String?
 color           String?
 SankoshaProcess SankoshaProcess[]
}

model SankoshaProcess {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 photo String?

 quantity            Int?
 requestPresence     Boolean?
 requestFormNumber   String?
 plannedDeliveryDate DateTime?
 isTestProduct       Boolean?

 inspectionOk Boolean? //検品完了

 estimateIssueDate           DateTime?
 estimateIssueDateIsEmpty    Boolean? //見積書発行日が空かどうか
 orderFormArrivalDate        DateTime?
 orderFormArrivalDateisEmpty Boolean? //注文書到着日が空かどうか

 orderFormNumber String?

 processStartedAt       DateTime?
 confirmationDate       DateTime?
 notes                  String?
 completionDate         DateTime?
 shipmentCompletionDate DateTime?
 faxInvoice             Boolean?

 SankoshaProductMaster   SankoshaProductMaster? @relation(fields: [sankoshaProductMasterId], references: [id], onDelete: Cascade)
 SankoshaSizeMaster      SankoshaSizeMaster?    @relation(fields: [sankoshaSizeMasterId], references: [id], onDelete: Cascade)
 sankoshaProductMasterId Int?
 sankoshaSizeMasterId    Int?

 SankoshaClientA SankoshaClientA? @relation(fields: [sankoshaClientAId], references: [id], onDelete: Cascade)

 sankoshaClientAId Int?
 sankoshaClientBId Int?
 sankoshaClientCId Int?
 sankoshaClientDId Int?
 sankoshaClientEId Int?

 SankoshaClientB                  SankoshaClientB?                   @relation(fields: [sankoshaClientBId], references: [id])
 SankoshaClientC                  SankoshaClientC?                   @relation(fields: [sankoshaClientCId], references: [id])
 SankoshaClientD                  SankoshaClientD?                   @relation(fields: [sankoshaClientDId], references: [id])
 SankoshaClientE                  SankoshaClientE?                   @relation(fields: [sankoshaClientEId], references: [id], onDelete: Cascade)
 SankoShaEstimatePriceMasterTable SankoShaEstimatePriceMasterTable[]
 SankoshaProductImage             SankoshaProductImage[]
}

model SankoshaProductImage {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 url               String?
 SankoshaProcess   SankoshaProcess? @relation(fields: [sankoshaProcessId], references: [id])
 sankoshaProcessId Int?
}

model SankoshaPriceMaster {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name                             String?
 price                            Float?
 color                            String?
 SankoShaEstimatePriceMasterTable SankoShaEstimatePriceMasterTable[]
}

//中間テーブル
model SankoShaEstimatePriceMasterTable {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 quantity    Float?
 priceAdjust Float?

 SankoshaProcess       SankoshaProcess     @relation(fields: [sankoshaProcessId], references: [id], onDelete: Cascade)
 sankoshaProcessId     Int
 SankoshaPriceMaster   SankoshaPriceMaster @relation(fields: [sankoshaPriceMasterId], references: [id], onDelete: Cascade)
 sankoshaPriceMasterId Int
}

 
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["prismaSchemaFolder", "typedSql"]
}

model User {
  id            Int       @id @default(autoincrement())
  code          String?   @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime? @default(now()) @updatedAt()
  sortOrder     Float     @default(0)
  active        Boolean   @default(true)
  hiredAt       DateTime?
  yukyuCategory String?   @default("A")

  name                 String
  kana                 String?
  email                String?   @unique
  password             String?
  type                 String?
  role                 String    @default("user")
  tempResetCode        String?
  tempResetCodeExpired DateTime?
  storeId              Int?
  schoolId             Int?
  rentaStoreId         Int?
  type2                String?
  shopId               Int?
  membershipName       String?
  damageNameMasterId   Int?
  color                String?
  tell                 String?
  app                  String?
  apps                 String[]

  // tbm

  employeeCode String? @unique
  phone        String?

  School School? @relation(fields: [schoolId], references: [id], onDelete: Cascade)

  VideoFromUser           VideoFromUser[]
  Comment                 Comment[]
  LessonLog               LessonLog[]
  LessonLogAuthorizedUser LessonLogAuthorizedUser[]

  Payment        Payment[]
  SystemChat     SystemChat[]    @relation("user")
  SystemChatRoom SystemChatRoom?
  Ticket         Ticket[]

  GenbaDayShift GenbaDayShift[]
  SohkenCar     SohkenCar[]

  bcc String?

  masterKeyClientId      Int?
  MasterKeyClientGroup   MasterKeyClientGroup? @relation(fields: [masterKeyClientGroupId], references: [id])
  masterKeyClientGroupId Int?

  YsWorkRecord YsWorkRecord[]
  UserRole     UserRole[]
  AppLog       AppLog[]

  ApSender       ApSender[]
  ApReceiver     ApReceiver[]
  MidTsNippoUser MidTsNippoUser[]

  AqSaleCart AqSaleCart[]

  PaidLeaveGrant PaidLeaveGrant[]

  AqCustomerRecord                 AqCustomerRecord[]
  UserWorkTimeHistoryMidTable      UserWorkTimeHistoryMidTable[]
  UserPayedLeaveTypeMidTable       UserPayedLeaveTypeMidTable[]
  AqSaleRecord                     AqSaleRecord[]
  TsConstructionSubConUserMidTable TsConstructionSubConUserMidTable[]
  // TbmOperation                     TbmOperation[]
  // TbmOperationGroup                TbmOperationGroup[]
  AqCustomer                       AqCustomer[]
  TbmBase                          TbmBase?                           @relation(fields: [tbmBaseId], references: [id])
  tbmBaseId                        Int?
  TbmDriveSchedule                 TbmDriveSchedule[]
  UserWorkStatus                   UserWorkStatus[]
  OdometerInput                    OdometerInput[]
  TbmRefuelHistory                 TbmRefuelHistory[]
  DayRemarksUser                   DayRemarksUser[]
  TbmCarWashHistory                TbmCarWashHistory[]
  PurchaseRequest                  PurchaseRequest[]
  LeaveRequest                     LeaveRequest[]
  Approval                         Approval[]
  TbmVehicle                       TbmVehicle?
  KyuyoTableRecord                 KyuyoTableRecord[]
}

model ReleaseNotes {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  rootPath         String
  title            String?
  msg              String
  imgUrl           String?
  confirmedUserIds Int[]
}

model GoogleAccessToken {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  email         String  @unique
  access_token  String
  refresh_token String
  scope         String
  token_type    String
  id_token      String
  expiry_date   BigInt
  tokenJSON     String?
}

model RoleMaster {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @updatedAt
  sortOrder Float     @default(0)

  name        String     @unique
  description String?
  color       String?
  apps        String[]
  UserRole    UserRole[]
}

model UserRole {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @updatedAt
  sortOrder Float     @default(0)

  User         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId       Int
  RoleMaster   RoleMaster @relation(fields: [roleMasterId], references: [id], onDelete: Cascade)
  roleMasterId Int

  @@unique([userId, roleMasterId], name: "userId_roleMasterId_unique")
}

model ChainMethodLock {
  id        Int       @id @default(autoincrement())
  isLocked  Boolean   @default(false)
  expiresAt DateTime?
  updatedAt DateTime  @updatedAt
}

model Calendar {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  date DateTime @unique

  holidayType String @default("出勤")
}

 
model PrefCity {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)
 pref      String
 city      String
 Genba     Genba[]

 @@unique([pref, city], name: "unique_pref_city")
}

model DayRemarksUser {
 id          Int       @id @default(autoincrement())
 createdAt   DateTime  @default(now())
 updatedAt   DateTime? @default(now()) @updatedAt()
 sortOrder   Float     @default(0)
 kyuka       Boolean?  @default(false)
 kyukaTodoke Boolean?  @default(false)

 DayRemarks   DayRemarks @relation(fields: [dayRemarksId], references: [id])
 dayRemarksId Int

 User   User @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId Int

 @@unique([dayRemarksId, userId], name: "unique_dayRemarksId_userId")
}

// sohken
model Genba {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name             String?
 defaultStartTime String? //はやで、おそで、15分遅出など
 construction     String? //建築

 houseHoldsCount1 Int?
 houseHoldsCount2 Int?
 houseHoldsCount3 Int?
 houseHoldsCount4 Int?
 houseHoldsCount5 Int?
 houseHoldsCount6 Int?
 houseHoldsCount7 Int?

 warningString String?

 zip          String?
 state        String?
 city         String?
 addressLine1 String?
 addressLine2 String?

 PrefCity   PrefCity? @relation(fields: [prefCityId], references: [id])
 prefCityId Int?

 GenbaDayShift     GenbaDayShift[]
 GenbaDay          GenbaDay[]
 GenbaDaySoukenCar GenbaDaySoukenCar[]

 GenbaTask GenbaTask[]

 archived Boolean? @default(false)
}

model SohkenCar {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name  String?
 plate String?
 role  String?

 GenbaDaySoukenCar GenbaDaySoukenCar[]
 User              User?               @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId            Int?
}

model GenbaDay {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date    DateTime
 subTask String?
 remarks String?
 Genba   Genba?   @relation(fields: [genbaId], references: [id], onDelete: Cascade)
 ninku   Float?

 finished Boolean? @default(false)

 active         Boolean? @default(true)
 overStuffCount Int?     @default(0)
 status         String?

 ninkuFullfilled             Boolean? @default(false)
 isLastFullfilledDay         Boolean? @default(false)
 allAssignedNinkuTillThisDay Int?
 allRequiredNinku            Int?

 genbaId       Int?
 GenbaDayShift GenbaDayShift[]

 GenbaDaySoukenCar GenbaDaySoukenCar[]

 GenbaDayTaskMidTable GenbaDayTaskMidTable[]

 @@unique([date, genbaId], name: "unique_date_genbaId")
}

model GenbaTask {
 id            Int       @id @default(autoincrement())
 createdAt     DateTime  @default(now())
 updatedAt     DateTime? @default(now()) @updatedAt()
 sortOrder     Float     @default(0)
 name          String?
 color         String?
 from          DateTime?
 to            DateTime?
 requiredNinku Float?

 subTask String?
 remarks String?

 // status        String?

 Genba                Genba                  @relation(fields: [genbaId], references: [id])
 genbaId              Int
 GenbaDayTaskMidTable GenbaDayTaskMidTable[]

 @@unique([name, genbaId], name: "unique_name_genbaId")
}

model GenbaDayTaskMidTable {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 GenbaDay   GenbaDay @relation(fields: [genbaDayId], references: [id], onDelete: Cascade)
 genbaDayId Int

 GenbaTask   GenbaTask @relation(fields: [genbaTaskId], references: [id], onDelete: Cascade)
 genbaTaskId Int

 @@unique([genbaDayId, genbaTaskId], name: "unique_genbaDayId_genbaTaskId")
}

model GenbaDaySoukenCar {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 GenbaDay   GenbaDay @relation(fields: [genbaDayId], references: [id], onDelete: Cascade)
 genbaDayId Int

 SohkenCar   SohkenCar @relation(fields: [sohkenCarId], references: [id], onDelete: Cascade)
 sohkenCarId Int

 Genba   Genba @relation(fields: [genbaId], references: [id], onDelete: Cascade)
 genbaId Int

 @@unique([genbaDayId, sohkenCarId], name: "unique_genbaDayId_sohkenCarId")
}

model GenbaDayShift {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date      DateTime?
 from      String? // 08:00
 to        String? // 08:00
 important Boolean?  @default(false)
 shokucho  Boolean?  @default(false)

 directGo     Boolean? @default(false)
 directReturn Boolean? @default(false)

 User   User @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId Int

 GenbaDay   GenbaDay @relation(fields: [genbaDayId], references: [id], onDelete: Cascade)
 genbaDayId Int

 Genba   Genba @relation(fields: [genbaId], references: [id], onDelete: Cascade)
 genbaId Int

 @@unique([userId, genbaDayId], name: "unique_userId_genbaDayId")
}

model GenbaTaskMaster {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name  String
 color String
}

model DayRemarks {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date         DateTime @unique
 bikou        String?
 shinseiGyomu String?

 ninkuCount Float?

 DayRemarksUser DayRemarksUser[]
}

 
model TbmBase {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 code String? @unique
 name String  @unique

 User                User[]
 TbmVehicle          TbmVehicle[]
 TbmRouteGroup       TbmRouteGroup[]
 TbmDriveSchedule    TbmDriveSchedule[]
 TbmProduct          TbmProduct[]
 TbmCustomer         TbmCustomer[]
 TbmBase_MonthConfig TbmBase_MonthConfig[]
 TbmCalendar         TbmCalendar[]
}

model TbmCalendar {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date        DateTime @unique
 holidayType String?  @default("")
 remark      String?

 TbmBase   TbmBase @relation(fields: [tbmBaseId], references: [id], onDelete: Cascade)
 tbmBaseId Int

 @@unique([tbmBaseId, date], name: "unique_tbmBaseId_date")
}

model TbmRouteGroupCalendar {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date        DateTime
 holidayType String?  @default("")
 remark      String?

 TbmRouteGroup   TbmRouteGroup @relation(fields: [tbmRouteGroupId], references: [id], onDelete: Cascade)
 tbmRouteGroupId Int

 @@unique([tbmRouteGroupId, date], name: "unique_tbmRouteGroupId_date")
}

model TbmBase_MonthConfig {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 code      String?
 yearMonth DateTime

 gasolinePerLiter Float?
 keiyuPerLiter    Float?

 TbmBase   TbmBase @relation(fields: [tbmBaseId], references: [id], onDelete: Cascade)
 tbmBaseId Int

 @@unique([tbmBaseId, yearMonth], name: "unique_tbmBaseId_yearMonth")
}

model TbmVehicle {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 code String @unique

 vehicleNumber String  @unique
 type          String?
 shape         String?
 airSuspension String?
 oilTireParts  String?
 maintenance   String?
 insurance     String?

 shodoTorokubi DateTime?
 sakenManryobi DateTime?
 hokenManryobi DateTime?

 sankagetsuTenkenbi DateTime?

 TbmRefuelHistory  TbmRefuelHistory[]
 TbmBase           TbmBase             @relation(fields: [tbmBaseId], references: [id], onDelete: Cascade)
 tbmBaseId         Int
 TbmDriveSchedule  TbmDriveSchedule[]
 OdometerInput     OdometerInput[]
 TbmCarWashHistory TbmCarWashHistory[]

 User   User? @relation(fields: [userId], references: [id])
 userId Int?  @unique

 TbmVehicleMaintenanceRecord TbmVehicleMaintenanceRecord[]

 @@unique([tbmBaseId, vehicleNumber], name: "unique_tbmBaseId_vehicleNumber")
}

model TbmVehicleMaintenanceRecord {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date   DateTime
 title  String
 price  Float
 remark String?
 type   String? // 3ヶ月点検・車検・その他

 TbmVehicle   TbmVehicle? @relation(fields: [tbmVehicleId], references: [id])
 tbmVehicleId Int?
}

model TbmRouteGroup {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 code String @unique
 name String

 TbmBase   TbmBase @relation(fields: [tbmBaseId], references: [id], onDelete: Cascade)
 tbmBaseId Int

 TbmDriveSchedule TbmDriveSchedule[]

 TbmMonthlyConfigForRouteGroup TbmMonthlyConfigForRouteGroup[]
 Mid_TbmRouteGroup_TbmProduct  Mid_TbmRouteGroup_TbmProduct?
 Mid_TbmRouteGroup_TbmCustomer Mid_TbmRouteGroup_TbmCustomer?
 TbmRouteGroupCalendar         TbmRouteGroupCalendar[]

 TbmRouteGroupFee TbmRouteGroupFee[]

 @@unique([tbmBaseId, code], name: "unique_tbmBaseId_code")
}

model TbmRouteGroupFee {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 startDate  DateTime
 driverFee  Int
 billingFee Int

 TbmRouteGroup   TbmRouteGroup @relation(fields: [tbmRouteGroupId], references: [id], onDelete: Cascade)
 tbmRouteGroupId Int
}

model TbmMonthlyConfigForRouteGroup {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 yearMonth DateTime

 pickupTime  String? //接車時間
 vehicleType String? //車種

 postalFee  Int? //通行量(郵便)
 generalFee Int? //通行量（一般）
 tollFee    Float?

 numberOfTrips   Int?
 TbmRouteGroup   TbmRouteGroup @relation(fields: [tbmRouteGroupId], references: [id], onDelete: Cascade)
 tbmRouteGroupId Int

 @@unique([yearMonth, tbmRouteGroupId], name: "unique_yearMonth_tbmRouteGroupId")
}

model TbmProduct {
 id                           Int                            @id @default(autoincrement())
 createdAt                    DateTime                       @default(now())
 updatedAt                    DateTime?                      @default(now()) @updatedAt()
 sortOrder                    Float                          @default(0)
 code                         String                         @unique
 name                         String                         @unique
 Mid_TbmRouteGroup_TbmProduct Mid_TbmRouteGroup_TbmProduct[]
 TbmBase                      TbmBase                        @relation(fields: [tbmBaseId], references: [id], onDelete: Cascade)
 tbmBaseId                    Int

 @@unique([tbmBaseId, name], name: "unique_tbmBaseId_name")
}

model Mid_TbmRouteGroup_TbmProduct {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 TbmRouteGroup   TbmRouteGroup @relation(fields: [tbmRouteGroupId], references: [id], onDelete: Cascade)
 tbmRouteGroupId Int           @unique

 TbmProduct   TbmProduct @relation(fields: [tbmProductId], references: [id], onDelete: Cascade)
 tbmProductId Int

 @@unique([tbmRouteGroupId, tbmProductId], name: "unique_tbmRouteGroupId_tbmProductId")
}

model Mid_TbmRouteGroup_TbmCustomer {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 TbmRouteGroup   TbmRouteGroup @relation(fields: [tbmRouteGroupId], references: [id], onDelete: Cascade)
 tbmRouteGroupId Int           @unique

 TbmCustomer   TbmCustomer @relation(fields: [tbmCustomerId], references: [id], onDelete: Cascade)
 tbmCustomerId Int

 @@unique([tbmRouteGroupId, tbmCustomerId], name: "unique_tbmRouteGroupId_tbmCustomerId")
}

model TbmBillingAddress {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name String
}

model TbmInvoiceDetail {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 numberOfTrips   Int
 fare            Float
 toll            Float
 specialAddition Float? // 特別付加金
}

model TbmCustomer {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 code                          String?                         @unique
 name                          String                          @unique
 address                       String?
 phoneNumber                   String?
 faxNumber                     String?
 bankInformation               String?
 Mid_TbmRouteGroup_TbmCustomer Mid_TbmRouteGroup_TbmCustomer[]

 TbmBase   TbmBase @relation(fields: [tbmBaseId], references: [id], onDelete: Cascade)
 tbmBaseId Int

 @@unique([tbmBaseId, name], name: "unique_tbmBaseId_name")
}

model TbmRefuelHistory {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date     DateTime
 amount   Float
 odometer Float
 type     String

 // TbmOperationGroup TbmOperationGroup? @relation(fields: [tbmOperationGroupId], references: [id], onDelete: Cascade)
 // tbmOperationGroupId Int?

 TbmVehicle   TbmVehicle @relation(fields: [tbmVehicleId], references: [id], onDelete: Cascade)
 tbmVehicleId Int

 User   User @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId Int
}

model TbmCarWashHistory {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date  DateTime
 price Float

 TbmVehicle   TbmVehicle @relation(fields: [tbmVehicleId], references: [id], onDelete: Cascade)
 tbmVehicleId Int

 User   User @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId Int
}

model TbmDriveSchedule {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date                DateTime
 O_postalHighwayFee  Int? //高速(郵便)
 Q_generalHighwayFee Int? //高速（一般）

 User   User? @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId Int?

 TbmVehicle   TbmVehicle? @relation(fields: [tbmVehicleId], references: [id], onDelete: Cascade)
 tbmVehicleId Int?

 TbmRouteGroup   TbmRouteGroup @relation(fields: [tbmRouteGroupId], references: [id], onDelete: Cascade)
 tbmRouteGroupId Int

 finished  Boolean? @default(false)
 confirmed Boolean? @default(false)
 approved  Boolean? @default(false)

 TbmBase   TbmBase @relation(fields: [tbmBaseId], references: [id], onDelete: Cascade)
 tbmBaseId Int
}

model OdometerInput {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 odometerStart Float
 odometerEnd   Float
 date          DateTime

 TbmVehicle   TbmVehicle @relation(fields: [tbmVehicleId], references: [id], onDelete: Cascade)
 tbmVehicleId Int

 User   User @relation(fields: [userId], references: [id])
 userId Int

 @@unique([tbmVehicleId, date], name: "unique_tbmVehicleId_date")
}

model UserWorkStatus {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date       DateTime
 workStatus String?
 remark     String?

 User   User @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId Int

 @@unique([userId, date], name: "unique_userId_date")
}

model KyuyoTableRecord {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 other1      Float?
 other2      Float?
 shokuhi     Float?
 maebaraikin Float?
 rate        Float? @default(0.5)

 yearMonth DateTime
 User      User     @relation(fields: [userId], references: [id])
 userId    Int

 @@unique([userId, yearMonth], name: "unique_userId_yearMonth")
}

 
model TsMainContractor {
 id             Int              @id @default(autoincrement())
 createdAt      DateTime         @default(now())
 updatedAt      DateTime?        @default(now()) @updatedAt()
 active         Boolean          @default(true)
 sortOrder      Float            @default(0)
 name           String           @unique
 TsConstruction TsConstruction[]
}

model TsConstruction {
 id             Int       @id @default(autoincrement())
 createdAt      DateTime  @default(now())
 updatedAt      DateTime? @default(now()) @updatedAt()
 active         Boolean   @default(true)
 sortOrder      Float     @default(0)
 name           String    @unique
 address1       String?
 address2       String?
 contractAmount Float?
 budget         Float?

 TsMainContractor   TsMainContractor? @relation(fields: [tsMainContractorId], references: [id], onDelete: Cascade)
 tsMainContractorId Int?

 TsNippo                          TsNippo[]
 TsWorkContent                    TsWorkContent[]
 TsMaterial                       TsMaterial[]
 TsConstructionDiscount           TsConstructionDiscount[]
 TsConstructionSubConUserMidTable TsConstructionSubConUserMidTable[]
}

model TsConstructionSubConUserMidTable {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)

 User                 User           @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId               Int
 TsConstructionSubCon TsConstruction @relation(fields: [tsConstructionId], references: [id], onDelete: Cascade)
 tsConstructionId     Int

 @@unique([userId, tsConstructionId], name: "unique_userId_tsConstructionId")
}

model TsNippo {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)

 totalCost Float?

 date             DateTime        @default(now())
 TsConstruction   TsConstruction? @relation(fields: [tsConstructionId], references: [id], onDelete: Cascade)
 tsConstructionId Int?

 MidTsNippoUser                   MidTsNippoUser[]
 MidTsNippoTsRegularSubcontractor MidTsNippoTsRegularSubcontractor[]
 MidTsNippoTsSubcontractor        MidTsNippoTsSubcontractor[]
 MidTsNippoTsMachinery            MidTsNippoTsMachinery[]
 MidTsNippoTsMaterial             MidTsNippoTsMaterial[]
 MidTsNippoTsWorkContent          MidTsNippoTsWorkContent[]
 TsNippoRemarks                   TsNippoRemarks[]
 TsNippMannualWorkContent         TsNippMannualWorkContent[]

 @@unique([date, tsConstructionId], name: "unique_date_tsConstructionId")
}

model TsNippoRemarks {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 name      String?
 price     Int?
 TsNippo   TsNippo?  @relation(fields: [tsNippoId], references: [id], onDelete: Cascade)
 tsNippoId Int?
}

model TsNippMannualWorkContent {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 part      String?
 name      String?
 count     Int?
 unit      String?
 price     Int
 TsNippo   TsNippo?  @relation(fields: [tsNippoId], references: [id], onDelete: Cascade)
 tsNippoId Int?
}

model TsRegularSubcontractor {
 id          Int       @id @default(autoincrement())
 createdAt   DateTime  @default(now())
 updatedAt   DateTime? @default(now()) @updatedAt()
 active      Boolean   @default(true)
 sortOrder   Float     @default(0)
 name        String    @unique
 contentName String?
 unitPrice   Int?
 remarks     String?

 MidTsNippoTsRegularSubcontractor MidTsNippoTsRegularSubcontractor[]

 @@unique([contentName, name], name: "unique_contentName_name")
}

model TsSubcontractor {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 name      String    @unique
 unitPrice Int?
 remarks   String?

 MidTsNippoTsSubcontractor MidTsNippoTsSubcontractor[]
}

model TsMachinery {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 name      String    @unique
 unitPrice Int?
 unit      String?
 vendor    String?
 remarks   String?

 MidTsNippoTsMachinery MidTsNippoTsMachinery[]

 @@unique([name, vendor], name: "unique_name_vendor")
}

model TsMaterial {
 id           Int       @id @default(autoincrement())
 createdAt    DateTime  @default(now())
 updatedAt    DateTime? @default(now()) @updatedAt()
 active       Boolean   @default(true)
 sortOrder    Float     @default(0)
 materialType String?
 name         String
 vehicle      String?
 category     String?
 unitPrice    Int?
 unit         String?
 vendor       String?
 remarks      String?
 billedAt     DateTime?
 genbaName    String?

 TsConstruction   TsConstruction? @relation(fields: [tsConstructionId], references: [id], onDelete: Cascade)
 tsConstructionId Int?

 MidTsNippoTsMaterial MidTsNippoTsMaterial[]

 // @@unique([materialType, name], name: "unique_material")
}

model TsWorkContent {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)

 part           String?
 name           String?
 unit           String?
 contractAmount Float?
 unitPrice      Int?
 remarks        String?

 TsConstruction          TsConstruction            @relation(fields: [tsConstructionId], references: [id], onDelete: Cascade)
 tsConstructionId        Int
 MidTsNippoTsWorkContent MidTsNippoTsWorkContent[]
}

//中間テーブル

model MidTsNippoTsWorkContent {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 count     Float     @default(0)
 price     Float     @default(0)
 tsNippoId Int

 TsNippo       TsNippo       @relation(fields: [tsNippoId], references: [id], onDelete: Cascade)
 TsWorkContent TsWorkContent @relation(fields: [tsWorkContentId], references: [id], onDelete: Cascade)

 tsWorkContentId Int

 // @@unique([tsNippoId, tsWorkContentId], name: "unique_tsNippoId_tsWorkContentId")
}

model MidTsNippoUser {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)
 count     Float     @default(0)
 price     Float     @default(0)
 tsNippoId Int
 userId    Int

 TsNippo TsNippo @relation(fields: [tsNippoId], references: [id], onDelete: Cascade)
 User    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

 // @@unique([tsNippoId, userId], name: "unique_tsNippoId_userId")
}

model MidTsNippoTsRegularSubcontractor {
 id                       Int       @id @default(autoincrement())
 createdAt                DateTime  @default(now())
 updatedAt                DateTime? @default(now()) @updatedAt()
 active                   Boolean   @default(true)
 sortOrder                Float     @default(0)
 count                    Float     @default(0)
 price                    Float     @default(0)
 tsNippoId                Int
 tsRegularSubcontractorId Int

 TsNippo                TsNippo                @relation(fields: [tsNippoId], references: [id], onDelete: Cascade)
 TsRegularSubcontractor TsRegularSubcontractor @relation(fields: [tsRegularSubcontractorId], references: [id], onDelete: Cascade)

 // @@unique([tsNippoId, tsRegularSubcontractorId], name: "unique_tsNippoId_tsRegularSubcontractorId")
}

model MidTsNippoTsSubcontractor {
 id                Int             @id @default(autoincrement())
 createdAt         DateTime        @default(now())
 updatedAt         DateTime?       @default(now()) @updatedAt()
 active            Boolean         @default(true)
 sortOrder         Float           @default(0)
 count             Float           @default(0)
 price             Float           @default(0)
 tsNippoId         Int
 tsSubcontractorId Int
 TsNippo           TsNippo         @relation(fields: [tsNippoId], references: [id], onDelete: Cascade)
 TsSubcontractor   TsSubcontractor @relation(fields: [tsSubcontractorId], references: [id], onDelete: Cascade)

 // @@unique([tsNippoId, tsSubcontractorId], name: "unique_tsNippoId_tsSubcontractorId")
}

model MidTsNippoTsMachinery {
 id            Int       @id @default(autoincrement())
 createdAt     DateTime  @default(now())
 updatedAt     DateTime? @default(now()) @updatedAt()
 active        Boolean   @default(true)
 sortOrder     Float     @default(0)
 count         Float     @default(0)
 price         Float     @default(0)
 tsNippoId     Int
 tsMachineryId Int

 TsNippo     TsNippo     @relation(fields: [tsNippoId], references: [id], onDelete: Cascade)
 TsMachinery TsMachinery @relation(fields: [tsMachineryId], references: [id], onDelete: Cascade)

 // @@unique([tsNippoId, tsMachineryId], name: "unique_tsNippoId_tsMachineryId")
}

model MidTsNippoTsMaterial {
 id           Int       @id @default(autoincrement())
 createdAt    DateTime  @default(now())
 updatedAt    DateTime? @default(now()) @updatedAt()
 active       Boolean   @default(true)
 sortOrder    Float     @default(0)
 count        Float     @default(0)
 price        Float     @default(0)
 tsNippoId    Int
 tsMaterialId Int

 TsNippo    TsNippo    @relation(fields: [tsNippoId], references: [id], onDelete: Cascade)
 TsMaterial TsMaterial @relation(fields: [tsMaterialId], references: [id], onDelete: Cascade)

 // @@unique([tsNippoId, tsMaterialId], name: "unique_tsNippoId_tsMaterialId")
}

model TsConstructionDiscount {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 active    Boolean   @default(true)
 sortOrder Float     @default(0)

 monthStr String
 price    Float

 TsConstruction   TsConstruction @relation(fields: [tsConstructionId], references: [id], onDelete: Cascade)
 tsConstructionId Int

 @@unique([monthStr, tsConstructionId], name: "unique_monthStr_tsConstructionId")
}

 
model YsWorkRecord {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date      DateTime?
 from      DateTime?
 to        DateTime?
 breakTime Float?

 User            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId          Int
 TimeCardHistory TimeCardHistory[]

 @@unique([date, userId], name: "unique_date_userId")
}

model YsHoliday {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date DateTime @unique
}

model YsCalendarHoliday {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @updatedAt
 sortOrder Float     @default(0)

 date    DateTime
 remarks String?
 type    String?

 WorkType   WorkType? @relation(fields: [workTypeId], references: [id], onDelete: Cascade)
 workTypeId Int?

 @@unique([date, workTypeId], name: "unique_date_workTypeId")
}

model WorkType {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @updatedAt
 sortOrder Float     @default(0)
 name      String    @unique

 legalHoliday         String?
 work_startTime       String  @default("08:30")
 work_endTime         String  @default("17:00")
 lunchBreak_startTime String  @default("12:00")
 lunchBreak_endTime   String  @default("13:00")
 workMins             Int     @default(450)
 fixedOvertime        String  @default("19:10")

 YsCalendarHoliday           YsCalendarHoliday[]
 UserWorkTimeHistoryMidTable UserWorkTimeHistoryMidTable[]
}

model UserWorkTimeHistoryMidTable {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @updatedAt
 sortOrder Float     @default(0)

 from DateTime
 // to   DateTime?

 User   User @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId Int

 WorkType   WorkType @relation(fields: [workTypeId], references: [id], onDelete: Cascade)
 workTypeId Int

 @@unique([from, userId], name: "unique_from_userId")
}

model UserPayedLeaveTypeMidTable {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @updatedAt
 sortOrder Float     @default(0)

 from DateTime
 // to   DateTime?

 User   User? @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId Int?

 PayedLeaveType   PayedLeaveType @relation(fields: [payedLeaveTypeId], references: [id], onDelete: Cascade)
 payedLeaveTypeId Int
}

model PaidLeaveGrant {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @updatedAt
 sortOrder Float     @default(0)

 grantedAt DateTime
 mins      Int // 有給の量を分単位で管理
 remarks   String?

 User      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
 userId    Int
 expiresAt DateTime?

 @@unique([grantedAt, userId], name: "unique_grantedAt_userId")
}

model PayedLeaveType {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @updatedAt
 sortOrder Float     @default(0)

 name                       String                       @unique //社員など
 PayedLeaveAssignmentCount  PayedLeaveAssignmentCount[]
 UserPayedLeaveTypeMidTable UserPayedLeaveTypeMidTable[]
}

model PayedLeaveAssignmentCount {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @updatedAt
 sortOrder Float     @default(0)

 monthsAfter      Int
 payedLeaveCount  Int
 PayedLeaveType   PayedLeaveType @relation(fields: [payedLeaveTypeId], references: [id], onDelete: Cascade)
 payedLeaveTypeId Int
}

model YsManualUserRow {
 id                     Int       @id @default(autoincrement())
 createdAt              DateTime  @default(now())
 updatedAt              DateTime? @updatedAt
 sortOrder              Float     @default(0)
 uuid                   String?   @unique @default(uuid())
 code                   String
 name                   String?   @unique
 prescribedWorkingDays  Float?    @default(0)
 workingDays            Float?    @default(0)
 holidayWorkDays        Float?    @default(0)
 furikyu                Float?    @default(0)
 absentDays             Float?    @default(0)
 prescribedHolidays     Float?    @default(0)
 Sum_payedLeaveUsed     Float?    @default(0)
 totalRemainingMinutes  Float?    @default(0)
 substituteHolidayOwned Float?    @default(0)
 privateCarUsageKm      Float?    @default(0)
 overTime               Float?    @default(0)
 month                  DateTime

 @@unique([month, code], name: "unique_month_code")
}

model TimeCardHistory {
 id             Int          @id @default(autoincrement())
 createdAt      DateTime     @default(now())
 updatedAt      DateTime?    @updatedAt
 sortOrder      Float        @default(0)
 date           DateTime?
 from           DateTime?
 to             DateTime?
 breakTime      Float?
 lat            Float?
 lng            Float?
 YsWorkRecord   YsWorkRecord @relation(fields: [ysWorkRecordId], references: [id], onDelete: Cascade)
 ysWorkRecordId Int
}

 `;
