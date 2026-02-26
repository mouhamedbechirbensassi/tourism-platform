import { useState } from "react";
import HotelsPage from "./pages/HotelsPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

type Page = "hotels" | "dashboard";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <div className="app">
      <header className="appHeader">
        <div className="appHeaderInner">
          <div className="appHeaderLeft">
            <img className="appHeaderImg" src="/header.jpg" alt="Header" />

            <nav className="appNav">
              <button
                className={`appNavBtn ${page === "hotels" ? "isActive" : ""}`}
                onClick={() => setPage("hotels")}
                type="button"
              >
                Hotels
              </button>

              <button
                className={`appNavBtn ${page === "dashboard" ? "isActive" : ""}`}
                onClick={() => setPage("dashboard")}
                type="button"
              >
                Dashboard
              </button>
            </nav>
          </div>

          {/* Optional right side (leave empty for now, keeps structure clean) */}
          <div className="appHeaderRight" />
        </div>
      </header>

      <main className="appMain">
        <div className="appContainer">
          {page === "dashboard" && <DashboardPage />}
          {page === "hotels" && <HotelsPage />}
        </div>
      </main>
    </div>
  );
}