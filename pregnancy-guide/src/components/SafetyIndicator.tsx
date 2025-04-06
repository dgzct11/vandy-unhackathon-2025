import React from 'react';

interface SafetyIndicatorProps {
  safetyLevel: 'safe' | 'moderate' | 'notToSafe' | 'notSafe';
}

const SafetyIndicator: React.FC<SafetyIndicatorProps> = ({ safetyLevel }) => {
  const getStyles = () => {
    switch (safetyLevel) {
      case 'safe':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          dot: 'bg-[#4ADE80]'
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          dot: 'bg-[#FBBF24]'
        };
      case 'notToSafe':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          dot: 'bg-[#FB923C]'
        };
      case 'notSafe':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          dot: 'bg-[#EF4444]'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          dot: 'bg-gray-400'
        };
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

  const styles = getStyles();

  return (
    <div className={`flex items-center px-3 py-2 ${styles.bg} border ${styles.border} rounded-lg`}>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${styles.dot}`}></div>
        <span className={`font-large text-lg  ${styles.text}`}>{getSafetyText()}</span>
      </div>
    </div>
  );
};

export default SafetyIndicator; 