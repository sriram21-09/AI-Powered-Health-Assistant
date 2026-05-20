import type { HealthRecord } from '../types';

const STORAGE_KEY = 'health_assistant_history';

export class HistoryService {
  /**
   * Save a diagnosis record to localStorage.
   */
  static saveDiagnosis(record: HealthRecord): void {
    const history = this.getHistory();
    history.unshift(record); // newest first
    // Keep only the last 50 records
    const trimmed = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }

  /**
   * Retrieve all past diagnosis records.
   */
  static getHistory(): HealthRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as HealthRecord[];
    } catch {
      console.error('Failed to parse history from localStorage');
      return [];
    }
  }

  /**
   * Delete a single diagnosis record by ID.
   */
  static deleteDiagnosis(id: string): void {
    const history = this.getHistory();
    const filtered = history.filter(record => record.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Clear all diagnosis history.
   */
  static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get the total count of saved diagnoses.
   */
  static getCount(): number {
    return this.getHistory().length;
  }
}
