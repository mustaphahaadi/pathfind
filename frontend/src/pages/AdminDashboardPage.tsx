import { useCallback, useEffect, useState } from "react";
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Clock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Users,
  Trash2,
  CalendarDays,
  FileText,
  User,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { api } from "../lib/api";
import type { UserOut, AdminStatsOut } from "../types/api";

type AdminTab = "pending" | "mentors" | "mentees";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("pending");
  const [stats, setStats] = useState<AdminStatsOut | null>(null);
  const [pendingMentors, setPendingMentors] = useState<UserOut[]>([]);
  const [allMentors, setAllMentors] = useState<UserOut[]>([]);
  const [allMentees, setAllMentees] = useState<UserOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchAdminData = useCallback(() => {
    Promise.all([
      api.admin.getStats().catch(() => null),
      api.admin.listPendingMentors().catch(() => []),
      api.admin.listAllMentors().catch(() => []),
      api.admin.listAllMentees().catch(() => []),
    ])
      .then(([statsRes, pendingRes, mentorsRes, menteesRes]) => {
        setStats(statsRes);
        setPendingMentors(pendingRes);
        setAllMentors(mentorsRes);
        setAllMentees(menteesRes);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load admin portal data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleRefresh = () => {
    setLoading(true);
    fetchAdminData();
  };

  const handleApprove = async (mentorId: number, mentorName: string) => {
    setProcessingId(mentorId);
    setActionSuccess(null);
    try {
      await api.admin.approveMentor(mentorId);
      setActionSuccess(`Successfully approved mentor application for ${mentorName}.`);
      fetchAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve mentor.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (mentorId: number, mentorName: string) => {
    setProcessingId(mentorId);
    setActionSuccess(null);
    try {
      await api.admin.rejectMentor(mentorId);
      setActionSuccess(`Mentor application for ${mentorName} has been rejected.`);
      fetchAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject mentor.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user account "${userName}"?`)) return;
    setProcessingId(userId);
    setActionSuccess(null);
    try {
      await api.admin.deleteUser(userId);
      setActionSuccess(`User account for ${userName} was deleted.`);
      fetchAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user account.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header Banner */}
          <div className="rounded-3xl border border-surface-line bg-slate-950 p-6 text-white shadow-md sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md ring-1 ring-white/10">
                  <ShieldCheck size={14} />
                  Administrator Portal
                </span>
                <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Platform Control &amp; Verification Center
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  Real-time system stats, mentor verification queue, and user account management.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 self-start rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                Refresh Portal
              </button>
            </div>
          </div>

          {/* Real-Time Admin Platform Stats Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Clock size={20} />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/50">Pending Queue</p>
              <p className="text-2xl font-black text-ink">{stats ? stats.pending_mentors : pendingMentors.length}</p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <UserCheck size={20} />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/50">Verified Mentors</p>
              <p className="text-2xl font-black text-ink">{stats ? stats.verified_mentors : allMentors.length}</p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Users size={20} />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/50">Registered Mentees</p>
              <p className="text-2xl font-black text-ink">{stats ? stats.total_mentees : allMentees.length}</p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                <CalendarDays size={20} />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/50">Total Requests</p>
              <p className="text-2xl font-black text-ink">{stats ? stats.total_requests : 0}</p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <FileText size={20} />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/50">Session Notes</p>
              <p className="text-2xl font-black text-ink">{stats ? stats.total_session_notes : 0}</p>
            </div>

            <div className="rounded-2xl border border-surface-line bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                <Sparkles size={20} />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/50">System Users</p>
              <p className="text-2xl font-black text-ink">{stats ? stats.total_users : allMentors.length + allMentees.length + 1}</p>
            </div>
          </div>

          {/* Notifications */}
          {actionSuccess && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
              <UserCheck size={18} className="shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-50 p-4 text-sm font-semibold text-red-800">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Admin Navigation Tabs */}
          <div className="flex border-b border-surface-line space-x-4">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-bold transition-all ${
                activeTab === "pending"
                  ? "border-slate-950 text-slate-950"
                  : "border-transparent text-ink/50 hover:text-ink"
              }`}
            >
              <Clock size={16} />
              Verification Queue ({pendingMentors.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("mentors")}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-bold transition-all ${
                activeTab === "mentors"
                  ? "border-slate-950 text-slate-950"
                  : "border-transparent text-ink/50 hover:text-ink"
              }`}
            >
              <UserCheck size={16} />
              All Mentors Roster ({allMentors.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("mentees")}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-bold transition-all ${
                activeTab === "mentees"
                  ? "border-slate-950 text-slate-950"
                  : "border-transparent text-ink/50 hover:text-ink"
              }`}
            >
              <Users size={16} />
              Registered Mentees ({allMentees.length})
            </button>
          </div>

          {/* Tab Content 1: Pending Queue */}
          {activeTab === "pending" && (
            <div className="rounded-3xl border border-surface-line bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-surface-line">
                <h2 className="text-lg font-bold text-ink">Pending Verification Queue</h2>
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {pendingMentors.length} Awaiting Approval
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-ink/40">
                  <RefreshCw size={28} className="animate-spin" />
                  <p className="mt-3 text-sm font-medium">Fetching verification queue...</p>
                </div>
              ) : pendingMentors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <UserCheck size={32} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink">Queue is Completely Clear</h3>
                  <p className="mt-1 max-w-sm text-sm text-ink/60">
                    There are no pending mentor applications awaiting verification right now.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  {pendingMentors.map((m) => {
                    const profile = m.profile;
                    const name = profile?.full_name || m.email;
                    const role = profile?.job_title || "Senior Professional";
                    const company = profile?.company || "Independent";
                    const exp = profile?.years_of_experience || 3;
                    const bio = profile?.bio || "No bio provided.";
                    const tags = profile?.expertise_tags
                      ? profile.expertise_tags.split(",").map((s) => s.trim())
                      : ["Software Engineering"];

                    return (
                      <div
                        key={m.id}
                        className="flex flex-col gap-6 rounded-2xl border border-surface-line bg-surface/30 p-6 transition-all hover:bg-surface/60 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="flex gap-4">
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt={name}
                              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-900/10"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-black text-white">
                              {name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-extrabold text-ink">{name}</h3>
                              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                                Pending Review
                              </span>
                            </div>

                            <p className="text-sm font-semibold text-ink/70">
                              {role} @ {company} &middot; <span className="text-ink">{exp} yrs exp</span>
                            </p>

                            <p className="text-xs text-ink/50">{m.email}</p>

                            <p className="pt-2 text-sm text-ink/80 max-w-xl line-clamp-2">{bio}</p>

                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-lg border border-surface-line bg-white px-2.5 py-1 text-xs font-medium text-ink/70"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {profile?.linkedin_url && (
                              <a
                                href={profile.linkedin_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 pt-2 text-xs font-semibold text-indigo-600 hover:underline"
                              >
                                LinkedIn Profile <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                          <button
                            type="button"
                            onClick={() => handleApprove(m.id, name)}
                            disabled={processingId === m.id}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                          >
                            <UserCheck size={16} />
                            Approve Mentor
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReject(m.id, name)}
                            disabled={processingId === m.id}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50"
                          >
                            <UserX size={16} />
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab Content 2: All Mentors Roster */}
          {activeTab === "mentors" && (
            <div className="rounded-3xl border border-surface-line bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-surface-line">
                <h2 className="text-lg font-bold text-ink">Verified &amp; All Mentors ({allMentors.length})</h2>
                <span className="text-xs font-medium text-ink/50">Platform Mentor Directory</span>
              </div>

              {allMentors.length === 0 ? (
                <p className="py-12 text-center text-sm text-ink/50">No mentors registered yet.</p>
              ) : (
                <div className="mt-6 divide-y divide-surface-line">
                  {allMentors.map((m) => {
                    const profile = m.profile;
                    const name = profile?.full_name || m.email;
                    const isVerified = m.verification_status === "verified";
                    return (
                      <div key={m.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt={name} className="h-12 w-12 rounded-xl object-cover" />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
                              {name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-base font-bold text-ink">{name}</p>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                  isVerified
                                    ? "bg-emerald-500/10 text-emerald-700"
                                    : "bg-amber-500/10 text-amber-700"
                                }`}
                              >
                                {m.verification_status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-ink/60">
                              {profile?.job_title || "Mentor"} {profile?.company ? `@ ${profile.company}` : ""} &middot; {m.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isVerified && (
                            <button
                              type="button"
                              onClick={() => handleApprove(m.id, name)}
                              className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(m.id, name)}
                            className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab Content 3: Registered Mentees Directory */}
          {activeTab === "mentees" && (
            <div className="rounded-3xl border border-surface-line bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-surface-line">
                <h2 className="text-lg font-bold text-ink">Registered Mentees ({allMentees.length})</h2>
                <span className="text-xs font-medium text-ink/50">Community Mentees</span>
              </div>

              {allMentees.length === 0 ? (
                <div className="py-12 text-center text-sm text-ink/50">
                  <User size={32} className="mx-auto text-ink/30" />
                  <p className="mt-2 font-medium">No mentees registered yet.</p>
                </div>
              ) : (
                <div className="mt-6 divide-y divide-surface-line">
                  {allMentees.map((mentee) => {
                    const profile = mentee.profile;
                    const name = profile?.full_name || mentee.email;
                    return (
                      <div key={mentee.id} className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-ink">{name}</p>
                            <p className="text-xs text-ink/50">{mentee.email}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(mentee.id, name)}
                          className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={13} />
                          Remove Account
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
