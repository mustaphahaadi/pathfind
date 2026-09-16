import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, UserCheck, UserX, Clock, ExternalLink, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { api } from "../lib/api";
import type { UserOut } from "../types/api";

export default function AdminDashboardPage() {
  const [pendingMentors, setPendingMentors] = useState<UserOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchPendingMentors = useCallback(() => {
    api.admin
      .listPendingMentors()
      .then(setPendingMentors)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load pending mentors.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPendingMentors();
  }, [fetchPendingMentors]);

  const handleRefresh = () => {
    setLoading(true);
    fetchPendingMentors();
  };

  const handleApprove = async (mentorId: number, mentorName: string) => {
    setProcessingId(mentorId);
    setActionSuccess(null);
    try {
      await api.admin.approveMentor(mentorId);
      setPendingMentors((prev) => prev.filter((m) => m.id !== mentorId));
      setActionSuccess(`Successfully approved mentor application for ${mentorName}.`);
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
      setPendingMentors((prev) => prev.filter((m) => m.id !== mentorId));
      setActionSuccess(`Mentor application for ${mentorName} has been rejected.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject mentor.");
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
                  Mentor Verification Queue
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  Review and verify senior industry professionals applying to volunteer on Pathfind.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 self-start rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                Refresh Queue
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-surface-line bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink/50 uppercase tracking-wide">Pending Queue</p>
                <p className="text-2xl font-black text-ink">{pendingMentors.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-surface-line bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink/50 uppercase tracking-wide">System Status</p>
                <p className="text-base font-extrabold text-emerald-600">Verification Active</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-surface-line bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink/50 uppercase tracking-wide">Auto Notifications</p>
                <p className="text-base font-extrabold text-indigo-600">Email Dispatch Enabled</p>
              </div>
            </div>
          </div>

          {/* Action Notifications */}
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

          {/* Applications List */}
          <div className="rounded-3xl border border-surface-line bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-surface-line">
              <h2 className="text-lg font-bold text-ink">Pending Applications ({pendingMentors.length})</h2>
              <span className="text-xs font-medium text-ink/50">Requires Admin Action</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-ink/40">
                <RefreshCw size={28} className="animate-spin" />
                <p className="mt-3 text-sm font-medium">Fetching pending mentor verification queue...</p>
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
                  const company = profile?.company || "Tech Enterprise";
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
