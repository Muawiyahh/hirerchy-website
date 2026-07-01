import {
  signIn, signUp, signOut, refreshSession, uploadResume,
  getOrCreateMyClientProfile, getMyApplications,
  saveStoredSession, loadStoredSession, clearStoredSession, isSessionExpired,
  US_STATES, COUNTRIES, optionList,
  SUPABASE_URL, SUPABASE_ANON_KEY,
} from './lib/supabase.js';
import { COUNTRY_STATES, COUNTRY_CODES } from './lib/countryStates.js';

const SESSION_KEY = 'hirerchy-client-session';

// ── Tab navigation ────────────────────────────────────────────────────────────

const SECTIONS = [
  's-personal', 's-address', 's-legal', 's-work-prefs',
  's-portfolio', 's-skills', 's-experience', 's-education',
  's-eeo', 's-cover', 's-resume',
];
const SECTION_LABELS = [
  'Personal', 'Address', 'Legal', 'Work Preferences',
  'Portfolio', 'Skills', 'Experience', 'Education',
  'EEO', 'Cover Letter', 'Resume',
];
let activeTab = 0;

function switchTab(idx) {
  idx = Math.max(0, Math.min(SECTIONS.length - 1, idx));
  activeTab = idx;

  SECTIONS.forEach((id, i) => {
    document.getElementById(id)?.classList.toggle('is-active', i === idx);
  });

  document.querySelectorAll('.snav-btn').forEach((btn, i) => {
    btn.classList.toggle('is-active', i === idx);
  });

  const prevBtn = document.getElementById('btn-tab-prev');
  const nextBtn = document.getElementById('btn-tab-next');
  const isLast  = idx === SECTIONS.length - 1;
  if (prevBtn) prevBtn.classList.toggle('hidden-nav', idx === 0);
  if (nextBtn) {
    nextBtn.classList.toggle('hidden-nav', isLast);
    if (!isLast) nextBtn.textContent = `Next: ${SECTION_LABELS[idx + 1]} →`;
  }

  // The "Complete profile" save bar appears only on the final page.
  document.querySelector('.form-save-bar')?.classList.toggle('hidden', !isLast);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateSidebarDots() {
  SECTIONS.forEach((id, i) => {
    const section = document.getElementById(id);
    const btn = document.querySelectorAll('.snav-btn')[i];
    if (!section || !btn) return;
    const hasData = Array.from(section.querySelectorAll('input, select, textarea'))
      .some(el => String(el.value).trim() !== '');
    btn.classList.toggle('has-data', hasData);
  });
}

// Populate the Country dropdown (defaults to United States) and the State list
// for that country. The State options follow whichever country is selected.
const countrySelect = document.getElementById('p-country');
const stateSelect   = document.getElementById('p-state');
countrySelect.innerHTML = optionList(COUNTRIES, 'United States');

function populateStates(country, selected = '') {
  const list = country === 'United States' ? US_STATES : (COUNTRY_STATES[country] || []);
  stateSelect.innerHTML = optionList(list, selected, list.length ? '— select —' : '— n/a —');
}
populateStates('United States');

// Switching country rebuilds the state list (and clears the old selection).
countrySelect.addEventListener('change', () => populateStates(countrySelect.value));

// ── ZIP → City / State auto-fill ──────────────────────────────────────────────
// On ZIP entry, look up the location (free, no-key api.zippopotam.us) for the
// selected country and fill City / State — but only if they're empty, so a
// manual entry is never overwritten. Fails silently if offline or unsupported.
const zipInput  = document.getElementById('p-zip');
const cityInput = document.getElementById('p-city');

async function lookupZipLocation() {
  const cc = COUNTRY_CODES[countrySelect.value];
  let zip = zipInput.value.trim();
  if (countrySelect.value === 'United States') zip = zip.replace(/\D/g, '').slice(0, 5);
  if (!zip || !cc) return;

  try {
    const res = await fetch(`https://api.zippopotam.us/${cc}/${encodeURIComponent(zip)}`);
    if (!res.ok) return; // 404 = not found — leave fields as-is
    const place = (await res.json()).places?.[0];
    if (!place) return;

    // The ZIP is the authoritative source — set both City and State from it.
    // (The user can still edit either afterward; this only runs on ZIP change.)
    let changed = false;
    if (place['place name']) {
      cityInput.value = place['place name'];
      changed = true;
    }
    if (place.state) {
      const opt = Array.from(stateSelect.options)
        .find(o => o.value.toLowerCase() === place.state.toLowerCase());
      if (opt) { stateSelect.value = opt.value; changed = true; }
    }
    if (changed) { updateMeter(); scheduleSave(); }
  } catch { /* network error — user can fill manually */ }
}

zipInput.addEventListener('change', lookupZipLocation);

// ── DOM ───────────────────────────────────────────────────────────────────────
const viewLogin    = document.getElementById('view-login');
const viewProfile  = document.getElementById('view-profile');
const formLogin    = document.getElementById('form-login');
const loginError   = document.getElementById('login-error');
const profileAlert = document.getElementById('profile-alert');
const successModal = document.getElementById('success-modal');
const btnSuccessClose = document.getElementById('btn-success-close');
const formProfile  = document.getElementById('form-profile');
const btnLogout    = document.getElementById('btn-logout');
const workList     = document.getElementById('work-list');
const eduList      = document.getElementById('edu-list');
const resumeInput  = document.getElementById('p-resume');
const resumeCurrent = document.getElementById('resume-current');
const coverLetterInput   = document.getElementById('p-cover-letter');
const coverLetterCurrent = document.getElementById('cover-letter-current');
const clModeUpload = document.getElementById('cl-mode-upload');
const clModePaste  = document.getElementById('cl-mode-paste');
const clUploadPanel = document.getElementById('cl-upload-panel');
const clPastePanel  = document.getElementById('cl-paste-panel');
const visaSelect    = document.getElementById('p-visa-type');
const visaOtherWrap = document.getElementById('visa-other-wrap');
const visaOtherInput= document.getElementById('p-visa-other');
const btnVisaBack   = document.getElementById('btn-visa-back');
const btnAuth        = document.getElementById('btn-auth');
const authToggleText = document.getElementById('auth-toggle-text');
const authToggleLink = document.getElementById('auth-toggle-link');
const btnTheme     = document.getElementById('btn-theme');
const progressPct  = document.getElementById('progress-pct');
const progressFill = document.getElementById('progress-fill');
const saveToast    = document.getElementById('save-toast');
let toastTimer     = null;

let session       = null;
let clientId      = null;
let workItems     = [];
let eduItems      = [];
let authMode      = 'signup';  // 'signin' | 'signup'
let isPopulating  = false;     // guards autosave while loading the form
let saveTimer     = null;
let reached100    = false;
let currentResumeUrl = null;
let currentCoverLetterUrl = null;
let keepAliveTimer = null;

// ── Helpers ───────────────────────────────────────────────────────────────────

const headers = (token) => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${token}`,
});

function showView(name) {
  viewLogin.classList.toggle('hidden', name !== 'login');
  viewProfile.classList.toggle('hidden', name !== 'profile');
}

function showAlert(msg, type = 'error') {
  profileAlert.textContent = msg;
  profileAlert.className = `alert alert-${type}`;
  profileAlert.classList.remove('hidden');
  setTimeout(() => profileAlert.classList.add('hidden'), 4000);
}

function showCelebration() {
  // Animation replays automatically since the modal goes display:none → visible.
  successModal.classList.remove('hidden');
}
btnSuccessClose.addEventListener('click', () => successModal.classList.add('hidden'));
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) successModal.classList.add('hidden');
});

// ── Theme toggle ────────────────────────────────────────────────────────────

btnTheme.addEventListener('click', () => {
  // CSS default is dark; light mode is opt-in via data-theme="light".
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme'); // back to default (dark)
    localStorage.setItem('hirerchy-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('hirerchy-theme', 'light');
  }
});

// ── Auth ──────────────────────────────────────────────────────────────────────

authToggleLink.addEventListener('click', (e) => {
  e.preventDefault();
  authMode = authMode === 'signin' ? 'signup' : 'signin';
  loginError.classList.add('hidden');
  if (authMode === 'signup') {
    btnAuth.textContent        = 'Create account';
    authToggleText.textContent = 'Already have an account?';
    authToggleLink.textContent = 'Sign in';
  } else {
    btnAuth.textContent        = 'Sign in';
    authToggleText.textContent = 'First time here?';
    authToggleLink.textContent = 'Create an account';
  }
});

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  btnAuth.disabled = true;
  btnAuth.textContent = authMode === 'signup' ? 'Creating account…' : 'Signing in…';
  loginError.classList.add('hidden');

  try {
    if (authMode === 'signup') {
      const result = await signUp(email, password);
      session = result.access_token ? result : await signIn(email, password);
    } else {
      session = await signIn(email, password);
    }
    saveStoredSession(SESSION_KEY, session);
    await linkAndLoad();
  } catch (err) {
    clearStoredSession(SESSION_KEY);
    session = null;
    loginError.textContent = err.message;
    loginError.classList.remove('hidden');
  } finally {
    btnAuth.disabled = false;
    btnAuth.textContent = authMode === 'signup' ? 'Create account' : 'Sign in';
  }
});

btnLogout.addEventListener('click', async () => {
  stopKeepAlive();
  clearStoredSession(SESSION_KEY);
  await signOut(session?.access_token).catch(() => {});
  session = null;
  clientId = null;
  showView('login');
});

// ── Session keep-alive (refresh the token while the page stays open) ──────────

function startKeepAlive() {
  stopKeepAlive();
  keepAliveTimer = setInterval(async () => {
    if (!session?.refresh_token) return;
    try {
      session = await refreshSession(session.refresh_token);
      saveStoredSession(SESSION_KEY, session);
    } catch { /* a later reload will surface the issue */ }
  }, 10 * 60 * 1000); // every 10 minutes
}

function stopKeepAlive() {
  clearInterval(keepAliveTimer);
  keepAliveTimer = null;
}

// Restore a saved session on page load so reloads don't log the user out.
async function restoreSession() {
  const stored = loadStoredSession(SESSION_KEY);
  if (!stored?.access_token) { showView('login'); return; }
  session = stored;
  try {
    if (isSessionExpired(session)) {
      session = await refreshSession(session.refresh_token);
      saveStoredSession(SESSION_KEY, session);
    }
    await linkAndLoad();
  } catch {
    clearStoredSession(SESSION_KEY);
    session = null;
    showView('login');
  }
}

// ── Load (or auto-create) the client's own profile ────────────────────────────

async function linkAndLoad() {
  const client = await getOrCreateMyClientProfile(session.access_token);
  if (!client) throw new Error('Could not load your profile. Please try again.');

  reached100 = false;
  clientId = client.id;
  populateForm(client);
  showView('profile');
  startKeepAlive();
}

// ── Populate form ─────────────────────────────────────────────────────────────

function populateForm(client) {
  isPopulating = true;

  // Single-value fields. (state / employment_type / work_arrangement handled below.)
  const fields = [
    'first_name', 'middle_name', 'last_name', 'email', 'phone',
    'address_line1', 'city', 'zip', 'country',
    'is_18_plus', 'work_authorized', 'requires_sponsorship', 'visa_type',
    'non_compete', 'worked_for_government',
    'salary_expectation', 'willing_to_relocate', 'preferred_locations',
    'willing_to_travel', 'travel_percentage', 'has_drivers_license',
    'availability', 'years_experience', 'notice_period',
    'linkedin_url', 'portfolio_url', 'additional_links',
    'cover_letter_text',
    'gender', 'ethnicity', 'veteran_status', 'disability_status',
  ];

  fields.forEach(key => {
    const el = formProfile.elements[key];
    if (el && client[key] != null && client[key] !== '') el.value = client[key];
  });

  // State list depends on the country — build it, then select the saved state.
  populateStates(countrySelect.value || 'United States', client.state || '');

  // Multi-select preferences are stored comma-joined → tick the matching boxes.
  ['employment_type', 'work_arrangement'].forEach(key => {
    const vals = String(client[key] || '').split(',').map(s => s.trim()).filter(Boolean);
    formProfile.querySelectorAll(`input[name="${key}"]`).forEach(cb => {
      cb.checked = vals.includes(cb.value);
    });
  });

  // If stored visa_type is a custom value (not in the preset list), show the text input
  if (client.visa_type) {
    const presets = Array.from(visaSelect.options).map(o => o.value);
    if (!presets.includes(client.visa_type)) {
      visaSelect.value = 'Other';
      visaOtherInput.value = client.visa_type;
      showVisaOther();
    }
  }

  if (client.skills?.length) {
    formProfile.elements['skills'].value = client.skills.join(', ');
  }

  currentResumeUrl = client.resume_url || null;
  if (currentResumeUrl) {
    resumeCurrent.innerHTML = `📄 Current resume: <strong>${esc(currentResumeUrl.split('/').pop())}</strong>`;
    resumeCurrent.classList.remove('hidden');
  }

  currentCoverLetterUrl = client.cover_letter_url || null;
  if (currentCoverLetterUrl) {
    coverLetterCurrent.innerHTML = `📄 Current cover letter: <strong>${esc(currentCoverLetterUrl.split('/').pop())}</strong>`;
    coverLetterCurrent.classList.remove('hidden');
  }
  if (client.cover_letter_text) {
    clModePaste.click();
  }

  workItems = Array.isArray(client.work_experience) ? client.work_experience : [];
  renderWorkList();

  eduItems = Array.isArray(client.education) ? client.education : [];
  renderEduList();

  isPopulating = false;
  updateMeter(true); // silent — never celebrate just because a saved profile is already complete
}

// ── Completion meter ──────────────────────────────────────────────────────────

const COMPLETION_FIELDS = [
  // Personal
  'first_name', 'last_name', 'email', 'phone',
  // Address
  'address_line1', 'city', 'state', 'zip', 'country',
  // Legal
  'is_18_plus', 'work_authorized', 'requires_sponsorship', 'visa_type',
  'non_compete', 'worked_for_government',
  // Work preferences
  'employment_type', 'work_arrangement', 'years_experience',
  'availability', 'salary_expectation', 'willing_to_relocate',
  'willing_to_travel', 'has_drivers_license',
  // Portfolio
  'linkedin_url',
  // Skills
  'skills',
];
// extras (3): ≥1 work entry, ≥1 edu entry, resume.
// Portfolio URL and cover letter are optional and intentionally not required for 100%.

function computeCompletion() {
  const extras = 3;
  const total  = COMPLETION_FIELDS.length + extras;
  let filled   = 0;

  COMPLETION_FIELDS.forEach(key => {
    const el = formProfile.elements[key];
    // For checkbox groups (employment_type/work_arrangement) .value is non-empty
    // when at least one box is checked.
    if (el && String(el.value).trim() !== '') filled++;
  });

  if (workItems.some(w => w.title || w.company)) filled++;
  if (eduItems.some(e => e.school || e.degree))  filled++;
  if (currentResumeUrl) filled++;

  return Math.round((filled / total) * 100);
}

function updateMeter() {
  const pct = computeCompletion();
  progressFill.style.width = pct + '%';
  progressPct.textContent  = pct + '%';
  updateSidebarDots();
}

// ── Autosave ──────────────────────────────────────────────────────────────────

function setSaveStatus() {}  // pill removed — toast shown via showSaveToast()

function showSaveToast() {
  clearTimeout(toastTimer);
  saveToast.classList.add('is-visible');
  toastTimer = setTimeout(() => saveToast.classList.remove('is-visible'), 2800);
}

function scheduleSave(delay = 800) {
  if (isPopulating || !clientId) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveProfile, delay);
}

async function patchClient(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${clientId}`, {
    method: 'PATCH',
    headers: { ...headers(session.access_token), Prefer: 'return=minimal' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Could not save');
  }
}

// ── Visa "Other" toggle ───────────────────────────────────────────────────────

function showVisaOther() {
  visaSelect.classList.add('hidden');
  visaOtherWrap.classList.remove('hidden');
}
function hideVisaOther() {
  visaSelect.classList.remove('hidden');
  visaOtherWrap.classList.add('hidden');
  visaSelect.value = '';
  visaOtherInput.value = '';
}

visaSelect.addEventListener('change', () => {
  if (visaSelect.value === 'Other') showVisaOther();
});
btnVisaBack.addEventListener('click', () => {
  hideVisaOther();
  if (!isPopulating) scheduleSave();
});
visaOtherInput.addEventListener('input', () => {
  if (!isPopulating) scheduleSave();
});

// ── Form data collection ──────────────────────────────────────────────────────

const MULTI_FIELDS = ['employment_type', 'work_arrangement'];

function collectFormData() {
  const fd = new FormData(formProfile);
  const data = {};
  for (const [k, v] of fd.entries()) {
    if (k === 'skills') data[k] = v.split(',').map(s => s.trim()).filter(Boolean);
    else if (MULTI_FIELDS.includes(k)) continue; // handled below
    else data[k] = v; // keep empty strings so cleared fields persist
  }
  // Multi-select preferences → comma-joined string. Set explicitly (even when
  // nothing is checked) so de-selecting everything still persists as empty.
  MULTI_FIELDS.forEach(k => { data[k] = fd.getAll(k).join(', '); });

  // If "Other…" was selected, replace with the custom typed value
  if (data.visa_type === 'Other') {
    const custom = visaOtherInput.value.trim();
    data.visa_type = custom || '';
  }
  data.work_experience = workItems;
  data.education = eduItems;
  return data;
}

async function saveProfile() {
  if (!clientId) return;
  try {
    await patchClient(collectFormData());
  } catch {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveProfile, 3000); // retry silently
  }
}

// Final "Complete profile" button (shown only on the last page) — save the
// latest changes, then show the completion message.
document.getElementById('btn-save-manual').addEventListener('click', async () => {
  const btn = document.getElementById('btn-save-manual');
  btn.disabled = true;
  btn.textContent = 'Submitting…';
  clearTimeout(saveTimer);
  await saveProfile();
  btn.disabled = false;
  btn.textContent = 'Complete profile';
  showCelebration();
});

// Any edit to a form field (including the dynamic work/edu inputs, which bubble up)
formProfile.addEventListener('input',  () => { updateMeter(); scheduleSave(); });
formProfile.addEventListener('change', () => { updateMeter(); scheduleSave(); });

// Pressing Enter shouldn't reload — save immediately instead
formProfile.addEventListener('submit', (e) => {
  e.preventDefault();
  clearTimeout(saveTimer);
  saveProfile();
});

// Resume upload → upload then persist the URL right away
resumeInput.addEventListener('change', async () => {
  const file = resumeInput.files[0];
  if (!file || !clientId) return;
  setSaveStatus('saving');
  try {
    currentResumeUrl = await uploadResume(session.access_token, clientId, file);
    resumeCurrent.innerHTML = `📄 Current resume: <strong>${esc(file.name)}</strong>`;
    resumeCurrent.classList.remove('hidden');
    await patchClient({ resume_url: currentResumeUrl });
    setSaveStatus('saved');
    updateMeter();
  } catch (err) {
    setSaveStatus('error');
  }
});

// ── Cover letter toggle ───────────────────────────────────────────────────────

clModeUpload.addEventListener('click', () => {
  clModeUpload.classList.add('active');
  clModePaste.classList.remove('active');
  clUploadPanel.classList.remove('hidden');
  clPastePanel.classList.add('hidden');
});

clModePaste.addEventListener('click', () => {
  clModePaste.classList.add('active');
  clModeUpload.classList.remove('active');
  clPastePanel.classList.remove('hidden');
  clUploadPanel.classList.add('hidden');
});

coverLetterInput.addEventListener('change', async () => {
  const file = coverLetterInput.files[0];
  if (!file || !clientId) return;
  setSaveStatus('saving');
  try {
    const path = `cover-letters/${clientId}/${Date.now()}_${file.name}`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/resumes/${path}`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': file.type },
      body: file,
    });
    if (!res.ok) throw new Error('Upload failed');
    currentCoverLetterUrl = `${SUPABASE_URL}/storage/v1/object/public/resumes/${path}`;
    coverLetterCurrent.innerHTML = `📄 Current cover letter: <strong>${esc(file.name)}</strong>`;
    coverLetterCurrent.classList.remove('hidden');
    await patchClient({ cover_letter_url: currentCoverLetterUrl });
    setSaveStatus('saved');
  } catch {
    setSaveStatus('error');
  }
});

// ── Work experience ───────────────────────────────────────────────────────────

document.getElementById('btn-add-work').addEventListener('click', () => {
  workItems.push({ title: '', company: '', location: '', start: '', end: '', description: '' });
  renderWorkList();
  updateMeter();
  scheduleSave();
});

function renderWorkList() {
  workList.innerHTML = workItems.map((w, i) => `
    <div class="entry-card">
      <button type="button" class="entry-remove" data-type="work" data-index="${i}">✕</button>
      <div class="form-row">
        <div class="field">
          <label>Job title</label>
          <input value="${esc(w.title)}" data-work="${i}" data-field="title" />
        </div>
        <div class="field">
          <label>Company</label>
          <input value="${esc(w.company)}" data-work="${i}" data-field="company" />
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Location <span class="label-hint">(optional)</span></label>
          <input value="${esc(w.location || '')}" data-work="${i}" data-field="location" placeholder="e.g. Austin, TX" />
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Start date</label>
          <input type="month" value="${esc(w.start)}" data-work="${i}" data-field="start" />
        </div>
        <div class="field">
          <label>End date <span class="label-hint">(leave blank if current)</span></label>
          <input type="month" value="${esc(w.end)}" data-work="${i}" data-field="end" />
        </div>
      </div>
      <div class="field">
        <label>Description</label>
        <textarea rows="2" data-work="${i}" data-field="description">${esc(w.description)}</textarea>
      </div>
    </div>`).join('');
  bindEntryEvents();
}

// ── Education ─────────────────────────────────────────────────────────────────

const DEGREE_TYPES = [
  'High School Diploma / GED', "Associate's Degree", "Bachelor's Degree",
  "Master's Degree", 'MBA', 'Doctorate (PhD)',
  'Professional Degree (JD, MD, etc.)', 'Certificate / Diploma', 'Other',
];

function degreeOptions(selected) {
  return ['<option value="">— select —</option>']
    .concat(DEGREE_TYPES.map(o =>
      `<option value="${o}"${o === selected ? ' selected' : ''}>${o}</option>`))
    .join('');
}

document.getElementById('btn-add-edu').addEventListener('click', () => {
  eduItems.push({ school: '', degree: '', field: '', start: '', end: '', gpa: '' });
  renderEduList();
  updateMeter();
  scheduleSave();
});

function renderEduList() {
  eduList.innerHTML = eduItems.map((e, i) => `
    <div class="entry-card">
      <button type="button" class="entry-remove" data-type="edu" data-index="${i}">✕</button>
      <div class="form-row">
        <div class="field">
          <label>School</label>
          <input value="${esc(e.school)}" data-edu="${i}" data-field="school" />
        </div>
        <div class="field">
          <label>Degree</label>
          <select data-edu="${i}" data-field="degree">${degreeOptions(e.degree)}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Field of study</label>
          <input value="${esc(e.field)}" data-edu="${i}" data-field="field" />
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Start date</label>
          <input type="month" value="${esc(e.start)}" data-edu="${i}" data-field="start" />
        </div>
        <div class="field">
          <label>End date</label>
          <input type="month" value="${esc(e.end)}" data-edu="${i}" data-field="end" />
        </div>
      </div>
      <div class="form-row">
        <div class="field" style="flex:0 0 140px">
          <label>GPA <span class="label-hint">(optional)</span></label>
          <input value="${esc(e.gpa || '')}" data-edu="${i}" data-field="gpa" placeholder="e.g. 3.8" />
        </div>
      </div>
    </div>`).join('');
  bindEntryEvents();
}

// ── Entry event binding ───────────────────────────────────────────────────────

function bindEntryEvents() {
  document.querySelectorAll('.entry-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.index);
      if (btn.dataset.type === 'work') { workItems.splice(i, 1); renderWorkList(); }
      else                             { eduItems.splice(i, 1);  renderEduList(); }
      updateMeter();
      scheduleSave();
    });
  });

  // Live sync the dynamic entries into their arrays. The bubbled 'input' event
  // also reaches the form-level listener, which handles the autosave + meter.
  document.querySelectorAll('[data-work]').forEach(el => {
    el.addEventListener('input', () => {
      workItems[el.dataset.work][el.dataset.field] = el.value;
    });
  });
  document.querySelectorAll('[data-edu]').forEach(el => {
    el.addEventListener('input', () => {
      eduItems[el.dataset.edu][el.dataset.field] = el.value;
    });
  });
}

// ── XSS-safe escape ───────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Sidebar + tab nav event listeners ────────────────────────────────────────

document.querySelectorAll('.snav-btn').forEach((btn, i) => {
  btn.addEventListener('click', () => switchTab(i));
});

document.getElementById('btn-tab-prev')?.addEventListener('click', () => switchTab(activeTab - 1));
document.getElementById('btn-tab-next')?.addEventListener('click', () => switchTab(activeTab + 1));

// Initialise tab state so Section 1 is active on load
switchTab(0);

// ── Applications tracker (client-facing, read-only) ───────────────────────────

const panelProfileLayout = document.querySelector('.profile-layout');
const panelApps    = document.getElementById('panel-applications');
const profileMeter = document.getElementById('profile-meter');
const vsProfile    = document.getElementById('vs-profile');
const vsApps       = document.getElementById('vs-apps');
const appsSummary  = document.getElementById('apps-summary');
const appsLoading  = document.getElementById('apps-loading');
const appsEmpty    = document.getElementById('apps-empty');
const appsTableWrap = document.getElementById('apps-table-wrap');
const appsTbody    = document.getElementById('apps-tbody');
const btnAppsRefresh = document.getElementById('btn-apps-refresh');

const APP_STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Closed'];
let appsLoaded = false;

function switchPortalView(view) {
  const isApps = view === 'apps';
  panelApps.classList.toggle('hidden', !isApps);
  panelProfileLayout.classList.toggle('hidden', isApps);
  profileMeter?.classList.toggle('hidden', isApps);
  vsApps.classList.toggle('is-active', isApps);
  vsProfile.classList.toggle('is-active', !isApps);
  vsApps.setAttribute('aria-selected', String(isApps));
  vsProfile.setAttribute('aria-selected', String(!isApps));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (isApps && !appsLoaded) loadApplications();
}

vsProfile.addEventListener('click', () => switchPortalView('profile'));
vsApps.addEventListener('click', () => switchPortalView('apps'));
btnAppsRefresh.addEventListener('click', () => loadApplications());
// Reset to the profile view on logout so a fresh login always starts there.
btnLogout.addEventListener('click', () => { appsLoaded = false; switchPortalView('profile'); });

// Only allow http(s) links through to the DOM (applications are agency-entered,
// but this keeps a javascript:/data: URL from ever becoming a clickable link).
function safeUrl(u) {
  return /^https?:\/\//i.test(String(u || '')) ? u : '';
}

function fmtAppDate(d) {
  if (!d) return '—';
  const dt = new Date(`${d}T00:00:00`);
  if (isNaN(dt.getTime())) return esc(d);
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusBadge(status) {
  const s = APP_STATUSES.includes(status) ? status : 'Applied';
  return `<span class="status-badge status-${s.toLowerCase()}">${esc(s)}</span>`;
}

// Monday-based start of the current week (local time).
function startOfWeek() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function renderAppsSummary(apps) {
  const weekStart = startOfWeek();
  const inWeek = a => a.applied_at && new Date(`${a.applied_at}T00:00:00`) >= weekStart;
  const cards = [
    { label: 'Total applications', value: apps.length },
    { label: 'Sent this week', value: apps.filter(inWeek).length },
    { label: 'Interviews', value: apps.filter(a => a.status === 'Interview' || a.status === 'Offer').length, accent: true },
    { label: 'Responses', value: apps.filter(a => ['Screening', 'Interview', 'Offer'].includes(a.status)).length },
  ];
  appsSummary.innerHTML = cards.map(c => `
    <div class="apps-stat${c.accent ? ' apps-stat-accent' : ''}">
      <div class="apps-stat-value">${c.value}</div>
      <div class="apps-stat-label">${c.label}</div>
    </div>`).join('');
}

function renderApplications(apps) {
  renderAppsSummary(apps);
  if (!apps.length) {
    appsEmpty.classList.remove('hidden');
    appsTableWrap.classList.add('hidden');
    return;
  }
  appsEmpty.classList.add('hidden');
  appsTableWrap.classList.remove('hidden');
  appsTbody.innerHTML = apps.map(a => {
    const url = safeUrl(a.job_url);
    return `
    <tr>
      <td class="apps-company">
        ${esc(a.company || '—')}
        ${a.location ? `<span class="apps-loc">${esc(a.location)}</span>` : ''}
      </td>
      <td>${esc(a.role_title || '—')}</td>
      <td class="apps-col-date">${fmtAppDate(a.applied_at)}</td>
      <td class="apps-col-status">${statusBadge(a.status)}</td>
      <td class="apps-col-link">${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="apps-link" aria-label="Open job posting">↗</a>` : ''}</td>
    </tr>`;
  }).join('');
}

async function loadApplications() {
  if (!clientId || !session) return;
  appsLoaded = true;
  appsLoading.textContent = 'Loading your applications…';
  appsLoading.classList.remove('hidden');
  appsEmpty.classList.add('hidden');
  appsTableWrap.classList.add('hidden');
  try {
    const apps = await getMyApplications(session.access_token, clientId);
    renderApplications(apps);
    appsLoading.classList.add('hidden');
  } catch {
    appsSummary.innerHTML = '';
    appsLoading.textContent = "Couldn't load your applications. Tap Refresh to try again.";
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────

function revealApp() {
  const splash = document.getElementById('boot-splash');
  if (!splash) return;
  splash.classList.add('is-hidden');
  setTimeout(() => splash.remove(), 450);
}

restoreSession().finally(revealApp);
