
import React from 'react';

interface ConnectionStatusDisplayProps {
  connectionStatus: {
    success: boolean;
    message: string;
    timestamp?: string;
    version?: string;
  } | null;
}

const ConnectionStatusDisplay = ({ connectionStatus }: ConnectionStatusDisplayProps) => {
  if (!connectionStatus) return null;

  return (
    <div className={`p-4 rounded-md border ${connectionStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <p className={connectionStatus.success ? 'text-green-800' : 'text-red-800'}>
        {connectionStatus.message}
      </p>
      {connectionStatus.success && (
        <>
          <p className="text-sm text-green-700 mt-1">
            Timestamp do servidor: {connectionStatus.timestamp}
          </p>
          {connectionStatus.version && (
            <p className="text-sm text-green-700">
              Versão MySQL: {connectionStatus.version}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectionStatusDisplay;
