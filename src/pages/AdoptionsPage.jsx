import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import {
  archiveAdoptionPost,
  fetchAdminAdoptionApplications,
  fetchAdminAdoptionPosts
} from '../services/adoptionService';
import { useSettingsContext } from '../context/SettingsContext';
import { formatDate } from '../utils/formatters';
import { useI18n } from '../hooks/useI18n';

const toStatusLabel = (value) => {
  const normalized = String(value || '').trim().toLowerCase();

  if (normalized === 'pending') return 'Pending';
  if (normalized === 'under_review' || normalized === 'under review' || normalized === 'reviewing') return 'Under Review';
  if (normalized === 'accepted' || normalized === 'approved') return 'Accepted';
  if (normalized === 'rejected' || normalized === 'declined') return 'Rejected';
  return 'Pending';
};

const toPostStatusLabel = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'closed') return 'Closed';
  if (normalized === 'archived') return 'Archived';
  return 'Active';
};

const toApplicationStatusClass = (status) => {
  if (status === 'Under Review') return 'badge bg-[#e8f0fb] text-[#2f67ad]';
  if (status === 'Accepted') return 'badge badge-active';
  if (status === 'Rejected') return 'badge badge-rejected';
  return 'badge badge-pending';
};

const toPostStatusClass = (status) => {
  if (status === 'Closed') return 'badge bg-[#eef1e9] text-[#6c7669]';
  if (status === 'Archived') return 'badge badge-rejected';
  return 'badge badge-active';
};

const resolveImage = (post) => {
  if (post?.pet_image_url) return post.pet_image_url;
  if (post?.petImageUrl) return post.petImageUrl;
  if (post?.image_url) return post.image_url;
  if (post?.imageUrl) return post.imageUrl;
  if (Array.isArray(post?.images) && post.images.length > 0) return post.images[0];
  return '';
};

const normalizePost = (post, settings) => ({
  id: post?.id || post?.post_id || post?.listing_id || post?._id || Math.random().toString(36).slice(2),
  petImage: resolveImage(post),
  petName: post?.animal_name || post?.pet_name || post?.petName || post?.name || 'Unnamed Pet',
  organizationName: post?.organization_name || post?.organizationName || post?.organization?.name || 'Unknown Organization',
  breed: post?.species || post?.breed || post?.category || post?.pet_type || post?.petType || 'Unspecified',
  location: post?.location || post?.animal_details?.location || post?.city || post?.organization?.location || '—',
  datePosted: formatDate(post?.created_at || post?.createdAt || post?.posted_at, settings),
  datePostedRaw: post?.created_at || post?.createdAt || post?.posted_at || null,
  status: toPostStatusLabel(post?.status),
  description: post?.description || post?.animal_details?.description || post?.about || 'No description provided.',
  age: post?.animal_details?.age || post?.age || post?.pet_age || '—',
  gender: post?.animal_details?.gender || post?.gender || '—'
});

const normalizeApplication = (application, posts, settings) => {
  const postId = application?.post_id || application?.listing_id || application?.adoption_post_id || application?.listing?.id;
  const linkedPost = posts.find((post) => String(post.id) === String(postId));

  const applicantName = application?.applicant_name
    || application?.applicantName
    || application?.user_name
    || application?.user?.name
    || application?.name
    || 'Unknown Applicant';

  const applicantEmail = application?.applicant_email
    || application?.email
    || application?.user?.email
    || '—';

  const applicantPhone = application?.applicant_phone
    || application?.phone
    || application?.user?.phone
    || '—';

  return {
    id: application?.id || application?.application_id || application?._id || Math.random().toString(36).slice(2),
    applicantName,
    applicantEmail,
    applicantPhone,
    applicantAddress: application?.address || application?.user?.address || '—',
    message: application?.message || application?.reason || 'No message provided.',
    postId: linkedPost?.id || postId || '—',
    postName: linkedPost?.petName || application?.pet_name || application?.listing?.pet_name || 'Unknown Post',
    organizationName: linkedPost?.organizationName || application?.organization_name || application?.organization?.name || 'Unknown Organization',
    dateApplied: formatDate(application?.created_at || application?.createdAt || application?.applied_at, settings),
    status: toStatusLabel(application?.status)
  };
};

const EmptyState = ({ title, description }) => (
  <div className="rounded-2xl border border-dashed border-[#dbe1d4] bg-[#fbfcf9] px-6 py-10 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf1e8] text-[#77806d]">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M12 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
    <p className="mt-4 text-base font-semibold text-[#4b5548]">{title}</p>
    <p className="mt-1 text-sm text-[#7a8476]">{description}</p>
  </div>
);

export const AdoptionsPage = () => {
  const { settings } = useSettingsContext();
  const { t, tl } = useI18n();

  const [posts, setPosts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionToast, setActionToast] = useState('');

  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [postApplicationsModal, setPostApplicationsModal] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState(null);
  const [postsPage, setPostsPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const showActionToast = (message) => {
    setActionToast(message);
    setTimeout(() => setActionToast(''), 3000);
  };

  const loadAdoptions = async () => {
    setLoading(true);
    setError(null);

    try {
      const [postsData, applicationsData] = await Promise.all([
        fetchAdminAdoptionPosts(),
        fetchAdminAdoptionApplications()
      ]);

      const normalizedPosts = (postsData || []).map((post) => normalizePost(post, settings));
      const normalizedApplications = (applicationsData || []).map((application) => (
        normalizeApplication(application, normalizedPosts, settings)
      ));

      setPosts(normalizedPosts);
      setApplications(normalizedApplications);
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to load adoptions'));
      setPosts([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdoptions();
  }, [settings?.system?.defaultLanguage, settings?.system?.timezone]);

  const stats = useMemo(() => ({
    totalPosts: posts.length,
    totalApplications: applications.length,
    pending: applications.filter((item) => item.status === 'Pending').length,
    accepted: applications.filter((item) => item.status === 'Accepted').length,
    rejected: applications.filter((item) => item.status === 'Rejected').length
  }), [posts, applications]);

  const sortedPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? posts.filter((p) =>
          p.petName.toLowerCase().includes(q) ||
          p.organizationName.toLowerCase().includes(q) ||
          p.breed.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
        )
      : posts;
    return [...filtered].sort((a, b) =>
      new Date(b.datePostedRaw || 0) - new Date(a.datePostedRaw || 0)
    );
  }, [posts, search]);
  const postsTotalPages = Math.max(1, Math.ceil(sortedPosts.length / ITEMS_PER_PAGE));
  const pagePosts = sortedPosts.slice((postsPage - 1) * ITEMS_PER_PAGE, postsPage * ITEMS_PER_PAGE);

  const postApplications = useMemo(() => {
    if (!postApplicationsModal) return [];
    return applications.filter((application) => String(application.postId) === String(postApplicationsModal.id));
  }, [applications, postApplicationsModal]);

  const summaryCards = [
    {
      label: tl('Total Adoption Posts'),
      value: stats.totalPosts,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M12 21s-6.5-4.6-8.7-7.7A5.1 5.1 0 0 1 12 6a5.1 5.1 0 0 1 8.7 7.3C18.5 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12 10.2v4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9.6 12.6h4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: tl('Total Applications'),
      value: stats.totalApplications,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 9h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M8 13h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: tl('Pending Applications'),
      value: stats.pending,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8v4l2.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: tl('Accepted Applications'),
      value: stats.accepted,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
          <path d="m8.5 12 2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      label: tl('Rejected Applications'),
      value: stats.rejected,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
          <path d="m9 9 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="m15 9-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  return (
    <Layout title={t('pageAdoptions', 'Adoptions')} searchValue={search} onSearchChange={(v) => { setSearch(v); setPostsPage(1); }}>
      {actionToast && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {actionToast}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <div key={card.label} className="card-md transition duration-200 hover:translate-y-[-2px] hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#7a8476]">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#4b5548]">{loading ? '...' : card.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6eadf] text-[#77806d]">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-lg mt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="section-title">{tl('Adoption Posts')}</h2>
            <p className="section-subtitle">{tl('Organization-created adoption posts with read-only oversight access.')}</p>
          </div>
          <span className="badge-neutral">{tl('Total')}: {posts.length}</span>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('Loading adoption posts…')}</div>
        ) : posts.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title={tl('No adoption posts yet')}
              description={tl('Posts created by organizations will appear here for monitoring.')}
            />
          </div>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-[#7a8476]">
              <span>{tl('Page')} {postsPage} {tl('of')} {postsTotalPages} &bull; {posts.length} {tl('total posts')}</span>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669] disabled:opacity-40"
                  disabled={postsPage === 1}
                  onClick={() => setPostsPage(p => p - 1)}
                >
                  {tl('Prev')}
                </button>
                <button className="rounded-full bg-[#77806d] px-3 py-1 text-sm font-semibold text-white">{postsPage}</button>
                <button
                  className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669] disabled:opacity-40"
                  disabled={postsPage === postsTotalPages}
                  onClick={() => setPostsPage(p => p + 1)}
                >
                  {tl('Next')}
                </button>
              </div>
            </div>
            <div className="table-wrap hidden lg:block">
              <div className="grid grid-cols-[1.1fr_1.1fr_1.4fr_1fr_1fr_1fr_1fr_10rem] items-center gap-2 table-head">
                <span>{tl('Pet')}</span>
                <span>{tl('Pet Name')}</span>
                <span>{tl('Organization')}</span>
                <span>{tl('Breed / Category')}</span>
                <span>{tl('Location')}</span>
                <span>{tl('Date Posted')}</span>
                <span>{tl('Status')}</span>
                <span className="text-center">{tl('Actions')}</span>
              </div>

              {pagePosts.map((post) => (
                <div
                  key={post.id}
                  className="grid grid-cols-[1.1fr_1.1fr_1.4fr_1fr_1fr_1fr_1fr_10rem] items-center gap-2 table-row-item"
                >
                  <div className="flex items-center">
                    {post.petImage ? (
                      <img src={post.petImage} alt={post.petName} className="h-10 w-10 rounded-xl border border-[#e2e6dc] object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e6dc] bg-[#f3f5ef] text-[#77806d]">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                          <path d="M5.5 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="currentColor" strokeWidth="1.4" />
                          <path d="M18.5 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="currentColor" strokeWidth="1.4" />
                          <path d="M8.5 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="currentColor" strokeWidth="1.4" />
                          <path d="M15.5 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-[#4b5548]">{post.petName}</span>
                  <span>{post.organizationName}</span>
                  <span>{post.breed}</span>
                  <span className="text-xs text-[#7a8476]">{post.location}</span>
                  <span className="table-muted">{post.datePosted}</span>
                  <span className={toPostStatusClass(post.status)}>{tl(post.status)}</span>
                  <div className="flex items-center justify-center gap-1 text-[#77806d]">
                    <button
                      className="icon-btn"
                      title={tl('View Post Details')}
                      onClick={() => setSelectedPost(post)}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </button>
                    <button
                      className="icon-btn"
                      title={tl('View Applications')}
                      onClick={() => setPostApplicationsModal(post)}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M8 9h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M8 13h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                    <button
                      className="icon-btn text-[#a25d5d]"
                      title={tl('Archive Post')}
                      onClick={async () => {
                        try {
                          await archiveAdoptionPost(post.id);
                        } catch {
                          // Keep local archive fallback if backend endpoint is unavailable.
                        }

                        setPosts((prev) => prev.map((item) => (
                          String(item.id) === String(post.id) ? { ...item, status: 'Archived' } : item
                        )));

                        showActionToast(`✓ ${tl('Post archived')}`);
                      }}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path d="M4 7h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M9 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:hidden">
              {pagePosts.map((post) => (
                <div key={`mobile-${post.id}`} className="rounded-2xl border border-[#e6eadf] bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {post.petImage ? (
                        <img src={post.petImage} alt={post.petName} className="h-12 w-12 rounded-xl border border-[#e2e6dc] object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-xl border border-[#e2e6dc] bg-[#f3f5ef]" />
                      )}
                      <div>
                        <p className="font-semibold text-[#4b5548]">{post.petName}</p>
                        <p className="text-xs text-[#9aa294]">{post.organizationName}</p>
                      </div>
                    </div>
                    <span className={toPostStatusClass(post.status)}>{tl(post.status)}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9aa294]">{tl('Breed / Category')}</p>
                      <p className="font-medium text-[#5a6457]">{post.breed}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9aa294]">{tl('Location')}</p>
                      <p className="font-medium text-[#5a6457]">{post.location}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9aa294]">{tl('Date Posted')}</p>
                      <p className="font-medium text-[#5a6457]">{post.datePosted}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="btn-pill-outline-sm" onClick={() => setSelectedPost(post)}>{tl('View Post Details')}</button>
                    <button className="btn-pill-outline-sm" onClick={() => setPostApplicationsModal(post)}>{tl('View Applications')}</button>
                    <button
                      className="btn-pill-outline-sm text-[#a25d5d]"
                      onClick={async () => {
                        try {
                          await archiveAdoptionPost(post.id);
                        } catch {
                          // Keep local archive fallback if backend endpoint is unavailable.
                        }
                        setPosts((prev) => prev.map((item) => (
                          String(item.id) === String(post.id) ? { ...item, status: 'Archived' } : item
                        )));
                        showActionToast(`✓ ${tl('Post archived')}`);
                      }}
                    >
                      {tl('Archive Post')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card-lg mt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="section-title">{tl('Adoption Applications')}</h2>
            <p className="section-subtitle">{tl('Super Admin has read-only visibility. Final approval decisions remain with organizations.')}</p>
          </div>
          <span className="badge-neutral">{tl('Total')}: {applications.length}</span>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('Loading applications…')}</div>
        ) : applications.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title={tl('No applications yet')}
              description={tl('User-submitted applications will appear here for monitoring.')}
            />
          </div>
        ) : (
          <>
            <div className="table-wrap hidden lg:block">
              <div className="grid grid-cols-[1.3fr_1.2fr_1.4fr_1fr_1fr_10rem] items-center gap-2 table-head">
                <span>{tl('Applicant Name')}</span>
                <span>{tl('Adoption Post')}</span>
                <span>{tl('Organization')}</span>
                <span>{tl('Application Date')}</span>
                <span>{tl('Current Status')}</span>
                <span className="text-center">{tl('Actions')}</span>
              </div>

              {applications.map((application) => (
                <div key={application.id} className="grid grid-cols-[1.3fr_1.2fr_1.4fr_1fr_1fr_10rem] items-center gap-2 table-row-item">
                  <span className="font-semibold text-[#4b5548]">{application.applicantName}</span>
                  <span>{application.postName}</span>
                  <span>{application.organizationName}</span>
                  <span className="table-muted">{application.dateApplied}</span>
                  <span className={toApplicationStatusClass(application.status)}>{tl(application.status)}</span>
                  <div className="flex items-center justify-center gap-1 text-[#77806d]">
                    <button
                      className="icon-btn"
                      title={tl('View Full Application Details')}
                      onClick={() => setSelectedApplication(application)}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </button>
                    <button
                      className="icon-btn"
                      title={tl('View Applicant Profile')}
                      onClick={() => setApplicantProfile(application)}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:hidden">
              {applications.map((application) => (
                <div key={`mobile-app-${application.id}`} className="rounded-2xl border border-[#e6eadf] bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#4b5548]">{application.applicantName}</p>
                      <p className="text-xs text-[#9aa294]">{application.postName}</p>
                    </div>
                    <span className={toApplicationStatusClass(application.status)}>{tl(application.status)}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9aa294]">{tl('Organization')}</p>
                      <p className="font-medium text-[#5a6457]">{application.organizationName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9aa294]">{tl('Application Date')}</p>
                      <p className="font-medium text-[#5a6457]">{application.dateApplied}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="btn-pill-outline-sm" onClick={() => setSelectedApplication(application)}>{tl('View Full Application Details')}</button>
                    <button className="btn-pill-outline-sm" onClick={() => setApplicantProfile(application)}>{tl('View Applicant Profile')}</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-card max-w-xl" onClick={(event) => event.stopPropagation()}>
            <div>
              <p className="text-sm font-semibold text-[#9aa294]">{tl('Post Details')}</p>
              <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{selectedPost.petName}</h3>
              <p className="text-sm text-[#7a8476]">{selectedPost.organizationName}</p>
            </div>

            <div className="mt-6 px-6 space-y-4 text-sm">
              <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
                <span className="text-[#9aa294] whitespace-nowrap">{tl('Breed / Category')}:</span>
                <span className="font-semibold text-[#4b5548] break-words">{selectedPost.breed}</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
                <span className="text-[#9aa294] whitespace-nowrap">{tl('Location')}:</span>
                <span className="font-semibold text-[#4b5548] break-words">{selectedPost.location}</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
                <span className="text-[#9aa294] whitespace-nowrap">{tl('Date Posted')}:</span>
                <span className="font-semibold text-[#4b5548] break-words">{selectedPost.datePosted}</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
                <span className="text-[#9aa294] whitespace-nowrap">{tl('Status')}:</span>
                <span className={toPostStatusClass(selectedPost.status)}>{tl(selectedPost.status)}</span>
              </div>
              <div>
                <p className="text-[#9aa294]">{tl('Description')}</p>
                <p className="mt-2 rounded-xl border border-[#edf1e8] bg-[#fafaf8] px-3 py-3 text-[#5a6457]">{selectedPost.description}</p>
              </div>
            </div>

            <div className="mt-6 px-6 pb-6 flex justify-end">
              <button type="button" className="btn-secondary" onClick={() => setSelectedPost(null)}>
                {tl('Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {postApplicationsModal && (
        <div className="modal-overlay" onClick={() => setPostApplicationsModal(null)}>
          <div className="modal-card max-w-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#9aa294]">{tl('Applications for')}</p>
                <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{postApplicationsModal.petName}</h3>
                <p className="text-sm text-[#7a8476]">{postApplicationsModal.organizationName}</p>
              </div>
              <span className="badge-neutral">{tl('Total')}: {postApplications.length}</span>
            </div>

            {postApplications.length === 0 ? (
              <div className="mt-6 px-6 rounded-2xl border border-dashed border-[#dbe1d4] bg-[#fbfcf9] py-8 text-center text-sm text-[#7a8476]">
                {tl('No applications for this post yet.')}
              </div>
            ) : (
              <div className="mt-6 px-6 space-y-3">
                {postApplications.map((application) => (
                  <div key={`post-app-${application.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-[#edf1e8] px-4 py-3">
                    <div>
                      <p className="font-semibold text-[#4b5548]">{application.applicantName}</p>
                      <p className="text-xs text-[#9aa294]">{application.dateApplied}</p>
                    </div>
                    <span className={toApplicationStatusClass(application.status)}>{tl(application.status)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 px-6 pb-6 flex justify-end">
              <button type="button" className="btn-secondary" onClick={() => setPostApplicationsModal(null)}>
                {tl('Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="modal-card max-w-2xl" onClick={(event) => event.stopPropagation()}>
            <div>
              <p className="text-sm font-semibold text-[#9aa294]">{tl('Application Details')}</p>
              <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{selectedApplication.applicantName}</h3>
              <p className="text-sm text-[#7a8476]">{selectedApplication.postName} - {selectedApplication.organizationName}</p>
            </div>

            <div className="mt-6 px-6 space-y-4 text-sm">
              <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
                <span className="text-[#9aa294] whitespace-nowrap">{tl('Application Date')}:</span>
                <span className="font-semibold text-[#4b5548] break-words">{selectedApplication.dateApplied}</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
                <span className="text-[#9aa294] whitespace-nowrap">{tl('Current Status')}:</span>
                <span className={toApplicationStatusClass(selectedApplication.status)}>{tl(selectedApplication.status)}</span>
              </div>
              <div>
                <p className="text-[#9aa294]">{tl('Applicant Message')}</p>
                <p className="mt-2 rounded-xl border border-[#edf1e8] bg-[#fafaf8] px-3 py-3 text-[#5a6457]">{selectedApplication.message}</p>
              </div>
              <div className="rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-xs text-[#7a8476]">
                {tl('Approval and rejection decisions are managed by the Organization in-app. Super Admin access is read-only for oversight.')}
              </div>
            </div>

            <div className="mt-6 px-6 pb-6 flex justify-end">
              <button type="button" className="btn-secondary" onClick={() => setSelectedApplication(null)}>
                {tl('Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {applicantProfile && (
        <div className="modal-overlay" onClick={() => setApplicantProfile(null)}>
          <div className="modal-card max-w-lg" onClick={(event) => event.stopPropagation()}>
            <div>
              <p className="text-sm font-semibold text-[#9aa294]">{tl('Applicant Profile')}</p>
              <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{applicantProfile.applicantName}</h3>
              <p className="text-sm text-[#7a8476]">{applicantProfile.organizationName}</p>
            </div>

            <div className="mt-6 px-6 space-y-4 text-sm">
              <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
                <span className="text-[#9aa294] whitespace-nowrap">{tl('Email')}:</span>
                <span className="font-semibold text-[#4b5548] break-words">{applicantProfile.applicantEmail}</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
                <span className="text-[#9aa294] whitespace-nowrap">{tl('Phone')}:</span>
                <span className="font-semibold text-[#4b5548] break-words">{applicantProfile.applicantPhone}</span>
              </div>
              <div>
                <p className="text-[#9aa294]">{tl('Address')}</p>
                <p className="mt-2 rounded-xl border border-[#edf1e8] bg-[#fafaf8] px-3 py-3 text-[#5a6457]">{applicantProfile.applicantAddress}</p>
              </div>
            </div>

            <div className="mt-6 px-6 pb-6 flex justify-end">
              <button type="button" className="btn-secondary" onClick={() => setApplicantProfile(null)}>
                {tl('Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
