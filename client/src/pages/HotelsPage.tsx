import { useEffect, useMemo, useState } from "react";
import { createHotel, deleteHotel, getHotels, updateHotel } from "../services/hotels.service";
import type { Hotel } from "../services/hotels.service";

import styles from "./HotelsPage.module.css";

type CreateFormState = {
  name: string;
  city: string;
  stars: number;
};

type EditState = {
  id: string;
  name: string;
  city: string;
  stars: number;
};

type ToastKind = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  kind: ToastKind;
};

function Card(props: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{props.title}</h2>
        {props.right}
      </div>
      {props.children}
    </section>
  );
}

function Badge(props: { children: React.ReactNode }) {
  return <span className={styles.badge}>{props.children}</span>;
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState<CreateFormState>({ name: "", city: "", stars: 5 });
  const [submitting, setSubmitting] = useState(false);

  const [editing, setEditing] = useState<EditState | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [toast, setToast] = useState<Toast | null>(null);

  const totalHotels = useMemo(() => hotels.length, [hotels]);

  function showToast(message: string, kind: ToastKind = "success") {
    const id = crypto.randomUUID?.() ?? String(Date.now());
    setToast({ id, message, kind });

    window.setTimeout(() => {
      setToast((t) => (t?.id === id ? null : t));
    }, 2500);
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getHotels();
      setHotels(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load hotels";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const city = form.city.trim();
    const stars = Number(form.stars);

    if (!name || !city) {
      setError("Name and city are required.");
      showToast("Name and city are required.", "error");
      return;
    }
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      setError("Stars must be an integer between 1 and 5.");
      showToast("Stars must be 1–5.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createHotel({ name, city, stars });
      setHotels((prev) => [...prev, created]);
      setForm({ name: "", city: "", stars: 5 });
      showToast("New hotel added ", "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create hotel";
      setError(msg);
      showToast("Failed to add hotel", "error");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(h: Hotel) {
    setEditing({ id: h.id, name: h.name, city: h.city, stars: h.stars });
    setError("");
  }

  function cancelEdit() {
    setEditing(null);
    setError("");
  }

  async function saveEdit() {
    if (!editing) return;

    const name = editing.name.trim();
    const city = editing.city.trim();
    const stars = Number(editing.stars);

    if (!name || !city) {
      setError("Name and city are required.");
      showToast("Name and city are required.", "error");
      return;
    }
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      setError("Stars must be an integer between 1 and 5.");
      showToast("Stars must be 1–5.", "error");
      return;
    }

    setSavingEdit(true);
    setError("");
    try {
      const updated = await updateHotel(editing.id, { name, city, stars });
      setHotels((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
      setEditing(null);
      showToast("Hotel updated ", "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update hotel";
      setError(msg);
      showToast("Failed to update hotel", "error");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    try {
      await deleteHotel(id);
      setHotels((prev) => prev.filter((h) => h.id !== id));
      if (editing?.id === id) setEditing(null);
      showToast("Hotel deleted 🗑️", "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete hotel";
      setError(msg);
      showToast("Failed to delete hotel", "error");
    }
  }

  return (
    <div className={styles.page}>
      {/* Toast */}
      {toast && (
        <div
          className={[
            styles.toast,
            toast.kind === "success" ? styles.toastSuccess : toast.kind === "error" ? styles.toastError : styles.toastInfo,
          ].join(" ")}
          role="status"
        >
          <span className={styles.toastText}>{toast.message}</span>
          <button className={styles.toastClose} onClick={() => setToast(null)} aria-label="Close notification">
            ×
          </button>
        </div>
      )}

      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Hotels</h1>
            <p className={styles.subtitle}>Manage hotels: create, edit, and delete.</p>
          </div>

          <div className={styles.headerRight}>
            <Badge>Total: {totalHotels}</Badge>
            <button className={styles.btn} onClick={load}>
              Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className={styles.grid}>
          <Card title="Create hotel">
            <form onSubmit={handleCreate} className={styles.form}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Hotel name"
                  className={styles.input}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>City</span>
                <input
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="City"
                  className={styles.input}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Stars (1–5)</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.stars}
                  onChange={(e) => setForm((p) => ({ ...p, stars: Number(e.target.value) }))}
                  className={styles.input}
                />
              </label>

              <button type="submit" disabled={submitting} className={[styles.btn, styles.btnPrimary].join(" ")}>
                {submitting ? "Creating..." : "Create"}
              </button>
            </form>
          </Card>

          <Card
            title="Hotel list"
            right={<Badge>{loading ? "Loading…" : `${hotels.length} item${hotels.length === 1 ? "" : "s"}`}</Badge>}
          >
            {loading ? (
              <p className={styles.muted}>Loading...</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHeadRow}>
                      <th className={styles.th}>ID</th>
                      <th className={styles.th}>Name</th>
                      <th className={styles.th}>City</th>
                      <th className={styles.th}>Stars</th>
                      <th className={styles.th}>Created</th>
                      <th className={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotels.map((h) => {
                      const isEditing = editing?.id === h.id;

                      return (
                        <tr key={h.id} className={styles.tr}>
                          <td className={styles.tdNowrap}>{h.id}</td>

                          <td className={styles.td}>
                            {isEditing ? (
                              <input
                                value={editing?.name ?? ""}
                                onChange={(e) => setEditing((p) => (p ? { ...p, name: e.target.value } : p))}
                                className={styles.inputInline}
                              />
                            ) : (
                              h.name
                            )}
                          </td>

                          <td className={styles.td}>
                            {isEditing ? (
                              <input
                                value={editing?.city ?? ""}
                                onChange={(e) => setEditing((p) => (p ? { ...p, city: e.target.value } : p))}
                                className={styles.inputInline}
                              />
                            ) : (
                              h.city
                            )}
                          </td>

                          <td className={styles.td}>
                            {isEditing ? (
                              <input
                                type="number"
                                min={1}
                                max={5}
                                value={editing?.stars ?? 1}
                                onChange={(e) => setEditing((p) => (p ? { ...p, stars: Number(e.target.value) } : p))}
                                className={styles.inputInlineSmall}
                              />
                            ) : (
                              <Badge>{h.stars} ★</Badge>
                            )}
                          </td>

                          <td className={styles.tdNowrap}>{h.createdAt}</td>

                          <td className={styles.tdNowrap}>
                            {isEditing ? (
                              <div className={styles.actions}>
                                <button
                                  onClick={saveEdit}
                                  
                                  disabled={savingEdit}
                                  className={[styles.btnSm, styles.btnPrimary].join(" ")}
                                >apply
                                    
                                  
                                </button>
                                <button onClick={cancelEdit} className={styles.btnSm}>
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className={styles.actions}>
                                <button onClick={() => startEdit(h)} className={styles.btnSm}>
                                  Edit
                                </button>
                                <button onClick={() => handleDelete(h.id)} className={[styles.btnSm, styles.btnDanger].join(" ")}>
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {hotels.length === 0 && (
                      <tr>
                        <td colSpan={6} className={styles.empty}>
                          No hotels found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}