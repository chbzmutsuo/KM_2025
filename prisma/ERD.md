```mermaid
erDiagram

  "BigCategory" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    String color "❓"
    }


  "MiddleCategory" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    }


  "Lesson" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    String description "❓"
    }


  "Ticket" {
    Int id "🗝️"
    Boolean active
    Float sortOrder
    DateTime createdAt "❓"
    DateTime updatedAt "❓"
    DateTime payedAt "❓"
    DateTime usedAt "❓"
    String type "❓"
    }


  "Payment" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    }


  "LessonLogAuthorizedUser" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String comment "❓"
    }


  "LessonLog" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    Boolean isPassed
    Int authorizerId "❓"
    Boolean isPaid
    Boolean isSuspended
    }


  "VideoFromUser" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    }


  "LessonImage" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    String description "❓"
    String type "❓"
    String url "❓"
    }


  "Comment" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String message "❓"
    Boolean read
    String url "❓"
    }


  "SystemChatRoom" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    }


  "SystemChat" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String message "❓"
    String url "❓"
    Boolean read
    }


  "ApRequestTypeMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    String color "❓"
    String description "❓"
    }


  "ApCustomField" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    String type
    Boolean required
    String remarks "❓"
    }


  "ApRequest" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String status "❓"
    Boolean withdrawn "❓"
    Boolean forceApproved "❓"
    }


  "ApSender" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    }


  "ApReceiver" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String status "❓"
    String comment "❓"
    }


  "ApCustomFieldValue" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String string "❓"
    Float number "❓"
    DateTime date "❓"
    Int apRequestTypeMasterId "❓"
    }


  "School" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    }


  "LearningRoleMasterOnGame" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    String color "❓"
    Int maxCount "❓"
    }


  "SubjectNameMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    String color "❓"
    }


  "Teacher" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    String kana "❓"
    String email "❓"
    String password "❓"
    String role "❓"
    String tempResetCode "❓"
    DateTime tempResetCodeExpired "❓"
    String type "❓"
    }


  "Student" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    String kana "❓"
    String gender "❓"
    Int attendanceNumber "❓"
    }


  "UnfitFellow" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    }


  "Classroom" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String grade "❓"
    String class "❓"
    }


  "TeacherClass" {
    Int id "🗝️"
    Float sortOrder
    }


  "GameStudent" {
    Int id "🗝️"
    Float sortOrder
    DateTime createdAt
    DateTime updatedAt "❓"
    }


  "Game" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    DateTime date
    String secretKey
    Int absentStudentIds
    String status "❓"
    Int activeGroupId "❓"
    Int activeQuestionPromptId "❓"
    Int nthTime "❓"
    Int randomTargetStudentIds
    String learningContent "❓"
    String task "❓"
    }


  "GroupCreateConfig" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String groupCreationMode "❓"
    Int count "❓"
    String criteria "❓"
    String genderConfig "❓"
    }


  "Group" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    Boolean isSaved
    }


  "Squad" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    }


  "StudentRole" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    }


  "QuestionPrompt" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    Boolean asSummary
    }


  "Answer" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    Int curiocity1 "❓"
    Int curiocity2 "❓"
    Int curiocity3 "❓"
    Int curiocity4 "❓"
    Int curiocity5 "❓"
    Int efficacy1 "❓"
    Int efficacy2 "❓"
    Int efficacy3 "❓"
    Int efficacy4 "❓"
    Int efficacy5 "❓"
    String impression "❓"
    Boolean asSummary
    String lessonImpression "❓"
    Int lessonSatisfaction "❓"
    }


  "KaizenClient" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    String organization "❓"
    String iconUrl "❓"
    String bannerUrl "❓"
    String website "❓"
    String note "❓"
    Boolean public "❓"
    DateTime introductionRequestedAt "❓"
    }


  "KaizenReview" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String username "❓"
    String review "❓"
    String platform "❓"
    }


  "KaizenWork" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String uuid "❓"
    DateTime date "❓"
    String title "❓"
    String subtitle "❓"
    String status "❓"
    String description "❓"
    String points "❓"
    String clientName "❓"
    String organization "❓"
    Float dealPoint "❓"
    Float toolPoint "❓"
    String impression "❓"
    String reply "❓"
    String jobCategory "❓"
    String systemCategory "❓"
    String collaborationTool "❓"
    Boolean showName "❓"
    Boolean allowShowClient "❓"
    Boolean isPublic "❓"
    String correctionRequest "❓"
    }


  "KaizenWorkImage" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String url
    }


  "KaizenCMS" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String contactPageMsg "❓"
    String principlePageMsg "❓"
    }


  "AppLog" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    Int diffTime "❓"
    String userAgent "❓"
    String referrerUrl "❓"
    DateTime timestamp
    String pageName "❓"
    String pageUrl "❓"
    Json pageParams "❓"
    Json dataLogComponent "❓"
    String functionName "❓"
    Json functionArgs "❓"
    Json functionReturnValue "❓"
    String consoleInfo
    String actionType "❓"
    Int pageLoadTime "❓"
    String errorMessage "❓"
    Int sessionDuration "❓"
    }


  "AqSaleCart" {
    Int id "🗝️"
    String baseOrderId "❓"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    String paymentMethod
    }


  "AqSaleRecord" {
    String baseSaleRecordId "❓"
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    Int quantity
    Float price
    Float taxRate "❓"
    Float taxedPrice "❓"
    String remarks "❓"
    DateTime subscriptionYearMonth "❓"
    }


  "AqProduct" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String productCode "❓"
    String name
    Boolean fromBase "❓"
    Float cost
    Float taxRate
    Int stock
    Boolean inInventoryManagement
    }


  "AqPriceOption" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    Float price "❓"
    }


  "AqCustomer" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String email "❓"
    String customerNumber "❓"
    Boolean fromBase "❓"
    String companyName "❓"
    String jobTitle "❓"
    String name "❓"
    String defaultPaymentMethod "❓"
    String furikomisakiCD "❓"
    String tel "❓"
    String tel2 "❓"
    String fax "❓"
    String invoiceNumber "❓"
    String status "❓"
    Boolean domestic
    String postal "❓"
    String state "❓"
    String city "❓"
    String street "❓"
    String building "❓"
    String remarks "❓"
    DateTime firstVisitDate "❓"
    DateTime lastVisitDate "❓"
    Int maintananceYear "❓"
    Int maintananceMonth "❓"
    }


  "AqCustomerSubscription" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    Boolean active
    Int maintananceYear
    Int maintananceMonth
    String remarks "❓"
    }


  "AqCustomerPriceOption" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    }


  "AqCustomerRecord" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date "❓"
    String status "❓"
    String type "❓"
    String content "❓"
    String remarks "❓"
    }


  "AqCustomerRecordAttachment" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String title "❓"
    String url "❓"
    }


  "AqSupportGroupMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    String color "❓"
    }


  "AqProductCategoryMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    String color "❓"
    }


  "AqServiecTypeMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    String color "❓"
    }


  "AqDealerMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    String color "❓"
    }


  "aqDeviceMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    String color "❓"
    }


  "AqCustomerDealerMidTable" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    }


  "AqCustomerServiceTypeMidTable" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    }


  "AqCustomerDeviceMidTable" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    }


  "AqCustomerSupportGroupMidTable" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime from
    DateTime to "❓"
    }


  "AqInventoryRegister" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    Int quantity
    String remarks "❓"
    }


  "AqInventoryByMonth" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String key
    DateTime yearMonth
    Int count
    }


  "DemoUser" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    String email "❓"
    }


  "DemoDepartment" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    }


  "DemoUserDepartment" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    }


  "DemoStock" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    Int quantity "❓"
    }


  "DemoItem" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    String imageUrl "❓"
    }


  "DemoTask" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    String description "❓"
    String status "❓"
    String taskType "❓"
    Float goal "❓"
    Float ratio "❓"
    DateTime startedAt "❓"
    DateTime finishedAt "❓"
    String requestType "❓"
    String category1 "❓"
    String cateogry2 "❓"
    String priority "❓"
    Float requiredTime "❓"
    String detail "❓"
    String url "❓"
    String imageUrl "❓"
    String remarks "❓"
    }


  "DemoResult" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    Boolean status "❓"
    Float kpi "❓"
    }


  "Vehicle" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    Float basePrice
    Float fuelEfficiency
    String memo "❓"
    }


  "CarCost" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    Float price
    }


  "CommonCost" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    Float price
    }


  "GasolinePrice" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date "❓"
    String prefecture "❓"
    Float price
    }


  "Estimate" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String key "❓"
    String email "❓"
    String departureTime
    String origin
    String destination
    String useHighway
    String waypoint1 "❓"
    String waypoint2 "❓"
    String waypoint3 "❓"
    Float gasolinePrice
    Float vehiclePrice
    Float commonCost
    Float distance
    Float time
    Float totalAmount
    }


  "TabitakuMarkDown" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String notesOnModal "❓"
    String introduction "❓"
    String date "❓"
    String time "❓"
    String numberOfPeople "❓"
    String vehicle "❓"
    String origin "❓"
    String destination "❓"
    String useHighway "❓"
    String peopleCount "❓"
    String request "❓"
    String name "❓"
    String tel "❓"
    String email "❓"
    String email_confirmation "❓"
    String resultNotification "❓"
    String confirmation "❓"
    }


  "LmLocation" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    }


  "Pdf" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    String url
    Json json "❓"
    }


  "PdfLayer" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String layerType
    String pdfId
    Json data
    }


  "MasterKeyClientGroup" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    }


  "MasterKeyClient" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    String email
    }


  "MasterKeyJob" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String projectNumber "❓"
    String projectName "❓"
    String jobTitle "❓"
    String workLocation "❓"
    }


  "MasterKeyApplicant" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String projectName "❓"
    String projectNumber "❓"
    String jobTitle "❓"
    String workLocation "❓"
    String personInCharge "❓"
    String progressStatus "❓"
    String progressDetails "❓"
    DateTime startDate "❓"
    String name "❓"
    String kana "❓"
    String tel "❓"
    String email "❓"
    String address "❓"
    String gender "❓"
    DateTime birthDate "❓"
    Int age "❓"
    String remarks "❓"
    Boolean validApplications "❓"
    Boolean absent "❓"
    Boolean connected "❓"
    Boolean interviewConfirmed "❓"
    Boolean seated "❓"
    Boolean rejected "❓"
    Boolean offer "❓"
    Boolean offerDeclined "❓"
    Boolean joined "❓"
    Boolean resigned "❓"
    }


  "SankoshaClientA" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    String relatedClientIds
    }


  "SankoshaClientB" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    }


  "SankoshaClientC" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    }


  "SankoshaClientD" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    }


  "SankoshaClientE" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    }


  "SankoshaProductMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    String color "❓"
    }


  "SankoshaSizeMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    String color "❓"
    }


  "SankoshaProcess" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String photo "❓"
    Int quantity "❓"
    Boolean requestPresence "❓"
    String requestFormNumber "❓"
    DateTime plannedDeliveryDate "❓"
    Boolean isTestProduct "❓"
    Boolean inspectionOk "❓"
    DateTime estimateIssueDate "❓"
    Boolean estimateIssueDateIsEmpty "❓"
    DateTime orderFormArrivalDate "❓"
    Boolean orderFormArrivalDateisEmpty "❓"
    String orderFormNumber "❓"
    DateTime processStartedAt "❓"
    DateTime confirmationDate "❓"
    String notes "❓"
    DateTime completionDate "❓"
    DateTime shipmentCompletionDate "❓"
    Boolean faxInvoice "❓"
    }


  "SankoshaProductImage" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String url "❓"
    }


  "SankoshaPriceMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    Float price "❓"
    String color "❓"
    }


  "SankoShaEstimatePriceMasterTable" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    Float quantity "❓"
    Float priceAdjust "❓"
    }


  "User" {
    Int id "🗝️"
    String code "❓"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    Boolean active
    DateTime hiredAt "❓"
    String yukyuCategory "❓"
    String name
    String kana "❓"
    String email "❓"
    String password "❓"
    String type "❓"
    String role
    String tempResetCode "❓"
    DateTime tempResetCodeExpired "❓"
    Int storeId "❓"
    Int rentaStoreId "❓"
    String type2 "❓"
    Int shopId "❓"
    String membershipName "❓"
    Int damageNameMasterId "❓"
    String color "❓"
    String tell "❓"
    String app "❓"
    String apps
    String employeeCode "❓"
    String phone "❓"
    String bcc "❓"
    Int masterKeyClientId "❓"
    }


  "ReleaseNotes" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String rootPath
    String title "❓"
    String msg
    String imgUrl "❓"
    Int confirmedUserIds
    }


  "GoogleAccessToken" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String email
    String access_token "❓"
    String refresh_token "❓"
    String scope "❓"
    String token_type "❓"
    String id_token "❓"
    DateTime expiry_date "❓"
    String tokenJSON "❓"
    }


  "RoleMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    String description "❓"
    String color "❓"
    String apps
    }


  "UserRole" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    }


  "ChainMethodLock" {
    Int id "🗝️"
    Boolean isLocked
    DateTime expiresAt "❓"
    DateTime updatedAt
    }


  "Calendar" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    String holidayType
    }


  "Product" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String code "❓"
    String name "❓"
    }


  "ShiireSaki" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String code
    String name
    String email "❓"
    }


  "PurchaseRequest" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String purchaseType
    Int quantity
    String reason
    String result "❓"
    String approverComment "❓"
    Boolean trashed
    }


  "LeaveRequest" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime startDate
    DateTime endDate
    String leaveType
    String reason
    }


  "Approval" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    Int index
    String type
    String status
    DateTime notifiedAt "❓"
    String comment "❓"
    }


  "PrefCity" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String pref
    String city
    }


  "DayRemarksUser" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    Boolean kyuka "❓"
    Boolean kyukaTodoke "❓"
    }


  "Genba" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    String defaultStartTime "❓"
    String construction "❓"
    Int houseHoldsCount1 "❓"
    Int houseHoldsCount2 "❓"
    Int houseHoldsCount3 "❓"
    Int houseHoldsCount4 "❓"
    Int houseHoldsCount5 "❓"
    Int houseHoldsCount6 "❓"
    Int houseHoldsCount7 "❓"
    String warningString "❓"
    String zip "❓"
    String state "❓"
    String city "❓"
    String addressLine1 "❓"
    String addressLine2 "❓"
    Boolean archived "❓"
    }


  "SohkenCar" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    String plate "❓"
    String role "❓"
    }


  "GenbaDay" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    String subTask "❓"
    String remarks "❓"
    Float ninku "❓"
    Boolean finished "❓"
    Boolean active "❓"
    Int overStuffCount "❓"
    String status "❓"
    Boolean ninkuFullfilled "❓"
    Boolean isLastFullfilledDay "❓"
    Int allAssignedNinkuTillThisDay "❓"
    Int allRequiredNinku "❓"
    }


  "GenbaTask" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name "❓"
    String color "❓"
    DateTime from "❓"
    DateTime to "❓"
    Float requiredNinku "❓"
    String subTask "❓"
    String remarks "❓"
    }


  "GenbaDayTaskMidTable" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    }


  "GenbaDaySoukenCar" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    }


  "GenbaDayShift" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date "❓"
    String from "❓"
    String to "❓"
    Boolean important "❓"
    Boolean shokucho "❓"
    Boolean directGo "❓"
    Boolean directReturn "❓"
    }


  "GenbaTaskMaster" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    String color
    }


  "DayRemarks" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    String bikou "❓"
    String shinseiGyomu "❓"
    Float ninkuCount "❓"
    }


  "SohkenGoogleCalendar" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String calendarId
    DateTime date
    DateTime startAt "❓"
    DateTime endAt "❓"
    String summary "❓"
    }


  "TbmBase" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String code "❓"
    String name
    }


  "TbmCalendar" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    String holidayType "❓"
    String remark "❓"
    }


  "TbmRouteGroupCalendar" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    String holidayType "❓"
    String remark "❓"
    }


  "TbmBase_MonthConfig" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String code "❓"
    DateTime yearMonth
    Float gasolinePerLiter "❓"
    Float keiyuPerLiter "❓"
    }


  "TbmVehicle" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String code
    String vehicleNumber
    String type "❓"
    String shape "❓"
    String airSuspension "❓"
    String oilTireParts "❓"
    String maintenance "❓"
    String insurance "❓"
    DateTime shodoTorokubi "❓"
    DateTime sakenManryobi "❓"
    DateTime hokenManryobi "❓"
    DateTime sankagetsuTenkenbi "❓"
    }


  "TbmVehicleMaintenanceRecord" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    String title
    Float price
    String remark "❓"
    String type "❓"
    }


  "TbmRouteGroup" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String code
    String name
    }


  "TbmRouteGroupFee" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime startDate
    Int driverFee
    Int billingFee
    }


  "TbmMonthlyConfigForRouteGroup" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime yearMonth
    String pickupTime "❓"
    String vehicleType "❓"
    Int postalFee "❓"
    Int generalFee "❓"
    Float tollFee "❓"
    Int numberOfTrips "❓"
    }


  "TbmProduct" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String code
    String name
    }


  "Mid_TbmRouteGroup_TbmProduct" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    }


  "Mid_TbmRouteGroup_TbmCustomer" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    }


  "TbmBillingAddress" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    }


  "TbmInvoiceDetail" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    Int numberOfTrips
    Float fare
    Float toll
    Float specialAddition "❓"
    }


  "TbmCustomer" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String code "❓"
    String name
    String address "❓"
    String phoneNumber "❓"
    String faxNumber "❓"
    String bankInformation "❓"
    }


  "TbmRefuelHistory" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    Float amount
    Float odometer
    String type
    }


  "TbmCarWashHistory" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    Float price
    }


  "TbmDriveSchedule" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    Int O_postalHighwayFee "❓"
    Int Q_generalHighwayFee "❓"
    Boolean finished "❓"
    Boolean confirmed "❓"
    Boolean approved "❓"
    }


  "OdometerInput" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    Float odometerStart
    Float odometerEnd
    DateTime date
    }


  "UserWorkStatus" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    String workStatus "❓"
    String remark "❓"
    }


  "KyuyoTableRecord" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    Float other1 "❓"
    Float other2 "❓"
    Float shokuhi "❓"
    Float maebaraikin "❓"
    Float rate "❓"
    DateTime yearMonth
    }


  "TsMainContractor" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    }


  "TsConstruction" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    String address1 "❓"
    String address2 "❓"
    Float contractAmount "❓"
    Float budget "❓"
    }


  "TsConstructionSubConUserMidTable" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    }


  "TsNippo" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    Float totalCost "❓"
    DateTime date
    }


  "TsNippoRemarks" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name "❓"
    Int price "❓"
    }


  "TsNippMannualWorkContent" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String part "❓"
    String name "❓"
    Int count "❓"
    String unit "❓"
    Int price
    }


  "TsRegularSubcontractor" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    String contentName "❓"
    Int unitPrice "❓"
    String remarks "❓"
    }


  "TsSubcontractor" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    Int unitPrice "❓"
    String remarks "❓"
    }


  "TsMachinery" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String name
    Int unitPrice "❓"
    String unit "❓"
    String vendor "❓"
    String remarks "❓"
    }


  "TsMaterial" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String materialType "❓"
    String name
    String vehicle "❓"
    String category "❓"
    Int unitPrice "❓"
    String unit "❓"
    String vendor "❓"
    String remarks "❓"
    DateTime billedAt "❓"
    String genbaName "❓"
    }


  "TsWorkContent" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String part "❓"
    String name "❓"
    String unit "❓"
    Float contractAmount "❓"
    Int unitPrice "❓"
    String remarks "❓"
    }


  "MidTsNippoTsWorkContent" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    Float count
    Float price
    }


  "MidTsNippoUser" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    Float count
    Float price
    }


  "MidTsNippoTsRegularSubcontractor" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    Float count
    Float price
    }


  "MidTsNippoTsSubcontractor" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    Float count
    Float price
    }


  "MidTsNippoTsMachinery" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    Float count
    Float price
    }


  "MidTsNippoTsMaterial" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    Float count
    Float price
    }


  "TsConstructionDiscount" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Boolean active
    Float sortOrder
    String monthStr
    Float price
    }


  "YsWorkRecord" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date "❓"
    DateTime from "❓"
    DateTime to "❓"
    Float breakTime "❓"
    }


  "YsHoliday" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    }


  "YsCalendarHoliday" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date
    String remarks "❓"
    String type "❓"
    }


  "WorkType" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    String legalHoliday "❓"
    String work_startTime
    String work_endTime
    String lunchBreak_startTime
    String lunchBreak_endTime
    Int workMins
    String fixedOvertime
    }


  "UserWorkTimeHistoryMidTable" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime from
    }


  "UserPayedLeaveTypeMidTable" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime from
    }


  "PaidLeaveGrant" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime grantedAt
    Int mins
    String remarks "❓"
    DateTime expiresAt "❓"
    }


  "PayedLeaveType" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String name
    }


  "PayedLeaveAssignmentCount" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    Int monthsAfter
    Int payedLeaveCount
    }


  "YsManualUserRow" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    String uuid "❓"
    String code
    String name "❓"
    Float prescribedWorkingDays "❓"
    Float workingDays "❓"
    Float holidayWorkDays "❓"
    Float furikyu "❓"
    Float absentDays "❓"
    Float prescribedHolidays "❓"
    Float Sum_payedLeaveUsed "❓"
    Float totalRemainingMinutes "❓"
    Float substituteHolidayOwned "❓"
    Float privateCarUsageKm "❓"
    Float overTime "❓"
    DateTime month
    }


  "TimeCardHistory" {
    Int id "🗝️"
    DateTime createdAt
    DateTime updatedAt "❓"
    Float sortOrder
    DateTime date "❓"
    DateTime from "❓"
    DateTime to "❓"
    Float breakTime "❓"
    Float lat "❓"
    Float lng "❓"
    }

    "BigCategory" o{--}o "MiddleCategory" : "MiddleCategory"
    "MiddleCategory" o{--}o "Lesson" : "Lesson"
    "MiddleCategory" o|--|| "BigCategory" : "BigCategory"
    "Lesson" o|--|| "MiddleCategory" : "MiddleCategory"
    "Lesson" o{--}o "LessonImage" : "LessonImage"
    "Lesson" o{--}o "LessonLog" : "LessonLog"
    "Ticket" o|--|o "LessonLog" : "LessonLog"
    "Ticket" o|--|o "User" : "User"
    "Payment" o|--|| "LessonLog" : "LessonLog"
    "Payment" o|--|| "User" : "User"
    "LessonLogAuthorizedUser" o|--|| "LessonLog" : "LessonLog"
    "LessonLogAuthorizedUser" o|--|| "User" : "User"
    "LessonLog" o{--}o "Comment" : "Comment"
    "LessonLog" o|--|| "Lesson" : "Lesson"
    "LessonLog" o|--|| "User" : "User"
    "LessonLog" o{--}o "LessonLogAuthorizedUser" : "LessonLogAuthorizedUser"
    "LessonLog" o{--}o "Payment" : "Payment"
    "LessonLog" o{--}o "Ticket" : "Ticket"
    "LessonLog" o{--}o "VideoFromUser" : "VideoFromUser"
    "VideoFromUser" o|--|| "LessonLog" : "LessonLog"
    "VideoFromUser" o|--|| "User" : "User"
    "LessonImage" o|--|| "Lesson" : "Lesson"
    "Comment" o|--|| "LessonLog" : "LessonLog"
    "Comment" o|--|| "User" : "User"
    "SystemChatRoom" o{--}o "SystemChat" : "SystemChat"
    "SystemChatRoom" o|--|| "User" : "User"
    "SystemChat" o|--|| "SystemChatRoom" : "SystemChatRoom"
    "SystemChat" o|--|| "User" : "User"
    "ApRequestTypeMaster" o{--}o "ApCustomField" : "ApCustomField"
    "ApRequestTypeMaster" o{--}o "ApRequest" : "ApRequest"
    "ApCustomField" o{--}o "ApCustomFieldValue" : "ApCustomFieldValue"
    "ApCustomField" o|--|o "ApRequestTypeMaster" : "ApRequestTypeMaster"
    "ApRequest" o|--|| "ApRequestTypeMaster" : "ApRequestTypeMaster"
    "ApRequest" o|--|| "ApSender" : "ApSender"
    "ApRequest" o{--}o "ApReceiver" : "ApReceiver"
    "ApRequest" o{--}o "ApCustomFieldValue" : "ApCustomFieldValue"
    "ApSender" o|--|| "User" : "User"
    "ApSender" o{--}o "ApRequest" : "ApRequest"
    "ApReceiver" o|--|| "User" : "User"
    "ApReceiver" o|--|| "ApRequest" : "ApRequest"
    "ApCustomFieldValue" o|--|| "ApRequest" : "ApRequest"
    "ApCustomFieldValue" o|--|| "ApCustomField" : "ApCustomField"
    "School" o{--}o "Classroom" : "Classroom"
    "School" o{--}o "Game" : "Game"
    "School" o{--}o "Student" : "Student"
    "School" o{--}o "SubjectNameMaster" : "SubjectNameMaster"
    "School" o{--}o "Teacher" : "Teacher"
    "School" o{--}o "User" : "User"
    "LearningRoleMasterOnGame" o|--|| "Game" : "Game"
    "LearningRoleMasterOnGame" o{--}o "StudentRole" : "StudentRole"
    "SubjectNameMaster" o{--}o "Game" : "Game"
    "SubjectNameMaster" o|--|| "School" : "School"
    "Teacher" o{--}o "Game" : "Game"
    "Teacher" o|--|o "School" : "School"
    "Teacher" o{--}o "TeacherClass" : "TeacherClass"
    "Student" o{--}o "Answer" : "Answer"
    "Student" o|--|| "Classroom" : "Classroom"
    "Student" o|--|| "School" : "School"
    "Student" o{--}o "Squad" : "Squad"
    "Student" o{--}o "UnfitFellow" : "UnfitFellow"
    "Student" o{--}o "GameStudent" : "GameStudent"
    "Student" o{--}o "StudentRole" : "StudentRole"
    "UnfitFellow" o{--}o "Student" : "Student"
    "Classroom" o|--|| "School" : "School"
    "Classroom" o{--}o "Student" : "Student"
    "Classroom" o{--}o "TeacherClass" : "TeacherClass"
    "TeacherClass" o|--|| "Classroom" : "Classroom"
    "TeacherClass" o|--|| "Teacher" : "Teacher"
    "GameStudent" o|--|| "Game" : "Game"
    "GameStudent" o|--|| "Student" : "Student"
    "Game" o{--}o "Answer" : "Answer"
    "Game" o|--|| "School" : "School"
    "Game" o|--|o "SubjectNameMaster" : "SubjectNameMaster"
    "Game" o|--|| "Teacher" : "Teacher"
    "Game" o{--}o "Group" : "Group"
    "Game" o{--}o "QuestionPrompt" : "QuestionPrompt"
    "Game" o{--}o "GameStudent" : "GameStudent"
    "Game" o{--}o "LearningRoleMasterOnGame" : "LearningRoleMasterOnGame"
    "Game" o{--}o "GroupCreateConfig" : "GroupCreateConfig"
    "GroupCreateConfig" o|--|| "Game" : "Game"
    "Group" o|--|| "Game" : "Game"
    "Group" o{--}o "Squad" : "Squad"
    "Group" o|--|o "QuestionPrompt" : "QuestionPrompt"
    "Squad" o|--|| "Group" : "Group"
    "Squad" o{--}o "Student" : "Student"
    "Squad" o{--}o "StudentRole" : "StudentRole"
    "StudentRole" o|--|| "Squad" : "Squad"
    "StudentRole" o|--|| "Student" : "Student"
    "StudentRole" o|--|| "LearningRoleMasterOnGame" : "LearningRoleMasterOnGame"
    "QuestionPrompt" o{--}o "Answer" : "Answer"
    "QuestionPrompt" o{--}o "Group" : "Group"
    "QuestionPrompt" o|--|| "Game" : "Game"
    "Answer" o|--|| "Game" : "Game"
    "Answer" o|--|o "QuestionPrompt" : "QuestionPrompt"
    "Answer" o|--|| "Student" : "Student"
    "KaizenClient" o{--}o "KaizenWork" : "KaizenWork"
    "KaizenClient" o{--}o "KaizenReview" : "KaizenReview"
    "KaizenReview" o|--|o "KaizenClient" : "KaizenClient"
    "KaizenWork" o{--}o "KaizenWorkImage" : "KaizenWorkImage"
    "KaizenWork" o|--|o "KaizenClient" : "KaizenClient"
    "KaizenWorkImage" o|--|o "KaizenWork" : "KaizenWork"
    "AppLog" o|--|o "User" : "User"
    "AqSaleCart" o|--|o "User" : "User"
    "AqSaleCart" o|--|| "AqCustomer" : "AqCustomer"
    "AqSaleCart" o{--}o "AqSaleRecord" : "AqSaleRecord"
    "AqSaleRecord" o|--|o "User" : "User"
    "AqSaleRecord" o|--|| "AqCustomer" : "AqCustomer"
    "AqSaleRecord" o|--|| "AqProduct" : "AqProduct"
    "AqSaleRecord" o|--|o "AqPriceOption" : "AqPriceOption"
    "AqSaleRecord" o|--|| "AqSaleCart" : "AqSaleCart"
    "AqSaleRecord" o|--|o "AqCustomerSubscription" : "AqCustomerSubscription"
    "AqProduct" o|--|o "AqProductCategoryMaster" : "AqProductCategoryMaster"
    "AqProduct" o{--}o "AqPriceOption" : "AqPriceOption"
    "AqProduct" o{--}o "AqSaleRecord" : "AqSaleRecord"
    "AqProduct" o{--}o "AqCustomerPriceOption" : "AqCustomerPriceOption"
    "AqProduct" o{--}o "AqInventoryRegister" : "AqInventoryRegister"
    "AqProduct" o{--}o "AqCustomerSubscription" : "AqCustomerSubscription"
    "AqProduct" o|--|o "AqCustomer" : "AqDefaultShiireAqCustomer"
    "AqProduct" o{--}o "AqInventoryByMonth" : "AqInventoryByMonth"
    "AqPriceOption" o|--|o "AqProduct" : "AqProduct"
    "AqPriceOption" o{--}o "AqCustomerPriceOption" : "AqCustomerPriceOption"
    "AqPriceOption" o{--}o "AqSaleRecord" : "AqSaleRecord"
    "AqCustomer" o{--}o "AqSaleCart" : "AqSaleCart"
    "AqCustomer" o{--}o "AqCustomerRecord" : "AqCustomerRecord"
    "AqCustomer" o{--}o "AqCustomerPriceOption" : "AqCustomerPriceOption"
    "AqCustomer" o{--}o "AqCustomerSupportGroupMidTable" : "AqCustomerSupportGroupMidTable"
    "AqCustomer" o{--}o "AqCustomerDealerMidTable" : "AqCustomerDealerMidTable"
    "AqCustomer" o{--}o "AqCustomerDeviceMidTable" : "AqCustomerDeviceMidTable"
    "AqCustomer" o{--}o "AqCustomerServiceTypeMidTable" : "AqCustomerServiceTypeMidTable"
    "AqCustomer" o{--}o "AqSaleRecord" : "AqSaleRecord"
    "AqCustomer" o|--|o "User" : "User"
    "AqCustomer" o{--}o "AqInventoryRegister" : "AqInventoryRegister"
    "AqCustomer" o{--}o "AqCustomerSubscription" : "AqCustomerSubscription"
    "AqCustomer" o{--}o "AqProduct" : "AqProduct"
    "AqCustomerSubscription" o|--|| "AqCustomer" : "AqCustomer"
    "AqCustomerSubscription" o|--|| "aqDeviceMaster" : "AqDeviceMaster"
    "AqCustomerSubscription" o|--|| "AqProduct" : "AqProduct"
    "AqCustomerSubscription" o{--}o "AqSaleRecord" : "AqSaleRecord"
    "AqCustomerPriceOption" o|--|| "AqCustomer" : "AqCustomer"
    "AqCustomerPriceOption" o|--|| "AqProduct" : "AqProduct"
    "AqCustomerPriceOption" o|--|| "AqPriceOption" : "AqPriceOption"
    "AqCustomerRecord" o{--}o "AqCustomerRecordAttachment" : "AqCustomerRecordAttachment"
    "AqCustomerRecord" o|--|| "AqCustomer" : "AqCustomer"
    "AqCustomerRecord" o|--|| "User" : "User"
    "AqCustomerRecordAttachment" o|--|o "AqCustomerRecord" : "AqCustomerRecord"
    "AqSupportGroupMaster" o{--}o "AqCustomerSupportGroupMidTable" : "AqCustomerSupportGroupMidTable"
    "AqProductCategoryMaster" o{--}o "AqProduct" : "AqProduct"
    "AqServiecTypeMaster" o{--}o "AqCustomerServiceTypeMidTable" : "AqCustomerServiceTypeMidTable"
    "AqDealerMaster" o{--}o "AqCustomerDealerMidTable" : "AqCustomerDealerMidTable"
    "aqDeviceMaster" o{--}o "AqCustomerDeviceMidTable" : "AqCustomerDeviceMidTable"
    "aqDeviceMaster" o{--}o "AqCustomerSubscription" : "AqCustomerSubscription"
    "AqCustomerDealerMidTable" o|--|| "AqCustomer" : "AqCustomer"
    "AqCustomerDealerMidTable" o|--|| "AqDealerMaster" : "AqDealerMaster"
    "AqCustomerServiceTypeMidTable" o|--|| "AqCustomer" : "AqCustomer"
    "AqCustomerServiceTypeMidTable" o|--|o "AqServiecTypeMaster" : "AqServiecTypeMaster"
    "AqCustomerDeviceMidTable" o|--|| "AqCustomer" : "AqCustomer"
    "AqCustomerDeviceMidTable" o|--|| "aqDeviceMaster" : "AqDeviceMaster"
    "AqCustomerSupportGroupMidTable" o|--|o "AqSupportGroupMaster" : "AqSupportGroupMaster"
    "AqCustomerSupportGroupMidTable" o|--|| "AqCustomer" : "AqCustomer"
    "AqInventoryRegister" o|--|| "AqProduct" : "AqProduct"
    "AqInventoryRegister" o|--|| "AqCustomer" : "AqCustomer"
    "AqInventoryByMonth" o|--|| "AqProduct" : "AqProduct"
    "DemoUser" o{--}o "DemoUserDepartment" : "DemoUserDepartment"
    "DemoUser" o{--}o "DemoTask" : "DemoTask"
    "DemoDepartment" o{--}o "DemoUserDepartment" : "DemoUserDepartment"
    "DemoDepartment" o{--}o "DemoTask" : "DemoTask"
    "DemoDepartment" o{--}o "DemoStock" : "DemoStock"
    "DemoUserDepartment" o|--|| "DemoUser" : "DemoUser"
    "DemoUserDepartment" o|--|| "DemoDepartment" : "DemoDepartment"
    "DemoStock" o|--|o "DemoDepartment" : "DemoDepartment"
    "DemoStock" o|--|o "DemoItem" : "DemoItem"
    "DemoItem" o{--}o "DemoStock" : "DemoStock"
    "DemoTask" o|--|o "DemoUser" : "DemoUser"
    "DemoTask" o|--|o "DemoDepartment" : "DemoDepartment"
    "DemoTask" o{--}o "DemoResult" : "DemoResult"
    "DemoResult" o|--|| "DemoTask" : "DemoTask"
    "Vehicle" o{--}o "CarCost" : "CarCost"
    "Vehicle" o{--}o "Estimate" : "Estimate"
    "CarCost" o|--|| "Vehicle" : "Vehicle"
    "Estimate" o|--|| "Vehicle" : "Vehicle"
    "LmLocation" o{--}o "Pdf" : "Pdf"
    "Pdf" o{--}o "PdfLayer" : "PdfLayer"
    "Pdf" o|--|o "LmLocation" : "LmLocation"
    "PdfLayer" o|--|| "Pdf" : "Pdf"
    "MasterKeyClientGroup" o{--}o "MasterKeyClient" : "MasterKeyClient"
    "MasterKeyClientGroup" o{--}o "User" : "User"
    "MasterKeyClient" o{--}o "MasterKeyJob" : "MasterKeyJob"
    "MasterKeyClient" o{--}o "MasterKeyApplicant" : "MasterKeyApplicant"
    "MasterKeyClient" o|--|| "MasterKeyClientGroup" : "MasterKeyClientGroup"
    "MasterKeyJob" o|--|o "MasterKeyClient" : "MasterKeyClient"
    "MasterKeyJob" o{--}o "MasterKeyApplicant" : "MasterKeyApplicant"
    "MasterKeyApplicant" o|--|o "MasterKeyClient" : "MasterKeyClient"
    "MasterKeyApplicant" o|--|| "MasterKeyJob" : "MasterKeyJob"
    "SankoshaClientA" o{--}o "SankoshaProcess" : "SankoshaProcess"
    "SankoshaClientA" o{--}o "SankoshaClientB" : "SankoshaClientB"
    "SankoshaClientA" o{--}o "SankoshaClientC" : "SankoshaClientC"
    "SankoshaClientA" o{--}o "SankoshaClientD" : "SankoshaClientD"
    "SankoshaClientA" o{--}o "SankoshaClientE" : "SankoshaClientE"
    "SankoshaClientB" o{--}o "SankoshaProcess" : "SankoshaProcess"
    "SankoshaClientB" o|--|| "SankoshaClientA" : "SankoshaClientA"
    "SankoshaClientC" o{--}o "SankoshaProcess" : "SankoshaProcess"
    "SankoshaClientC" o|--|| "SankoshaClientA" : "SankoshaClientA"
    "SankoshaClientD" o{--}o "SankoshaProcess" : "SankoshaProcess"
    "SankoshaClientD" o|--|| "SankoshaClientA" : "SankoshaClientA"
    "SankoshaClientE" o{--}o "SankoshaProcess" : "SankoshaProcess"
    "SankoshaClientE" o|--|| "SankoshaClientA" : "SankoshaClientA"
    "SankoshaProductMaster" o{--}o "SankoshaProcess" : "SankoshaProcess"
    "SankoshaSizeMaster" o{--}o "SankoshaProcess" : "SankoshaProcess"
    "SankoshaProcess" o|--|o "SankoshaProductMaster" : "SankoshaProductMaster"
    "SankoshaProcess" o|--|o "SankoshaSizeMaster" : "SankoshaSizeMaster"
    "SankoshaProcess" o|--|o "SankoshaClientA" : "SankoshaClientA"
    "SankoshaProcess" o|--|o "SankoshaClientB" : "SankoshaClientB"
    "SankoshaProcess" o|--|o "SankoshaClientC" : "SankoshaClientC"
    "SankoshaProcess" o|--|o "SankoshaClientD" : "SankoshaClientD"
    "SankoshaProcess" o|--|o "SankoshaClientE" : "SankoshaClientE"
    "SankoshaProcess" o{--}o "SankoShaEstimatePriceMasterTable" : "SankoShaEstimatePriceMasterTable"
    "SankoshaProcess" o{--}o "SankoshaProductImage" : "SankoshaProductImage"
    "SankoshaProductImage" o|--|o "SankoshaProcess" : "SankoshaProcess"
    "SankoshaPriceMaster" o{--}o "SankoShaEstimatePriceMasterTable" : "SankoShaEstimatePriceMasterTable"
    "SankoShaEstimatePriceMasterTable" o|--|| "SankoshaProcess" : "SankoshaProcess"
    "SankoShaEstimatePriceMasterTable" o|--|| "SankoshaPriceMaster" : "SankoshaPriceMaster"
    "User" o|--|o "School" : "School"
    "User" o{--}o "VideoFromUser" : "VideoFromUser"
    "User" o{--}o "Comment" : "Comment"
    "User" o{--}o "LessonLog" : "LessonLog"
    "User" o{--}o "LessonLogAuthorizedUser" : "LessonLogAuthorizedUser"
    "User" o{--}o "Payment" : "Payment"
    "User" o{--}o "SystemChat" : "SystemChat"
    "User" o{--}o "SystemChatRoom" : "SystemChatRoom"
    "User" o{--}o "Ticket" : "Ticket"
    "User" o{--}o "GenbaDayShift" : "GenbaDayShift"
    "User" o{--}o "SohkenCar" : "SohkenCar"
    "User" o|--|o "MasterKeyClientGroup" : "MasterKeyClientGroup"
    "User" o{--}o "YsWorkRecord" : "YsWorkRecord"
    "User" o{--}o "UserRole" : "UserRole"
    "User" o{--}o "AppLog" : "AppLog"
    "User" o{--}o "ApSender" : "ApSender"
    "User" o{--}o "ApReceiver" : "ApReceiver"
    "User" o{--}o "MidTsNippoUser" : "MidTsNippoUser"
    "User" o{--}o "AqSaleCart" : "AqSaleCart"
    "User" o{--}o "PaidLeaveGrant" : "PaidLeaveGrant"
    "User" o{--}o "AqCustomerRecord" : "AqCustomerRecord"
    "User" o{--}o "UserWorkTimeHistoryMidTable" : "UserWorkTimeHistoryMidTable"
    "User" o{--}o "UserPayedLeaveTypeMidTable" : "UserPayedLeaveTypeMidTable"
    "User" o{--}o "AqSaleRecord" : "AqSaleRecord"
    "User" o{--}o "TsConstructionSubConUserMidTable" : "TsConstructionSubConUserMidTable"
    "User" o{--}o "AqCustomer" : "AqCustomer"
    "User" o|--|o "TbmBase" : "TbmBase"
    "User" o{--}o "TbmDriveSchedule" : "TbmDriveSchedule"
    "User" o{--}o "UserWorkStatus" : "UserWorkStatus"
    "User" o{--}o "OdometerInput" : "OdometerInput"
    "User" o{--}o "TbmRefuelHistory" : "TbmRefuelHistory"
    "User" o{--}o "DayRemarksUser" : "DayRemarksUser"
    "User" o{--}o "TbmCarWashHistory" : "TbmCarWashHistory"
    "User" o{--}o "PurchaseRequest" : "PurchaseRequest"
    "User" o{--}o "LeaveRequest" : "LeaveRequest"
    "User" o{--}o "Approval" : "Approval"
    "User" o{--}o "TbmVehicle" : "TbmVehicle"
    "User" o{--}o "KyuyoTableRecord" : "KyuyoTableRecord"
    "RoleMaster" o{--}o "UserRole" : "UserRole"
    "UserRole" o|--|| "User" : "User"
    "UserRole" o|--|| "RoleMaster" : "RoleMaster"
    "Product" o{--}o "PurchaseRequest" : "PurchaseRequest"
    "Product" o|--|| "ShiireSaki" : "ShiireSaki"
    "ShiireSaki" o{--}o "Product" : "Product"
    "PurchaseRequest" o{--}o "Approval" : "Approval"
    "PurchaseRequest" o|--|| "User" : "User"
    "PurchaseRequest" o|--|| "Product" : "Product"
    "LeaveRequest" o{--}o "Approval" : "Approval"
    "LeaveRequest" o|--|| "User" : "User"
    "Approval" o|--|o "PurchaseRequest" : "PurchaseRequest"
    "Approval" o|--|o "LeaveRequest" : "LeaveRequest"
    "Approval" o|--|| "User" : "User"
    "PrefCity" o{--}o "Genba" : "Genba"
    "DayRemarksUser" o|--|| "DayRemarks" : "DayRemarks"
    "DayRemarksUser" o|--|| "User" : "User"
    "Genba" o|--|o "PrefCity" : "PrefCity"
    "Genba" o{--}o "GenbaDayShift" : "GenbaDayShift"
    "Genba" o{--}o "GenbaDay" : "GenbaDay"
    "Genba" o{--}o "GenbaDaySoukenCar" : "GenbaDaySoukenCar"
    "Genba" o{--}o "GenbaTask" : "GenbaTask"
    "SohkenCar" o{--}o "GenbaDaySoukenCar" : "GenbaDaySoukenCar"
    "SohkenCar" o|--|o "User" : "User"
    "GenbaDay" o|--|o "Genba" : "Genba"
    "GenbaDay" o{--}o "GenbaDayShift" : "GenbaDayShift"
    "GenbaDay" o{--}o "GenbaDaySoukenCar" : "GenbaDaySoukenCar"
    "GenbaDay" o{--}o "GenbaDayTaskMidTable" : "GenbaDayTaskMidTable"
    "GenbaTask" o|--|| "Genba" : "Genba"
    "GenbaTask" o{--}o "GenbaDayTaskMidTable" : "GenbaDayTaskMidTable"
    "GenbaDayTaskMidTable" o|--|| "GenbaDay" : "GenbaDay"
    "GenbaDayTaskMidTable" o|--|| "GenbaTask" : "GenbaTask"
    "GenbaDaySoukenCar" o|--|| "GenbaDay" : "GenbaDay"
    "GenbaDaySoukenCar" o|--|| "SohkenCar" : "SohkenCar"
    "GenbaDaySoukenCar" o|--|| "Genba" : "Genba"
    "GenbaDayShift" o|--|| "User" : "User"
    "GenbaDayShift" o|--|| "GenbaDay" : "GenbaDay"
    "GenbaDayShift" o|--|| "Genba" : "Genba"
    "DayRemarks" o{--}o "DayRemarksUser" : "DayRemarksUser"
    "TbmBase" o{--}o "User" : "User"
    "TbmBase" o{--}o "TbmVehicle" : "TbmVehicle"
    "TbmBase" o{--}o "TbmRouteGroup" : "TbmRouteGroup"
    "TbmBase" o{--}o "TbmDriveSchedule" : "TbmDriveSchedule"
    "TbmBase" o{--}o "TbmProduct" : "TbmProduct"
    "TbmBase" o{--}o "TbmCustomer" : "TbmCustomer"
    "TbmBase" o{--}o "TbmBase_MonthConfig" : "TbmBase_MonthConfig"
    "TbmBase" o{--}o "TbmCalendar" : "TbmCalendar"
    "TbmCalendar" o|--|| "TbmBase" : "TbmBase"
    "TbmRouteGroupCalendar" o|--|| "TbmRouteGroup" : "TbmRouteGroup"
    "TbmBase_MonthConfig" o|--|| "TbmBase" : "TbmBase"
    "TbmVehicle" o{--}o "TbmRefuelHistory" : "TbmRefuelHistory"
    "TbmVehicle" o|--|| "TbmBase" : "TbmBase"
    "TbmVehicle" o{--}o "TbmDriveSchedule" : "TbmDriveSchedule"
    "TbmVehicle" o{--}o "OdometerInput" : "OdometerInput"
    "TbmVehicle" o{--}o "TbmCarWashHistory" : "TbmCarWashHistory"
    "TbmVehicle" o|--|o "User" : "User"
    "TbmVehicle" o{--}o "TbmVehicleMaintenanceRecord" : "TbmVehicleMaintenanceRecord"
    "TbmVehicleMaintenanceRecord" o|--|o "TbmVehicle" : "TbmVehicle"
    "TbmRouteGroup" o|--|| "TbmBase" : "TbmBase"
    "TbmRouteGroup" o{--}o "TbmDriveSchedule" : "TbmDriveSchedule"
    "TbmRouteGroup" o{--}o "TbmMonthlyConfigForRouteGroup" : "TbmMonthlyConfigForRouteGroup"
    "TbmRouteGroup" o{--}o "Mid_TbmRouteGroup_TbmProduct" : "Mid_TbmRouteGroup_TbmProduct"
    "TbmRouteGroup" o{--}o "Mid_TbmRouteGroup_TbmCustomer" : "Mid_TbmRouteGroup_TbmCustomer"
    "TbmRouteGroup" o{--}o "TbmRouteGroupCalendar" : "TbmRouteGroupCalendar"
    "TbmRouteGroup" o{--}o "TbmRouteGroupFee" : "TbmRouteGroupFee"
    "TbmRouteGroupFee" o|--|| "TbmRouteGroup" : "TbmRouteGroup"
    "TbmMonthlyConfigForRouteGroup" o|--|| "TbmRouteGroup" : "TbmRouteGroup"
    "TbmProduct" o{--}o "Mid_TbmRouteGroup_TbmProduct" : "Mid_TbmRouteGroup_TbmProduct"
    "TbmProduct" o|--|| "TbmBase" : "TbmBase"
    "Mid_TbmRouteGroup_TbmProduct" o|--|| "TbmRouteGroup" : "TbmRouteGroup"
    "Mid_TbmRouteGroup_TbmProduct" o|--|| "TbmProduct" : "TbmProduct"
    "Mid_TbmRouteGroup_TbmCustomer" o|--|| "TbmRouteGroup" : "TbmRouteGroup"
    "Mid_TbmRouteGroup_TbmCustomer" o|--|| "TbmCustomer" : "TbmCustomer"
    "TbmCustomer" o{--}o "Mid_TbmRouteGroup_TbmCustomer" : "Mid_TbmRouteGroup_TbmCustomer"
    "TbmCustomer" o|--|| "TbmBase" : "TbmBase"
    "TbmRefuelHistory" o|--|| "TbmVehicle" : "TbmVehicle"
    "TbmRefuelHistory" o|--|| "User" : "User"
    "TbmCarWashHistory" o|--|| "TbmVehicle" : "TbmVehicle"
    "TbmCarWashHistory" o|--|| "User" : "User"
    "TbmDriveSchedule" o|--|o "User" : "User"
    "TbmDriveSchedule" o|--|o "TbmVehicle" : "TbmVehicle"
    "TbmDriveSchedule" o|--|| "TbmRouteGroup" : "TbmRouteGroup"
    "TbmDriveSchedule" o|--|| "TbmBase" : "TbmBase"
    "OdometerInput" o|--|| "TbmVehicle" : "TbmVehicle"
    "OdometerInput" o|--|| "User" : "User"
    "UserWorkStatus" o|--|| "User" : "User"
    "KyuyoTableRecord" o|--|| "User" : "User"
    "TsMainContractor" o{--}o "TsConstruction" : "TsConstruction"
    "TsConstruction" o|--|o "TsMainContractor" : "TsMainContractor"
    "TsConstruction" o{--}o "TsNippo" : "TsNippo"
    "TsConstruction" o{--}o "TsWorkContent" : "TsWorkContent"
    "TsConstruction" o{--}o "TsMaterial" : "TsMaterial"
    "TsConstruction" o{--}o "TsConstructionDiscount" : "TsConstructionDiscount"
    "TsConstruction" o{--}o "TsConstructionSubConUserMidTable" : "TsConstructionSubConUserMidTable"
    "TsConstructionSubConUserMidTable" o|--|| "User" : "User"
    "TsConstructionSubConUserMidTable" o|--|| "TsConstruction" : "TsConstructionSubCon"
    "TsNippo" o|--|o "TsConstruction" : "TsConstruction"
    "TsNippo" o{--}o "MidTsNippoUser" : "MidTsNippoUser"
    "TsNippo" o{--}o "MidTsNippoTsRegularSubcontractor" : "MidTsNippoTsRegularSubcontractor"
    "TsNippo" o{--}o "MidTsNippoTsSubcontractor" : "MidTsNippoTsSubcontractor"
    "TsNippo" o{--}o "MidTsNippoTsMachinery" : "MidTsNippoTsMachinery"
    "TsNippo" o{--}o "MidTsNippoTsMaterial" : "MidTsNippoTsMaterial"
    "TsNippo" o{--}o "MidTsNippoTsWorkContent" : "MidTsNippoTsWorkContent"
    "TsNippo" o{--}o "TsNippoRemarks" : "TsNippoRemarks"
    "TsNippo" o{--}o "TsNippMannualWorkContent" : "TsNippMannualWorkContent"
    "TsNippoRemarks" o|--|o "TsNippo" : "TsNippo"
    "TsNippMannualWorkContent" o|--|o "TsNippo" : "TsNippo"
    "TsRegularSubcontractor" o{--}o "MidTsNippoTsRegularSubcontractor" : "MidTsNippoTsRegularSubcontractor"
    "TsSubcontractor" o{--}o "MidTsNippoTsSubcontractor" : "MidTsNippoTsSubcontractor"
    "TsMachinery" o{--}o "MidTsNippoTsMachinery" : "MidTsNippoTsMachinery"
    "TsMaterial" o|--|o "TsConstruction" : "TsConstruction"
    "TsMaterial" o{--}o "MidTsNippoTsMaterial" : "MidTsNippoTsMaterial"
    "TsWorkContent" o|--|| "TsConstruction" : "TsConstruction"
    "TsWorkContent" o{--}o "MidTsNippoTsWorkContent" : "MidTsNippoTsWorkContent"
    "MidTsNippoTsWorkContent" o|--|| "TsNippo" : "TsNippo"
    "MidTsNippoTsWorkContent" o|--|| "TsWorkContent" : "TsWorkContent"
    "MidTsNippoUser" o|--|| "TsNippo" : "TsNippo"
    "MidTsNippoUser" o|--|| "User" : "User"
    "MidTsNippoTsRegularSubcontractor" o|--|| "TsNippo" : "TsNippo"
    "MidTsNippoTsRegularSubcontractor" o|--|| "TsRegularSubcontractor" : "TsRegularSubcontractor"
    "MidTsNippoTsSubcontractor" o|--|| "TsNippo" : "TsNippo"
    "MidTsNippoTsSubcontractor" o|--|| "TsSubcontractor" : "TsSubcontractor"
    "MidTsNippoTsMachinery" o|--|| "TsNippo" : "TsNippo"
    "MidTsNippoTsMachinery" o|--|| "TsMachinery" : "TsMachinery"
    "MidTsNippoTsMaterial" o|--|| "TsNippo" : "TsNippo"
    "MidTsNippoTsMaterial" o|--|| "TsMaterial" : "TsMaterial"
    "TsConstructionDiscount" o|--|| "TsConstruction" : "TsConstruction"
    "YsWorkRecord" o|--|| "User" : "User"
    "YsWorkRecord" o{--}o "TimeCardHistory" : "TimeCardHistory"
    "YsCalendarHoliday" o|--|o "WorkType" : "WorkType"
    "WorkType" o{--}o "YsCalendarHoliday" : "YsCalendarHoliday"
    "WorkType" o{--}o "UserWorkTimeHistoryMidTable" : "UserWorkTimeHistoryMidTable"
    "UserWorkTimeHistoryMidTable" o|--|| "User" : "User"
    "UserWorkTimeHistoryMidTable" o|--|| "WorkType" : "WorkType"
    "UserPayedLeaveTypeMidTable" o|--|o "User" : "User"
    "UserPayedLeaveTypeMidTable" o|--|| "PayedLeaveType" : "PayedLeaveType"
    "PaidLeaveGrant" o|--|| "User" : "User"
    "PayedLeaveType" o{--}o "PayedLeaveAssignmentCount" : "PayedLeaveAssignmentCount"
    "PayedLeaveType" o{--}o "UserPayedLeaveTypeMidTable" : "UserPayedLeaveTypeMidTable"
    "PayedLeaveAssignmentCount" o|--|| "PayedLeaveType" : "PayedLeaveType"
    "TimeCardHistory" o|--|| "YsWorkRecord" : "YsWorkRecord"
```
