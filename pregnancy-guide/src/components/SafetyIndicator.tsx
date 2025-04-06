import React from 'react';

interface SafetyIndicatorProps {
  safetyLevel: 'safe' | 'moderate' | 'notToSafe' | 'notSafe';
}

const SafetyIndicator: React.FC<SafetyIndicatorProps> = ({ safetyLevel }) => {
  const getSafetyColor = () => {
    switch (safetyLevel) {
      case 'safe':
        return 'bg-[#4ADE80]'; // Green
      case 'moderate':
        return 'bg-[#FBBF24]'; // Yellow
      case 'notToSafe':
        return 'bg-[#FB923C]'; // Orange
      case 'notSafe':
        return 'bg-[#EF4444]'; // Red
      default:
        return 'bg-gray-400';
    }
  };

  const getSafetyText = () => {
    switch (safetyLevel) {
      case 'safe':
        return 'Safe';
      case 'moderate':
        return 'Moderate Risk';
      case 'notToSafe':
        return 'Not Too Safe';
      case 'notSafe':
        return 'Not Safe';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-[#F3F4FF] rounded-lg">
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 8C22 8 26 10 26 16C26 22 22 32 20 32C18 32 14 22 14 16C14 10 18 8 20 8Z" fill="#818CF8"/>
          <path d="M20 32V36M16 36H24" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div className="flex items-center gap-3">
          <span className="font-medium text-lg text-gray-900">{getSafetyText()}</span>
          <div className={`w-3 h-3 rounded-full ${getSafetyColor()}`}></div>
        </div>
      </div>
      <div className="text-sm text-gray-500 ml-auto">
        Optionally: "Copy this to ask doctor."
      </div>
    </div>
  );
};

export default SafetyIndicator; 