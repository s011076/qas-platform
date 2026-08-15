import { Candidate, CourseBatch, FollowUpNote, EnrollmentStatus } from '../types';
import { INITIAL_CANDIDATES, INITIAL_BATCHES } from '../data/mockData';

const CANDIDATES_KEY = 'hk_qas_candidates_v1';
const BATCHES_KEY = 'hk_qas_batches_v1';
const CURRENT_STUDENT_KEY = 'hk_qas_student_session';

export function getStoredCandidates(): Candidate[] {
  try {
    const data = localStorage.getItem(CANDIDATES_KEY);
    if (!data) {
      localStorage.setItem(CANDIDATES_KEY, JSON.stringify(INITIAL_CANDIDATES));
      return INITIAL_CANDIDATES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load candidates from storage', e);
    return INITIAL_CANDIDATES;
  }
}

export function saveCandidates(candidates: Candidate[]): void {
  try {
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));
    window.dispatchEvent(new Event('hk_qas_candidates_updated'));
  } catch (e) {
    console.error('Failed to save candidates', e);
  }
}

export function addCandidate(candidate: Omit<Candidate, 'id' | 'appliedAt' | 'status' | 'notes'>): Candidate {
  const candidates = getStoredCandidates();
  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `HKQAS-${currentYear}-${randomNum}`;
  
  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newCandidate: Candidate = {
    ...candidate,
    id: newId,
    appliedAt: formattedTime,
    status: 'pending',
    notes: [
      {
        id: `note-${Date.now()}`,
        author: '系統',
        createdAt: formattedTime,
        content: '學員於在線平台完成預報名，資料已錄入教務審核隊列。',
        type: 'system',
      }
    ],
  };

  const updated = [newCandidate, ...candidates];
  saveCandidates(updated);
  return newCandidate;
}

export function updateCandidateStatus(id: string, status: EnrollmentStatus, batchId?: string): Candidate | null {
  const candidates = getStoredCandidates();
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) return null;

  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const statusLabels: Record<EnrollmentStatus, string> = {
    pending: '新報名 (待初審)',
    contacted: '已聯繫 (溝通中)',
    approved: '初審通過 (待排班)',
    enrolled: '已錄取 (已排班開課)',
    completed: '已結業 (待赴港考證)',
    rejected: '未符合條件'
  };

  const systemNote: FollowUpNote = {
    id: `note-${Date.now()}`,
    author: '教務系統',
    createdAt: formattedTime,
    content: `狀態變更為【${statusLabels[status]}】${batchId ? `，已指派班次：${batchId}` : ''}`,
    type: 'system',
  };

  const updatedCandidate: Candidate = {
    ...candidates[index],
    status,
    assignedBatchId: batchId !== undefined ? batchId : candidates[index].assignedBatchId,
    notes: [systemNote, ...candidates[index].notes],
  };

  candidates[index] = updatedCandidate;
  saveCandidates(candidates);
  return updatedCandidate;
}

export function updateCandidateEducation(id: string, education: string, author?: string): Candidate | null {
  return updateCandidateFields(id, { education }, author);
}

const FIELD_LABELS: Record<string, string> = {
  fullName: '姓名',
  gender: '性別',
  age: '年齡',
  phone: '電話',
  wechatId: '微信號',
  email: '電子郵件',
  residenceCity: '現居城市',
  education: '最高學歷',
  workExperience: '工作經驗',
  languages: '語言自評',
  healthStatus: '身體狀況',
  hasTwoWayPermit: '港澳通行證',
  canProvideNoCriminalRecord: '無犯罪證明',
  shiftAcceptance: '夜班接受度',
  targetCourse: '意向課程',
  resumeFileName: '簡歷檔案',
};

/** Generic field update for any candidate profile field (admin edits). */
export function updateCandidateFields(id: string, fields: Partial<Candidate>, author?: string): Candidate | null {
  const candidates = getStoredCandidates();
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) return null;

  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const changedLabels = Object.keys(fields)
    .map(k => FIELD_LABELS[k] || k)
    .filter(Boolean);

  const systemNote: FollowUpNote = {
    id: `note-${Date.now()}`,
    author: author || '教務系統',
    createdAt: formattedTime,
    content: `學員資料更新：${changedLabels.join('、')}`,
    type: 'system',
  };

  const updatedCandidate: Candidate = {
    ...candidates[index],
    ...fields,
    notes: [systemNote, ...candidates[index].notes],
  };

  candidates[index] = updatedCandidate;
  saveCandidates(candidates);
  return updatedCandidate;
}

export function addFollowUpNote(candidateId: string, author: string, content: string, type: FollowUpNote['type']): Candidate | null {
  const candidates = getStoredCandidates();
  const index = candidates.findIndex(c => c.id === candidateId);
  if (index === -1) return null;

  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newNote: FollowUpNote = {
    id: `note-${Date.now()}`,
    author: author || '教務顧問',
    createdAt: formattedTime,
    content,
    type,
  };

  const updatedCandidate: Candidate = {
    ...candidates[index],
    notes: [newNote, ...candidates[index].notes],
  };

  candidates[index] = updatedCandidate;
  saveCandidates(candidates);
  return updatedCandidate;
}

export function getStoredBatches(): CourseBatch[] {
  try {
    const data = localStorage.getItem(BATCHES_KEY);
    if (!data) {
      localStorage.setItem(BATCHES_KEY, JSON.stringify(INITIAL_BATCHES));
      return INITIAL_BATCHES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load batches', e);
    return INITIAL_BATCHES;
  }
}

export function saveBatches(batches: CourseBatch[]): void {
  try {
    localStorage.setItem(BATCHES_KEY, JSON.stringify(batches));
    window.dispatchEvent(new Event('hk_qas_batches_updated'));
  } catch (e) {
    console.error('Failed to save batches', e);
  }
}

export function addBatch(batch: Omit<CourseBatch, 'id' | 'enrolledCount' | 'status'>): CourseBatch {
  const batches = getStoredBatches();
  const newBatch: CourseBatch = {
    ...batch,
    id: `BATCH-${Date.now().toString().slice(-6)}`,
    enrolledCount: 0,
    status: 'upcoming',
  };
  const updated = [newBatch, ...batches];
  saveBatches(updated);
  return newBatch;
}

export function getCurrentStudentSession(): Candidate | null {
  try {
    const data = localStorage.getItem(CURRENT_STUDENT_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setCurrentStudentSession(candidate: Candidate | null): void {
  if (!candidate) {
    localStorage.removeItem(CURRENT_STUDENT_KEY);
  } else {
    localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(candidate));
  }
}

export function resetToDemoData(): void {
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(INITIAL_CANDIDATES));
  localStorage.setItem(BATCHES_KEY, JSON.stringify(INITIAL_BATCHES));
  localStorage.removeItem(CURRENT_STUDENT_KEY);
  window.dispatchEvent(new Event('hk_qas_candidates_updated'));
  window.dispatchEvent(new Event('hk_qas_batches_updated'));
}
