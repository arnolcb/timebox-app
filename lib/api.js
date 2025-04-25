// lib/api.js
export async function fetchSheets() {
  const response = await fetch('/api/sheets');
  if (!response.ok) throw new Error('Error al cargar las hojas');
  return response.json();
}

export async function createSheet(sheetData) {
  const response = await fetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sheetData),
  });
  if (!response.ok) throw new Error('Error al crear la hoja');
  return response.json();
}

export async function updateSheet(id, sheetData) {
  const response = await fetch(`/api/sheets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sheetData),
  });
  if (!response.ok) throw new Error('Error al actualizar la hoja');
  return response.json();
}

export async function deleteSheet(id) {
  const response = await fetch(`/api/sheets/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar la hoja');
}

export async function fetchPreferences() {
  const response = await fetch('/api/preferences');
  if (!response.ok) throw new Error('Error al cargar preferencias');
  return response.json();
}

export async function updatePreferences(preferences) {
  const response = await fetch('/api/preferences', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });
  if (!response.ok) throw new Error('Error al actualizar preferencias');
  return response.json();
}