export type EnrollmentStatus = 
  | 'pending'       // 新報名 (待初審)
  | 'contacted'     // 已聯繫 (溝通中)
  | 'approved'      // 初審通過 (待排班)
  | 'enrolled'      // 已錄取 (已排班/開課中)
  | 'completed'     // 已結業 (待赴港考證)
  | 'rejected';     // 不符合條件

export type CourseType = 
  | 'workshop_2day' // 2天赴港就業分享會 (¥1,200，全含20h QAS預前培訓班)
  | 'value_pack'    // 簽證等待期增值賦能課包 (¥1,500)
  | 'full_bundle'   // 全套赴港直通套裝 (¥2,400 組合特惠)
  | 'qas_core';     // 兼容舊資料 (已併入分享會)

export interface LanguageRatings {
  cantonese: number; // 0-5
  english: number;   // 0-5
  mandarin: number;  // 0-5
}

export interface Candidate {
  id: string;                 // e.g. HKQAS-2026-8821
  fullName: string;           // 姓名
  gender: 'male' | 'female';  // 性別
  age: number;                // 年齡
  phone: string;              // 手機號碼 (大陸/香港)
  wechatId: string;           // 微信號
  email?: string;             // 電子郵件
  residenceCity: string;      // 現居城市 (廣州、深圳、佛山等)
  education: string;          // 最高學歷 (初中/高中/大專/本科及以上)
  workExperience: string;     // 過往經驗 (如：5年酒店物管、退役軍人、工廠主管等)
  languages: LanguageRatings; // 語言自評
  healthStatus: 'excellent' | 'good' | 'fair'; // 身體狀況
  hasTwoWayPermit: boolean;   // 是否曾有港澳通行證
  canProvideNoCriminalRecord: boolean; // 是否可提供無犯罪記錄證明
  shiftAcceptance: 'high' | 'medium' | 'low'; // 夜班/12小時長工時接受度
  targetCourse: CourseType;   // 意向課程
  resumeFileName?: string;    // 上傳簡歷檔案名稱
  resumeFileSize?: string;    // 檔案大小
  appliedAt: string;          // 報名時間 (ISO string or YYYY-MM-DD)
  status: EnrollmentStatus;   // 當前狀態
  assignedBatchId?: string;   // 分配的班次 ID
  notes: FollowUpNote[];      // 員工跟進備註
}

export interface FollowUpNote {
  id: string;
  author: string;
  createdAt: string;
  content: string;
  type: 'call' | 'wechat' | 'interview' | 'system';
}

export interface CourseBatch {
  id: string;
  title: string;              // 課程名稱，例如：第24期 QAS 深圳週末班
  courseType: CourseType;     // 類型
  location: string;           // 培訓地點 (如：深圳福田培訓中心、廣州天河基地、線上直播)
  startDate: string;          // 開課日期
  endDate: string;            // 結課日期
  scheduleTime: string;       // 時間 (如 09:00 - 18:00)
  instructor: string;         // 導師姓名與資歷
  capacity: number;           // 名額
  enrolledCount: number;      // 已報人數
  status: 'upcoming' | 'ongoing' | 'completed';
  priceDisplay: string;       // 價格展示 (如 HK$1,200 / ¥1,100)
}

export interface ResourceMaterial {
  id: string;
  title: string;
  category: 'legal' | 'language' | 'visa' | 'exam';
  fileType: 'PDF' | 'DOCX' | 'MP3';
  fileSize: string;
  description: string;
  updatedAt: string;
  downloadUrl?: string;
}

export interface QuickQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type StaffRole = 
  | 'super_admin'   // 系統總監 / 總管理員 (Full Access)
  | 'academic_lead' // 資深教務主管 / 審核官 (Approve/Reject candidates, Assign Batches, Full Notes & Export)
  | 'admissions'    // 招生顧問 / 客服專員 (View leads, Add follow-up notes, Mark as Contacted)
  | 'instructor';   // 培訓導師 / 考證教練 (View assigned enrolled students, mark attendance & completed)

export interface StaffPermissions {
  canViewFinancials: boolean;
  canChangeCandidateStatus: boolean;
  canAssignBatch: boolean;
  canManageBatches: boolean;
  canExportData: boolean;
  canAddNotes: boolean;
  canViewAllCandidates: boolean;
  isSensitiveInfoMasked: boolean;
  canResetSystem: boolean;
}

export interface StaffUser {
  id: string;
  name: string;
  role: StaffRole;
  roleTitle: string;
  department: string;
  email: string;
  avatarLetter: string;
  color: string;
  permissions: StaffPermissions;
}
