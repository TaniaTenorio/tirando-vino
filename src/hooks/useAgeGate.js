"use client";

import React from "react";

const AGE_GATE_STORAGE_KEY = "tv-age-gate-status";
const AGE_GATE_ENDPOINT = "/api/age-gate";
const AGE_RESTRICTED_PATH = "/age-restricted";
const isAllowedAgeGateStatus = (status) =>
  status === "accepted" || status === "rejected";

/**
 * Manages age-gate status: loads the current state from the API (with a
 * localStorage fallback) and exposes handlers to accept or reject.
 *
 * Returns:
 *   - ageGateStatus: "pending" | "unknown" | "accepted" | "rejected"
 *   - handleAgeAccepted: () => void
 *   - handleAgeRejected: () => void
 */
export function useAgeGate() {
  const [ageGateStatus, setAgeGateStatus] = React.useState("pending");

  // Load status on mount: API first, localStorage as fallback.
  React.useEffect(() => {
    const loadAgeGateStatus = async () => {
      try {
        const response = await fetch(AGE_GATE_ENDPOINT, {
          method: "GET",
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();

          if (data.status === "accepted" || data.status === "rejected") {
            try {
              window.localStorage.setItem(AGE_GATE_STORAGE_KEY, data.status);
            } catch {
              // Ignore local storage write failures.
            }

            setAgeGateStatus(data.status);

            if (data.status === "rejected") {
              window.location.replace(AGE_RESTRICTED_PATH);
            }

            return;
          }

          if (data.status === "unknown") {
            try {
              window.localStorage.removeItem(AGE_GATE_STORAGE_KEY);
            } catch {
              // Ignore local storage write failures.
            }

            setAgeGateStatus("unknown");
            return;
          }
        }
      } catch {
        // Continue to local fallback when API is unavailable.
      }

      try {
        const savedStatus = window.localStorage.getItem(AGE_GATE_STORAGE_KEY);

        if (savedStatus === "accepted" || savedStatus === "rejected") {
          setAgeGateStatus(savedStatus);

          if (savedStatus === "rejected") {
            window.location.replace(AGE_RESTRICTED_PATH);
          }

          return;
        }
      } catch {
        // If storage access fails, keep unknown and ask again.
      }

      setAgeGateStatus("unknown");
    };

    void loadAgeGateStatus();
  }, []);

  const persistAgeGateAnswer = async (status) => {
    if (!isAllowedAgeGateStatus(status)) {
      try {
        window.localStorage.removeItem(AGE_GATE_STORAGE_KEY);
      } catch {
        // Ignore local storage write failures.
      }

      setAgeGateStatus("unknown");
      return;
    }

    let lockedStatus = status;

    try {
      const response = await fetch(AGE_GATE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const data = await response.json();

        if (isAllowedAgeGateStatus(data?.status)) {
          lockedStatus = data.status;
        }
      }
    } catch {
      // Ignore API failures and still enforce current session state.
    }

    try {
      window.localStorage.setItem(AGE_GATE_STORAGE_KEY, lockedStatus);
    } catch {
      // Ignore write failures and still enforce current session state.
    }

    setAgeGateStatus(lockedStatus);

    if (lockedStatus === "rejected") {
      window.location.replace(AGE_RESTRICTED_PATH);
    }
  };

  const handleAgeAccepted = () => {
    void persistAgeGateAnswer("accepted");
  };

  const handleAgeRejected = () => {
    void persistAgeGateAnswer("rejected");
  };

  return { ageGateStatus, handleAgeAccepted, handleAgeRejected };
}
