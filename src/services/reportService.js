import api from './api';

// GET /api/reports
export async function fetchReports() {
  const response = await api.get('/reports');
  return response.data.reports;
}

// GET /api/reports/pending (admin only)
export async function fetchPendingReports() {
  const response = await api.get('/reports');
  const reports = response.data.reports || [];
  return reports.filter((report) => String(report.status || '').toLowerCase() === 'pending');
}

// POST /api/reports (with image upload)
export async function createReport(formData) {
  const response = await api.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.report;
}

// PUT /api/reports/assign (admin only)
export async function assignRescuer(reportId, orgId) {
  const response = await api.put('/reports/assign', { reportId, orgId });
  return response.data.report;
}

// PUT /api/reports/status (admin only)
export async function updateReportStatus(reportId, status) {
  const response = await api.put('/reports/status', { reportId, status });
  return response.data.report;
}

// PUT /api/reports/review (admin only)
export async function reviewReport(reportId, status, reviewNotes) {
  const response = await api.put('/reports/review', { reportId, status, reviewNotes });
  return response.data.report;
}

// DELETE /api/reports/:id (admin only)
export async function deleteReport(id) {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
}

// PUT /api/reports/:id/flag (admin only)
export async function flagReport(id, reason) {
  const response = await api.put(`/reports/${id}/flag`, { reason });
  return response.data;
}

// GET /api/reports/post-reports (admin only)
export async function fetchPostReports() {
  const response = await api.get('/reports/post-reports');
  return response.data.postReports;
}

// PUT /api/reports/post-reports/:id/flag (admin only)
export async function flagPostReport(id, reason) {
  const response = await api.put(`/reports/post-reports/${id}/flag`, { reason });
  return response.data;
}

// PUT /api/reports/post-reports/:id/dismiss (admin only)
export async function dismissPostReport(id) {
  const response = await api.put(`/reports/post-reports/${id}/dismiss`);
  return response.data;
}
