// Town Selection Persistence

const TOWN_STORAGE_KEY = 'renizo_selected_town';

export function getSelectedTownId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOWN_STORAGE_KEY);
}

export function setSelectedTownId(townId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOWN_STORAGE_KEY, townId);
}

export function clearSelectedTownId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOWN_STORAGE_KEY);
}

export function hasSelectedTown(): boolean {
  return getSelectedTownId() !== null;
}
