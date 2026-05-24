import {
  CompanyProfile,
  Subsidiary,
  SubsidiaryCreate,
  FiscalYear,
  FiscalYearCreate,
  PostingPeriod,
  TaxProfile,
  TaxProfileCreate,
  SharingRule,
  IntercompanyAccount,
  IntercompanyAccountCreate,
  PaginatedResponse,
  ApiResponse
} from './types';

const API_BASE = '/api/v1/settings';

export class AuthenticationError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class PermissionError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'PermissionError';
  }
}

export class ConcurrencyConflictError extends Error {
  conflictData: any;
  constructor(message = 'A concurrency conflict occurred. The server version is different from your local version.', conflictData: any) {
    super(message);
    this.name = 'ConcurrencyConflictError';
    this.conflictData = conflictData;
  }
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('bes_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    localStorage.removeItem('bes_token');
    window.location.href = '/login';
    throw new AuthenticationError();
  }
  if (res.status === 403) {
    throw new PermissionError('You do not have permission to perform this action.');
  }
  if (res.status === 409) {
    const errorData = await res.json();
    throw new ConcurrencyConflictError('Another user has updated this record. Please review the changes.', errorData);
  }
  if (!res.ok) {
    const errText = await res.text();
    let parsedErr = errText;
    try {
      const parsed = JSON.parse(errText);
      parsedErr = parsed.error || parsed.message || errText;
    } catch {
      // Ignore JSON parsing failure and fallback to raw errText
    }
    throw new Error(parsedErr || `Request failed with status ${res.status}`);
  }
  
  if (res.status === 204) {
    return {} as T;
  }
  
  const envelope = await res.json();
  return envelope.data;
}

// Profile
export async function fetchProfile(): Promise<CompanyProfile> {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: authHeaders()
  });
  return handleResponse<CompanyProfile>(res);
}

export async function updateProfile(data: Partial<CompanyProfile>): Promise<CompanyProfile> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<CompanyProfile>(res);
}

// Subsidiaries
export async function fetchSubsidiaries(): Promise<PaginatedResponse<Subsidiary>> {
  const res = await fetch(`${API_BASE}/subsidiaries`, {
    headers: authHeaders()
  });
  // Since we want the envelope here because of total, page, etc., we can customize handleResponse or let handleResponse return the full envelope if the API returns a standard wrapped object
  // Let's make sure it handles both.
  if (res.status === 401 || res.status === 403 || res.status === 409 || !res.ok) {
    return handleResponse<PaginatedResponse<Subsidiary>>(res);
  }
  return res.json(); // returns PaginatedResponse<Subsidiary>
}

export async function createSubsidiary(data: SubsidiaryCreate): Promise<Subsidiary> {
  const res = await fetch(`${API_BASE}/subsidiaries`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Subsidiary>(res);
}

export async function updateSubsidiary(id: string, data: Partial<Subsidiary> & { version_id?: string }): Promise<Subsidiary> {
  const res = await fetch(`${API_BASE}/subsidiaries/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Subsidiary>(res);
}

export async function deleteSubsidiary(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/subsidiaries/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  await handleResponse<void>(res);
}

// Fiscal Years & Periods
export async function fetchFiscalYears(): Promise<PaginatedResponse<FiscalYear>> {
  const res = await fetch(`${API_BASE}/fiscal-years`, {
    headers: authHeaders()
  });
  if (res.status === 401 || res.status === 403 || res.status === 409 || !res.ok) {
    return handleResponse<PaginatedResponse<FiscalYear>>(res);
  }
  return res.json();
}

export async function createFiscalYear(data: FiscalYearCreate): Promise<FiscalYear> {
  const res = await fetch(`${API_BASE}/fiscal-years`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<FiscalYear>(res);
}

export async function fetchPostingPeriods(fiscalYearId: string): Promise<PostingPeriod[]> {
  const res = await fetch(`${API_BASE}/fiscal-years/${fiscalYearId}/periods`, {
    headers: authHeaders()
  });
  return handleResponse<PostingPeriod[]>(res);
}

export async function lockPostingPeriod(periodId: string): Promise<PostingPeriod> {
  const res = await fetch(`${API_BASE}/periods/${periodId}/lock`, {
    method: 'POST',
    headers: authHeaders()
  });
  return handleResponse<PostingPeriod>(res);
}

// Tax Profiles
export async function fetchTaxProfiles(): Promise<PaginatedResponse<TaxProfile>> {
  const res = await fetch(`${API_BASE}/tax-profiles`, {
    headers: authHeaders()
  });
  if (res.status === 401 || res.status === 403 || res.status === 409 || !res.ok) {
    return handleResponse<PaginatedResponse<TaxProfile>>(res);
  }
  return res.json();
}

export async function createTaxProfile(data: TaxProfileCreate): Promise<TaxProfile> {
  const res = await fetch(`${API_BASE}/tax-profiles`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<TaxProfile>(res);
}

// Sharing & Intercompany
export async function fetchSharingRules(): Promise<SharingRule[]> {
  const res = await fetch(`${API_BASE}/sharing-rules`, {
    headers: authHeaders()
  });
  return handleResponse<SharingRule[]>(res);
}

export async function updateSharingRules(data: SharingRule[]): Promise<SharingRule[]> {
  const res = await fetch(`${API_BASE}/sharing-rules`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<SharingRule[]>(res);
}

export async function fetchIntercompanyAccounts(): Promise<IntercompanyAccount[]> {
  const res = await fetch(`${API_BASE}/intercompany-accounts`, {
    headers: authHeaders()
  });
  return handleResponse<IntercompanyAccount[]>(res);
}

export async function createIntercompanyAccount(data: IntercompanyAccountCreate): Promise<IntercompanyAccount> {
  const res = await fetch(`${API_BASE}/intercompany-accounts`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<IntercompanyAccount>(res);
}
