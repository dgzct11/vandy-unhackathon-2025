import { useState, useEffect } from "react";

interface EmergencyButtonProps {
  emergencyContact: string;
}

export default function EmergencyButton({
  emergencyContact,
}: EmergencyButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isEmergencyActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isEmergencyActive && countdown === 0) {
      handleEmergency();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isEmergencyActive, countdown]);

  const handleEmergencyClick = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
    } else {
      setIsEmergencyActive(true);
      setCountdown(5);
    }
  };

  const handleEmergency = () => {
    // Call 911
    window.location.href = "tel:911";

    // Send SMS to emergency contact
    if (emergencyContact) {
      const message = encodeURIComponent(
        "EMERGENCY: I need immediate assistance. This is an automated message from MamaShield."
      );
      window.location.href = `sms:${emergencyContact}?body=${message}`;
    }

    // Reset state
    setIsEmergencyActive(false);
    setShowConfirmation(false);
    setCountdown(5);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setIsEmergencyActive(false);
    setCountdown(5);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showConfirmation && (
        <div className="absolute bottom-16 right-0 bg-white p-4 rounded-lg shadow-lg border border-red-200 w-64">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Emergency Confirmation
          </h3>
          <p className="text-gray-700 mb-4">
            Are you sure you want to trigger emergency services? This will call
            911 and send a message to your emergency contact.
          </p>
          {isEmergencyActive && (
            <div className="mb-4 text-center">
              <p className="text-red-600 font-bold">
                Calling emergency services in:
              </p>
              <p className="text-2xl font-bold text-red-600">{countdown}</p>
            </div>
          )}
          <div className="flex justify-between">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEmergencyClick}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              {isEmergencyActive ? "Calling..." : "Confirm Emergency"}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleEmergencyClick}
        className="bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center"
        aria-label="Emergency Button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </button>
    </div>
  );
}
