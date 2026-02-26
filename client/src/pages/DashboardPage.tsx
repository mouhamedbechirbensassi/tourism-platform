import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard.service";
import type { DashboardResponse } from "../services/dashboard.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const [year, setYear] = useState<number>(2024);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  async function load(selectedYear: number) {
    setLoading(true);
    setError("");
    try {
      const response = await getDashboard(selectedYear);
      setData(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(year);
  }, [year]);

  return (
    <div className={styles.page}>
      {/* IMPORTANT: This wrapper is what makes 80% width work */}
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>KPIs and monthly revenue overview.</p>
          </div>

          <div className={styles.yearPicker}>
            <label className={styles.label}>
              Select Year
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className={styles.select}
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </label>
          </div>
        </header>

        {loading && <p className={styles.muted}>Loading...</p>}

        {error && (
          <div className={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {data && (
          <>
            <section className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={styles.kpiLabel}>Total Hotels</div>
                <div className={styles.kpiValue}>{data.totalHotels}</div>
              </div>

              <div className={styles.kpiCard}>
                <div className={styles.kpiLabel}>Total Clients</div>
                <div className={styles.kpiValue}>{data.totalClients}</div>
              </div>

              <div className={styles.kpiCard}>
                <div className={styles.kpiLabel}>Total Bookings</div>
                <div className={styles.kpiValue}>{data.totalBookings}</div>
              </div>

              <div className={styles.kpiCard}>
                <div className={styles.kpiLabel}>Total Revenue</div>
                <div className={styles.kpiValue}>{data.totalRevenue} €</div>
              </div>
            </section>

            <section className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h2 className={styles.sectionTitle}>Monthly Revenue</h2>
                <span className={styles.badge}>{year}</span>
              </div>

              <div className={styles.chartWrap}>
                <ResponsiveContainer>
                  <LineChart data={data.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}