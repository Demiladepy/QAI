"use client";

import { useStore } from "@/store";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useEffect } from "react";

/**
 * Wraps ChatInterface for the DAO page.
 * Sets mode to "dao" and passes the selected DAO ID.
 */
export function DAOChatWrapper() {
  const { selectedDAO, setMode } = useStore();

  // Ensure DAO mode is active on this page
  useEffect(() => {
    setMode("dao");
    return () => setMode("consumer"); // Restore on unmount
  }, [setMode]);

  return (
    <div>
      <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-tertiary)" }}>
        Ask the Governance Agent
      </p>
      <ChatInterface
        daoId={selectedDAO?.id}
        placeholder={
          selectedDAO
            ? `Ask about ${selectedDAO.name} governance...`
            : "Select a DAO first..."
        }
      />
    </div>
  );
}
