import React from 'react';

interface SafetyIndicatorProps {
  safetyLevel: 'safe' | 'moderate' | 'notToSafe' | 'notSafe';
}

const SafetyIndicator: React.FC<SafetyIndicatorProps> = ({ safetyLevel }) => {
  const getSafetyColor = () => {
    switch (safetyLevel) {
      case 'safe':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-yellow-500';
      case 'notToSafe':
        return 'bg-orange-500';
      case 'notSafe':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
    <div className="w-full max-w-3xl mx-auto mb-6 p-4 rounded-lg shadow-md bg-gray-800">
      <h2 className="text-xl font-semibold mb-3 text-white">Safety Level</h2>
      <div className="flex items-center space-x-4">
        <div className={`w-16 h-16 rounded-full ${getSafetyColor()} flex items-center justify-center`}>
          <span className="text-2xl">
            {safetyLevel === 'safe' && '✓'}
            {safetyLevel === 'notSafe' && '✕'}
            {(safetyLevel === 'moderate' || safetyLevel === 'notToSafe') && '!'}
          </span>
        </div>
        <div className="flex-1">
          <div className={`text-2xl font-bold ${getSafetyColor()} bg-clip-text text-transparent`}>
            {getSafetyText()}
          </div>
          <div className="h-2 w-full bg-gray-700 rounded-full mt-2">
            <div 
              className={`h-full ${getSafetyColor()} rounded-full transition-all duration-500`}
              style={{
                width: safetyLevel === 'safe' ? '100%' : 
                       safetyLevel === 'moderate' ? '66%' : 
                       safetyLevel === 'notToSafe' ? '33%' : '0%'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyIndicator; 