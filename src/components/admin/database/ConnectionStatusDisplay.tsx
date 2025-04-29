
import React from 'react';
import { ConnectionStatus } from '@/hooks/useDatabase';

interface ConnectionStatusDisplayProps {
  status: ConnectionStatus;
}

const ConnectionStatusDisplay = ({ status }: ConnectionStatusDisplayProps) => {
  return (
    <div className={`p-4 rounded-md border ${status.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <p className={status.success ? 'text-green-800' : 'text-red-800'}>
        {status.message}
      </p>
      {status.success && (
        <>
          <p className="text-sm text-green-700 mt-1">
            Timestamp do servidor: {status.timestamp}
          </p>
          {status.version && (
            <p className="text-sm text-green-700">
              Versão MySQL: {status.version}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectionStatusDisplay;
