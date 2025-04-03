export interface P_BigCategory {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  color: string;
  MiddleCategory: P_MiddleCategory[];
}

export interface P_MiddleCategory {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  Lesson: P_Lesson[];
}

export interface P_Lesson {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  middleCategoryId: number;
  LessonImage: P_LessonImage[];
}

export interface P_Ticket {
  id: number;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  payedAt: Date;
  usedAt: Date;
  type: string;
  lessonLogId: number;
  userId: number;
  LessonLog: P_LessonLog;
  User: P_User;
}

export interface P_Payment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  lessonLogId: number;
  LessonLog: P_LessonLog;
  User: P_User;
}

export interface P_LessonLogAuthorizedUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  userId: number;
  LessonLog: P_LessonLog;
  comment: string;
  User: P_User;
}

export interface P_LessonLog {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  isPassed: boolean;
  authorizerId: number;
  isPaid: boolean;
  userId: number;
  isSuspended: boolean;
  Comment: P_Comment[];
  User: P_User;
  LessonLogAuthorizedUser: P_LessonLogAuthorizedUser[];
  Ticket: P_Ticket[];
}

export interface P_VideoFromUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  lessonLogId: number;
  LessonLog: P_LessonLog;
  User: P_User;
}

export interface P_LessonImage {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  type: string;
  url: string;
  lessonId: number;
}

export interface P_Comment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  message: string;
  read: boolean;
  userId: number;
  url: string;
  LessonLog: P_LessonLog;
  User: P_User;
}

export interface P_SystemChatRoom {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  userId: number;
  SystemChat: P_SystemChat[];
}

export interface P_SystemChat {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  message: string;
  url: string;
  read: boolean;
  systemChatRoomId: number;
  SystemChatRoom: P_SystemChatRoom;
  User: P_User;
}

export interface P_ApRequestTypeMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  description: string;
  ApCustomField: P_ApCustomField[];
}

export interface P_ApCustomField {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  type: string;
  required: boolean;
  remarks: string;
  ApCustomFieldValue: P_ApCustomFieldValue[];
  apRequestTypeMasterId: number;
}

export interface P_ApRequest {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  status: string;
  withdrawn: boolean;
  forceApproved: boolean;
  ApRequestTypeMaster: P_ApRequestTypeMaster;
  ApSender: P_ApSender;
  ApReceiver: P_ApReceiver[];
  apSenderId: number;
}

export interface P_ApSender {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  User: P_User;
  userId: number;
}

export interface P_ApReceiver {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  status: string;
  comment: string;
  User: P_User;
  userId: number;
  apRequestId: number;
}

export interface P_ApCustomFieldValue {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  string: string;
  number: number;
  date: Date;
  ApRequest: P_ApRequest;
  ApCustomField: P_ApCustomField;
  approvalRequestId: number;
  apRequestTypeMasterId: number;
}

export interface P_School {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  Game: P_Game[];
  SubjectNameMaster: P_SubjectNameMaster[];
  User: P_User[];
}

export interface P_LearningRoleMasterOnGame {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  maxCount: number;
  Game: P_Game;
  gameId: number;
}

export interface P_SubjectNameMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  schoolId: number;
  School: P_School;
}

export interface P_Teacher {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  schoolId: number;
  email: string;
  password: string;
  role: string;
  tempResetCode: string;
  tempResetCodeExpired: Date;
  type: string;
  Game: P_Game[];
  TeacherClass: P_TeacherClass[];
}

export interface P_Student {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  gender: string;
  attendanceNumber: number;
  schoolId: number;
  Answer: P_Answer[];
  School: P_School;
  Squad: P_Squad[];
  UnfitFellow: P_UnfitFellow[];
  GameStudent: P_GameStudent[];
}

export interface P_UnfitFellow {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  Student: P_Student[];
}

export interface P_Classroom {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  grade: string;
  class: string;
  schoolId: number;
  Student: P_Student[];
}

export interface P_TeacherClass {
  id: number;
  sortOrder: number;
  teacherId: number;
  Classroom: P_Classroom;
  Teacher: P_Teacher;
}

export interface P_GameStudent {
  id: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  gameId: number;
  Game: P_Game;
  Student: P_Student;
}

export interface P_Game {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  secretKey: string;
  absentStudentIds: number[];
  teacherId: number;
  status: string;
  activeGroupId: number;
  activeQuestionPromptId: number;
  nthTime: number;
  randomTargetStudentIds: number[];
  task: string;
  Answer: P_Answer[];
  SubjectNameMaster: P_SubjectNameMaster;
  Teacher: P_Teacher;
  Group: P_Group[];
  GameStudent: P_GameStudent[];
  GroupCreateConfig: P_GroupCreateConfig;
}

export interface P_GroupCreateConfig {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  groupCreationMode: string;
  count: number;
  criteria: string;
  genderConfig: string;
  Game: P_Game;
  gameId: number;
}

export interface P_Group {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  Game: P_Game;
  Squad: P_Squad[];
  gameId: number;
}

export interface P_Squad {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  Group: P_Group;
  Student: P_Student[];
  StudentRole: P_StudentRole[];
}

export interface P_StudentRole {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  Squad: P_Squad;
  Student: P_Student;
  LearningRoleMasterOnGame: P_LearningRoleMasterOnGame;
  studentId: number;
  squadId: number;
}

export interface P_QuestionPrompt {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  gameId: number;
  Answer: P_Answer[];
  Game: P_Game;
}

export interface P_Answer {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  curiocity1: number;
  curiocity2: number;
  curiocity3: number;
  curiocity4: number;
  curiocity5: number;
  efficacy1: number;
  efficacy2: number;
  efficacy3: number;
  efficacy4: number;
  efficacy5: number;
  impression: string;
  gameId: number;
  questionPromptId: number;
  asSummary: boolean;
  lessonImpression: string;
  lessonSatisfaction: number;
  Game: P_Game;
  QuestionPrompt: P_QuestionPrompt;
  Student: P_Student;
}

export interface P_KaizenClient {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  organization: string;
  iconUrl: string;
  bannerUrl: string;
  website: string;
  note: string;
  public: boolean;
  introductionRequestedAt: Date;
  KaizenWork: P_KaizenWork[];
}

export interface P_KaizenReview {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  username: string;
  review: string;
  platform: string;
  KaizenClient: P_KaizenClient;
  kaizenClientId: number;
}

export interface P_KaizenWork {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  uuid: string;
  date: Date;
  title: string;
  subtitle: string;
  status: string;
  description: string;
  points: string;
  clientName: string;
  organization: string;
  dealPoint: number;
  toolPoint: number;
  impression: string;
  reply: string;
  jobCategory: string;
  systemCategory: string;
  collaborationTool: string;
  KaizenWorkImage: P_KaizenWorkImage[];
  KaizenClient: P_KaizenClient;
  kaizenClientId: number;
  allowShowClient: boolean;
  isPublic: boolean;
  correctionRequest: string;
}

export interface P_KaizenWorkImage {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  url: string;
  KaizenWork: P_KaizenWork;
  kaizenWorkId: number;
}

export interface P_KaizenCMS {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  contactPageMsg: string;
  principlePageMsg: string;
}

export interface P_AppLog {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  diffTime: number;
  userAgent: string;
  referrerUrl: string;
  timestamp: Date;
  pageName: string;
  pageUrl: string;
  pageParams: any;
  dataLogComponent: any;
  functionName: string;
  functionArgs: any;
  functionReturnValue: any;
  consoleInfo: string[];
  actionType: string;
  pageLoadTime: number;
  errorMessage: string;
  sessionDuration: number;
  User: P_User;
  userId: number;
}

export interface P_Product {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  productCode: string;
  name: string;
  maker: string;
  unit: string;
  PurchaseRequest: P_PurchaseRequest[];
}

export interface P_PurchaseRequest {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  purchaseType: string;
  quantity: number;
  result: string;
  approverComment: string;
  trashed: boolean;
  Approval: P_Approval[];
  userId: number;
  productId: number;
}

export interface P_LeaveRequest {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  startDate: Date;
  leaveType: string;
  reason: string;
  Approval: P_Approval[];
  userId: number;
}

export interface P_Approval {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  status: string;
  comment: string;
  PurchaseRequest: P_PurchaseRequest;
  purchaseRequestId: number;
  LeaveRequest: P_LeaveRequest;
  leaveRequestId: number;
  User: P_User;
  userId: number;
}

export interface P_AqSaleCart {
  id: number;
  baseOrderId: string;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  User: P_User;
  userId: number;
  AqCustomer: P_AqCustomer;
  aqCustomerId: number;
}

export interface P_AqSaleRecord {
  baseSaleRecordId: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  price: number;
  taxedPrice: number;
  remarks: string;
  User: P_User;
  userId: number;
  AqCustomer: P_AqCustomer;
  aqCustomerId: number;
  aqProductId: number;
  aqPriceOptionId: number;
  AqSaleCart: P_AqSaleCart;
  aqSaleCartId: number;
  aqCustomerSubscriptionId: number;
  subscriptionYearMonth: Date;
}

export interface P_AqProduct {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  productCode: string;
  name: string;
  AqProductCategoryMaster: P_AqProductCategoryMaster;
  aqProductCategoryMasterId: number;
  fromBase: boolean;
  cost: number;
  taxRate: number;
  stock: number;
  inInventoryManagement: boolean;
  AqPriceOption: P_AqPriceOption[];
  AqCustomerPriceOption: P_AqCustomerPriceOption[];
  AqCustomerSubscription: P_AqCustomerSubscription[];
  aqDefaultShiireAqCustomerId: number;
  AqInventoryByMonth: P_AqInventoryByMonth[];
}

export interface P_AqPriceOption {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  AqProduct: P_AqProduct;
  aqProductId: number;
  AqCustomerPriceOption: P_AqCustomerPriceOption[];
}

export interface P_AqCustomer {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  email: string;
  customerNumber: string;
  fromBase: boolean;
  companyName: string;
  jobTitle: string;
  name: string;
  defaultPaymentMethod: string;
  tel: string;
  tel2: string;
  fax: string;
  invoiceNumber: string;
  status: string;
  domestic: boolean;
  postal: string;
  state: string;
  city: string;
  street: string;
  building: string;
  remarks: string;
  firstVisitDate: Date;
  lastVisitDate: Date;
  maintananceYear: number;
  maintananceMonth: number;
  AqSaleCart: P_AqSaleCart[];
  AqCustomerPriceOption: P_AqCustomerPriceOption[];
  AqCustomerDealerMidTable: P_AqCustomerDealerMidTable[];
  AqCustomerServiceTypeMidTable: P_AqCustomerServiceTypeMidTable[];
  User: P_User;
  userId: number;
  AqInventoryRegister: P_AqInventoryRegister[];
  AqProduct: P_AqProduct[];
}

export interface P_AqCustomerSubscription {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  active: boolean;
  maintananceYear: number;
  AqCustomer: P_AqCustomer;
  aqCustomerId: number;
  aqDeviceMasterId: number;
  aqProductId: number;
  AqSaleRecord: P_AqSaleRecord[];
}

export interface P_AqCustomerPriceOption {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  AqCustomer: P_AqCustomer;
  aqCustomerId: number;
  aqProductId: number;
  aqPriceOptionId: number;
}

export interface P_AqCustomerRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  status: string;
  type: string;
  content: string;
  remarks: string;
  AqCustomerRecordAttachment: P_AqCustomerRecordAttachment[];
  aqCustomerId: number;
  userId: number;
}

export interface P_AqCustomerRecordAttachment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  title: string;
  url: string;
  AqCustomerRecord: P_AqCustomerRecord;
  aqCustomerRecordId: number;
}

export interface P_AqSupportGroupMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  color: string;
  AqCustomerSupportGroupMidTable: P_AqCustomerSupportGroupMidTable[];
}

export interface P_AqProductCategoryMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  color: string;
  AqProduct: P_AqProduct[];
}

export interface P_AqServiecTypeMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  color: string;
  AqCustomerServiceTypeMidTable: P_AqCustomerServiceTypeMidTable[];
}

export interface P_AqDealerMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  color: string;
  AqCustomerDealerMidTable: P_AqCustomerDealerMidTable[];
}

export interface P_aqDeviceMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  color: string;
  AqCustomerDeviceMidTable: P_AqCustomerDeviceMidTable[];
}

export interface P_AqCustomerDealerMidTable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  AqCustomer: P_AqCustomer;
  aqCustomerId: number;
  aqDealerMasterId: number;
}

export interface P_AqCustomerServiceTypeMidTable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  AqCustomer: P_AqCustomer;
  aqCustomerId: number;
  aqServiecTypeMasterId: number;
}

export interface P_AqCustomerDeviceMidTable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  AqCustomer: P_AqCustomer;
  aqCustomerId: number;
  aqDeviceMasterId: number;
}

export interface P_AqCustomerSupportGroupMidTable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  from: Date;
  AqSupportGroupMaster: P_AqSupportGroupMaster;
  aqSupportGroupMasterId: number;
  AqCustomer: P_AqCustomer;
  aqCustomerId: number;
}

export interface P_AqInventoryRegister {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  aqProductId: number;
  date: Date;
  remarks: string;
  AqProduct: P_AqProduct;
  AqCustomer: P_AqCustomer;
}

export interface P_AqInventoryByMonth {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  key: string;
  yearMonth: Date;
  count: number;
  aqProductId: number;
}

export interface P_DemoUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  email: string;
  DemoUserDepartment: P_DemoUserDepartment[];
}

export interface P_DemoDepartment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  DemoUserDepartment: P_DemoUserDepartment[];
  DemoStock: P_DemoStock[];
}

export interface P_DemoUserDepartment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  demoUserId: number;
  DemoUser: P_DemoUser;
  DemoDepartment: P_DemoDepartment;
}

export interface P_DemoStock {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  quantity: number;
  DemoDepartment: P_DemoDepartment;
  demoDepartmentId: number;
  DemoItem: P_DemoItem;
  demoItemId: number;
}

export interface P_DemoItem {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  imageUrl: string;
  DemoStock: P_DemoStock[];
}

export interface P_DemoTask {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  description: string;
  status: string;
  taskType: string;
  goal: number;
  ratio: number;
  startedAt: Date;
  finishedAt: Date;
  requestType: string;
  category1: string;
  cateogry2: string;
  priority: string;
  requiredTime: number;
  detail: string;
  url: string;
  imageUrl: string;
  remarks: string;
  DemoUser: P_DemoUser;
  demoUserId: number;
  DemoDepartment: P_DemoDepartment;
  demoDepartmentId: number;
  DemoResult: P_DemoResult[];
}

export interface P_DemoResult {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  kpi: number;
  DemoTask: P_DemoTask;
  demoTaskId: number;
}

export interface P_Vehicle {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  basePrice: number;
  fuelEfficiency: number;
  memo: string;
  CarCost: P_CarCost[];
  Estimate: P_Estimate[];
}

export interface P_CarCost {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  Vehicle: P_Vehicle;
  vehicleId: number;
}

export interface P_CommonCost {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
}

export interface P_GasolinePrice {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  prefecture: string;
  price: number;
}

export interface P_Estimate {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  key: string;
  email: string;
  departureTime: string;
  destination: string;
  waypoint1: string;
  waypoint2: string;
  waypoint3: string;
  gasolinePrice: number;
  vehiclePrice: number;
  commonCost: number;
  distance: number;
  time: number;
  totalAmount: number;
  Vehicle: P_Vehicle;
  vehicleId: number;
}

export interface P_TabitakuMarkDown {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  notesOnModal: string;
  introduction: string;
  date: string;
  time: string;
  numberOfPeople: string;
  vehicle: string;
  origin: string;
  destination: string;
  useHighway: string;
  peopleCount: string;
  request: string;
  name: string;
  tel: string;
  email: string;
  email_confirmation: string;
  resultNotification: string;
  confirmation: string;
}

export interface P_LmLocation {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  Pdf: P_Pdf[];
}

export interface P_Pdf {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  url: string;
  json: any;
  PdfLayer: P_PdfLayer[];
  LmLocation: P_LmLocation;
  lmLocationId: number;
}

export interface P_PdfLayer {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  layerType: string;
  pdfId: string;
  Pdf: P_Pdf;
  data: any;
  pDFId: number;
}

export interface P_MasterKeyClientGroup {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  MasterKeyClient: P_MasterKeyClient[];
}

export interface P_MasterKeyClient {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  email: string;
  MasterKeyJob: P_MasterKeyJob[];
  MasterKeyClientGroup: P_MasterKeyClientGroup;
  masterKeyClientGroupId: number;
}

export interface P_MasterKeyJob {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  MasterKeyClient: P_MasterKeyClient;
  masterKeyClientId: number;
  projectNumber: string;
  projectName: string;
  jobTitle: string;
  workLocation: string;
  MasterKeyApplicant: P_MasterKeyApplicant[];
}

export interface P_MasterKeyApplicant {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  MasterKeyClient: P_MasterKeyClient;
  masterKeyClientId: number;
  projectName: string;
  projectNumber: string;
  jobTitle: string;
  workLocation: string;
  personInCharge: string;
  progressStatus: string;
  progressDetails: string;
  startDate: Date;
  name: string;
  kana: string;
  tel: string;
  email: string;
  address: string;
  gender: string;
  birthDate: Date;
  age: number;
  remarks: string;
  validApplications: boolean;
  absent: boolean;
  connected: boolean;
  interviewConfirmed: boolean;
  seated: boolean;
  rejected: boolean;
  offer: boolean;
  offerDeclined: boolean;
  joined: boolean;
  resigned: boolean;
  MasterKeyJob: P_MasterKeyJob;
  masterKeyJobId: number;
}

export interface P_SankoshaClientA {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  relatedClientIds: string[];
  SankoshaClientB: P_SankoshaClientB[];
  SankoshaClientD: P_SankoshaClientD[];
}

export interface P_SankoshaClientB {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  SankoshaProcess: P_SankoshaProcess[];
  sankoshaClientAId: number;
}

export interface P_SankoshaClientC {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  SankoshaProcess: P_SankoshaProcess[];
  sankoshaClientAId: number;
}

export interface P_SankoshaClientD {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  SankoshaProcess: P_SankoshaProcess[];
  sankoshaClientAId: number;
}

export interface P_SankoshaClientE {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  SankoshaProcess: P_SankoshaProcess[];
  sankoshaClientAId: number;
}

export interface P_SankoshaProductMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  color: string;
  SankoshaProcess: P_SankoshaProcess[];
}

export interface P_SankoshaSizeMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  color: string;
  SankoshaProcess: P_SankoshaProcess[];
}

export interface P_SankoshaProcess {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  photo: string;
  quantity: number;
  requestPresence: boolean;
  requestFormNumber: string;
  plannedDeliveryDate: Date;
  isTestProduct: boolean;
  inspectionOk: boolean;
  estimateIssueDate: Date;
  estimateIssueDateIsEmpty: boolean;
  orderFormArrivalDate: Date;
  orderFormArrivalDateisEmpty: boolean;
  orderFormNumber: string;
  processStartedAt: Date;
  confirmationDate: Date;
  notes: string;
  completionDate: Date;
  shipmentCompletionDate: Date;
  faxInvoice: boolean;
  SankoshaProductMaster: P_SankoshaProductMaster;
  SankoshaSizeMaster: P_SankoshaSizeMaster;
  sankoshaProductMasterId: number;
  sankoshaSizeMasterId: number;
  SankoshaClientA: P_SankoshaClientA;
  sankoshaClientAId: number;
  sankoshaClientBId: number;
  sankoshaClientCId: number;
  sankoshaClientDId: number;
  sankoshaClientEId: number;
  SankoshaClientB: P_SankoshaClientB;
  SankoshaClientC: P_SankoshaClientC;
  SankoshaClientD: P_SankoshaClientD;
  SankoshaClientE: P_SankoshaClientE;
  SankoShaEstimatePriceMasterTable: P_SankoShaEstimatePriceMasterTable[];
}

export interface P_SankoshaProductImage {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  url: string;
  SankoshaProcess: P_SankoshaProcess;
  sankoshaProcessId: number;
}

export interface P_SankoshaPriceMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  price: number;
  color: string;
  SankoShaEstimatePriceMasterTable: P_SankoShaEstimatePriceMasterTable[];
}

export interface P_SankoShaEstimatePriceMasterTable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  quantity: number;
  priceAdjust: number;
  SankoshaProcess: P_SankoshaProcess;
  sankoshaProcessId: number;
  sankoshaPriceMasterId: number;
}

export interface P_User {
  id: number;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  active: boolean;
  hiredAt: Date;
  yukyuCategory: string;
  name: string;
  email: string;
  password: string;
  type: string;
  role: string;
  tempResetCode: string;
  tempResetCodeExpired: Date;
  storeId: number;
  schoolId: number;
  rentaStoreId: number;
  type2: string;
  shopId: number;
  membershipName: string;
  damageNameMasterId: number;
  color: string;
  tell: string;
  app: string;
  apps: string[];
  employeeCode: string;
  phone: string;
  School: P_School;
  VideoFromUser: P_VideoFromUser[];
  LessonLog: P_LessonLog[];
  Payment: P_Payment[];
  SystemChatRoom: P_SystemChatRoom;
  Ticket: P_Ticket[];
  SohkenCar: P_SohkenCar[];
  masterKeyClientId: number;
  MasterKeyClientGroup: P_MasterKeyClientGroup;
  masterKeyClientGroupId: number;
  YsWorkRecord: P_YsWorkRecord[];
  AppLog: P_AppLog[];
  ApReceiver: P_ApReceiver[];
  AqSaleCart: P_AqSaleCart[];
  AqCustomerRecord: P_AqCustomerRecord[];
  UserPayedLeaveTypeMidTable: P_UserPayedLeaveTypeMidTable[];
  TsConstructionSubConUserMidTable: P_TsConstructionSubConUserMidTable[];
  AqCustomer: P_AqCustomer[];
  tbmBaseId: number;
  TbmDriveSchedule: P_TbmDriveSchedule[];
  OdometerInput: P_OdometerInput[];
  DayRemarksUser: P_DayRemarksUser[];
  PurchaseRequest: P_PurchaseRequest[];
  Approval: P_Approval[];
  KyuyoTableRecord: P_KyuyoTableRecord[];
}

export interface P_ReleaseNotes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  rootPath: string;
  msg: string;
  confirmedUserIds: number[];
}

export interface P_GoogleAccessToken {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  email: string;
  access_token: string;
  scope: string;
  id_token: string;
  tokenJSON: string;
}

export interface P_RoleMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  description: string;
  color: string;
  apps: string[];
}

export interface P_UserRole {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  User: P_User;
  userId: number;
  roleMasterId: number;
}

export interface P_ChainMethodLock {
  id: number;
  isLocked: boolean;
  expiresAt: Date;
  updatedAt: Date;
}

export interface P_Calendar {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  holidayType: string;
}

export interface P_PrefCity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  pref: string;
  Genba: P_Genba[];
}

export interface P_DayRemarksUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  kyuka: boolean;
  kyukaTodoke: boolean;
  DayRemarks: P_DayRemarks;
  dayRemarksId: number;
  userId: number;
}

export interface P_Genba {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  defaultStartTime: string;
  construction: string;
  houseHoldsCount1: number;
  houseHoldsCount2: number;
  houseHoldsCount3: number;
  houseHoldsCount4: number;
  houseHoldsCount5: number;
  houseHoldsCount6: number;
  houseHoldsCount7: number;
  warningString: string;
  zip: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  PrefCity: P_PrefCity;
  prefCityId: number;
  GenbaDayShift: P_GenbaDayShift[];
  GenbaDaySoukenCar: P_GenbaDaySoukenCar[];
  archived: boolean;
}

export interface P_SohkenCar {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  plate: string;
  role: string;
  GenbaDaySoukenCar: P_GenbaDaySoukenCar[];
  userId: number;
}

export interface P_GenbaDay {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  remarks: string;
  Genba: P_Genba;
  ninku: number;
  finished: boolean;
  active: boolean;
  overStuffCount: number;
  status: string;
  ninkuFullfilled: boolean;
  isLastFullfilledDay: boolean;
  allAssignedNinkuTillThisDay: number;
  allRequiredNinku: number;
  genbaId: number;
  GenbaDayShift: P_GenbaDayShift[];
  GenbaDayTaskMidTable: P_GenbaDayTaskMidTable[];
}

export interface P_GenbaTask {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  color: string;
  from: Date;
  to: Date;
  requiredNinku: number;
  subTask: string;
  remarks: string;
  Genba: P_Genba;
  genbaId: number;
}

export interface P_GenbaDayTaskMidTable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  GenbaDay: P_GenbaDay;
  genbaDayId: number;
  genbaTaskId: number;
}

export interface P_GenbaDaySoukenCar {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  GenbaDay: P_GenbaDay;
  genbaDayId: number;
  sohkenCarId: number;
  genbaId: number;
}

export interface P_GenbaDayShift {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  from: string;
  to: string;
  important: boolean;
  shokucho: boolean;
  directGo: boolean;
  directReturn: boolean;
  User: P_User;
  userId: number;
  genbaDayId: number;
  genbaId: number;
}

export interface P_GenbaTaskMaster {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
}

export interface P_DayRemarks {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  bikou: string;
  shinseiGyomu: string;
  ninkuCount: number;
  DayRemarksUser: P_DayRemarksUser[];
}

export interface P_TbmBase {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  code: string;
  name: string;
  User: P_User[];
  TbmRouteGroup: P_TbmRouteGroup[];
  TbmProduct: P_TbmProduct[];
  TbmBase_MonthConfig: P_TbmBase_MonthConfig[];
}

export interface P_TbmCalendar {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  holidayType: string;
  remark: string;
  TbmBase: P_TbmBase;
  tbmBaseId: number;
}

export interface P_TbmRouteGroupCalendar {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  remark: string;
  TbmRouteGroup: P_TbmRouteGroup;
  tbmRouteGroupId: number;
}

export interface P_TbmBase_MonthConfig {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  code: string;
  yearMonth: Date;
  keiyuPerLiter: number;
  TbmBase: P_TbmBase;
  tbmBaseId: number;
}

export interface P_TbmVehicle {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  code: string;
  vehicleNumber: string;
  type: string;
  shape: string;
  airSuspension: string;
  oilTireParts: string;
  maintenance: string;
  insurance: string;
  shodoTorokubi: Date;
  sakenManryobi: Date;
  hokenManryobi: Date;
  sankagetsuTenkenbi: Date;
  TbmRefuelHistory: P_TbmRefuelHistory[];
  tbmBaseId: number;
  OdometerInput: P_OdometerInput[];
  User: P_User;
  userId: number;
  TbmVehicleMaintenanceRecord: P_TbmVehicleMaintenanceRecord[];
}

export interface P_TbmVehicleMaintenanceRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  price: number;
  type: string;
  TbmVehicle: P_TbmVehicle;
  tbmVehicleId: number;
}

export interface P_TbmRouteGroup {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  code: string;
  name: string;
  tbmBaseId: number;
  TbmMonthlyConfigForRouteGroup: P_TbmMonthlyConfigForRouteGroup[];
  Mid_TbmRouteGroup_TbmCustomer: P_Mid_TbmRouteGroup_TbmCustomer;
  TbmRouteGroupCalendar: P_TbmRouteGroupCalendar[];
}

export interface P_TbmRouteGroupFee {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  startDate: Date;
  billingFee: number;
  tbmRouteGroupId: number;
}

export interface P_TbmMonthlyConfigForRouteGroup {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  yearMonth: Date;
  vehicleType: string;
  postalFee: number;
  generalFee: number;
  tollFee: number;
  numberOfTrips: number;
  TbmRouteGroup: P_TbmRouteGroup;
  tbmRouteGroupId: number;
}

export interface P_TbmProduct {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  code: string;
  name: string;
  Mid_TbmRouteGroup_TbmProduct: P_Mid_TbmRouteGroup_TbmProduct[];
  tbmBaseId: number;
}

export interface P_Mid_TbmRouteGroup_TbmProduct {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  TbmRouteGroup: P_TbmRouteGroup;
  tbmRouteGroupId: number;
  TbmProduct: P_TbmProduct;
  tbmProductId: number;
}

export interface P_Mid_TbmRouteGroup_TbmCustomer {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  TbmRouteGroup: P_TbmRouteGroup;
  tbmRouteGroupId: number;
  TbmCustomer: P_TbmCustomer;
  tbmCustomerId: number;
}

export interface P_TbmBillingAddress {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
}

export interface P_TbmInvoiceDetail {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  numberOfTrips: number;
  toll: number;
}

export interface P_TbmCustomer {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  code: string;
  name: string;
  address: string;
  phoneNumber: string;
  faxNumber: string;
  bankInformation: string;
  Mid_TbmRouteGroup_TbmCustomer: P_Mid_TbmRouteGroup_TbmCustomer[];
  tbmBaseId: number;
}

export interface P_TbmRefuelHistory {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  odometer: number;
  TbmVehicle: P_TbmVehicle;
  tbmVehicleId: number;
  userId: number;
}

export interface P_TbmCarWashHistory {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  TbmVehicle: P_TbmVehicle;
  tbmVehicleId: number;
  userId: number;
}

export interface P_TbmDriveSchedule {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  Q_generalHighwayFee: number;
  User: P_User;
  userId: number;
  TbmVehicle: P_TbmVehicle;
  tbmVehicleId: number;
  TbmRouteGroup: P_TbmRouteGroup;
  tbmRouteGroupId: number;
  TbmBase: P_TbmBase;
  tbmBaseId: number;
}

export interface P_OdometerInput {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  odometerStart: number;
  date: Date;
  tbmVehicleId: number;
  userId: number;
}

export interface P_UserWorkStatus {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  remark: string;
  User: P_User;
  userId: number;
}

export interface P_KyuyoTableRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  other1: number;
  other2: number;
  shokuhi: number;
  maebaraikin: number;
  rate: number;
  yearMonth: Date;
  userId: number;
}

export interface P_TsMainContractor {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  TsConstruction: P_TsConstruction[];
}

export interface P_TsConstruction {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  address1: string;
  address2: string;
  contractAmount: number;
  budget: number;
  TsMainContractor: P_TsMainContractor;
  tsMainContractorId: number;
  TsNippo: P_TsNippo[];
  TsMaterial: P_TsMaterial[];
  TsConstructionSubConUserMidTable: P_TsConstructionSubConUserMidTable[];
}

export interface P_TsConstructionSubConUserMidTable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  User: P_User;
  userId: number;
  tsConstructionId: number;
}

export interface P_TsNippo {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  totalCost: number;
  date: Date;
  TsConstruction: P_TsConstruction;
  tsConstructionId: number;
  MidTsNippoUser: P_MidTsNippoUser[];
  MidTsNippoTsSubcontractor: P_MidTsNippoTsSubcontractor[];
  MidTsNippoTsMaterial: P_MidTsNippoTsMaterial[];
  TsNippoRemarks: P_TsNippoRemarks[];
}

export interface P_TsNippoRemarks {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  price: number;
  TsNippo: P_TsNippo;
  tsNippoId: number;
}

export interface P_TsNippMannualWorkContent {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  part: string;
  name: string;
  count: number;
  unit: string;
  price: number;
  tsNippoId: number;
}

export interface P_TsRegularSubcontractor {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  contentName: string;
  unitPrice: number;
  remarks: string;
  MidTsNippoTsRegularSubcontractor: P_MidTsNippoTsRegularSubcontractor[];
}

export interface P_TsSubcontractor {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  unitPrice: number;
  remarks: string;
  MidTsNippoTsSubcontractor: P_MidTsNippoTsSubcontractor[];
}

export interface P_TsMachinery {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  name: string;
  unitPrice: number;
  unit: string;
  vendor: string;
  remarks: string;
  MidTsNippoTsMachinery: P_MidTsNippoTsMachinery[];
}

export interface P_TsMaterial {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  materialType: string;
  name: string;
  category: string;
  unitPrice: number;
  unit: string;
  vendor: string;
  remarks: string;
  billedAt: Date;
  genbaName: string;
  TsConstruction: P_TsConstruction;
  tsConstructionId: number;
  MidTsNippoTsMaterial: P_MidTsNippoTsMaterial[];
}

export interface P_TsWorkContent {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  part: string;
  name: string;
  unit: string;
  contractAmount: number;
  unitPrice: number;
  remarks: string;
  TsConstruction: P_TsConstruction;
  tsConstructionId: number;
}

export interface P_MidTsNippoTsWorkContent {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  count: number;
  price: number;
  tsNippoId: number;
  TsWorkContent: P_TsWorkContent;
  tsWorkContentId: number;
}

export interface P_MidTsNippoUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  count: number;
  price: number;
  tsNippoId: number;
  TsNippo: P_TsNippo;
  User: P_User;
}

export interface P_MidTsNippoTsRegularSubcontractor {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  count: number;
  price: number;
  tsNippoId: number;
  TsNippo: P_TsNippo;
  TsRegularSubcontractor: P_TsRegularSubcontractor;
}

export interface P_MidTsNippoTsSubcontractor {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  count: number;
  price: number;
  tsNippoId: number;
  TsNippo: P_TsNippo;
  TsSubcontractor: P_TsSubcontractor;
}

export interface P_MidTsNippoTsMachinery {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  count: number;
  price: number;
  tsNippoId: number;
  TsNippo: P_TsNippo;
  TsMachinery: P_TsMachinery;
}

export interface P_MidTsNippoTsMaterial {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  count: number;
  price: number;
  tsNippoId: number;
  TsNippo: P_TsNippo;
  TsMaterial: P_TsMaterial;
}

export interface P_TsConstructionDiscount {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  sortOrder: number;
  monthStr: string;
  TsConstruction: P_TsConstruction;
  tsConstructionId: number;
}

export interface P_YsWorkRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  from: Date;
  to: Date;
  breakTime: number;
  User: P_User;
  userId: number;
}

export interface P_YsHoliday {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
}

export interface P_YsCalendarHoliday {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  type: string;
  WorkType: P_WorkType;
  workTypeId: number;
}

export interface P_WorkType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  legalHoliday: string;
  work_startTime: string;
  work_endTime: string;
  lunchBreak_startTime: string;
  lunchBreak_endTime: string;
  workMins: number;
  fixedOvertime: string;
  YsCalendarHoliday: P_YsCalendarHoliday[];
}

export interface P_UserWorkTimeHistoryMidTable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  from: Date;
  User: P_User;
  userId: number;
  workTypeId: number;
}

export interface P_UserPayedLeaveTypeMidTable {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  from: Date;
  User: P_User;
  userId: number;
  PayedLeaveType: P_PayedLeaveType;
  payedLeaveTypeId: number;
}

export interface P_PaidLeaveGrant {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  grantedAt: Date;
  remarks: string;
  User: P_User;
  userId: number;
}

export interface P_PayedLeaveType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  name: string;
  PayedLeaveAssignmentCount: P_PayedLeaveAssignmentCount[];
}

export interface P_PayedLeaveAssignmentCount {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  monthsAfter: number;
  PayedLeaveType: P_PayedLeaveType;
  payedLeaveTypeId: number;
}

export interface P_YsManualUserRow {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  uuid: string;
  code: string;
  prescribedWorkingDays: number;
  workingDays: number;
  holidayWorkDays: number;
  furikyu: number;
  absentDays: number;
  prescribedHolidays: number;
  Sum_payedLeaveUsed: number;
  totalRemainingMinutes: number;
  substituteHolidayOwned: number;
  privateCarUsageKm: number;
  overTime: number;
  month: Date;
}

export interface P_TimeCardHistory {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  date: Date;
  from: Date;
  to: Date;
  breakTime: number;
  lat: number;
  lng: number;
  YsWorkRecord: P_YsWorkRecord;
  ysWorkRecordId: number;
}

