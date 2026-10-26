import { CRMData } from '../types/crm';
import { INITIAL_DATA } from './initialData';

const STORAGE_KEY = 'nextforce_crm_data_v1';

export function loadCRMData(): CRMData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveCRMData(INITIAL_DATA);
      return INITIAL_DATA;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Falha ao ler dados do localStorage:', err);
    return INITIAL_DATA;
  }
}

export function saveCRMData(data: CRMData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Falha ao salvar dados no localStorage:', err);
  }
}

export function resetCRMData(): CRMData {
  saveCRMData(INITIAL_DATA);
  return INITIAL_DATA;
}
