
import React from 'react';
import { ConnectionStatus } from '@/hooks/useDatabase';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ConnectionStatusDisplayProps {
  status: ConnectionStatus;
}

const ConnectionStatusDisplay = ({ status }: ConnectionStatusDisplayProps) => {
  return (
    <div className={`p-4 rounded-md border ${status.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} mt-2`}>
      <div className="flex items-start">
        {status.success ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
        )}
        <div>
          <p className={status.success ? 'text-green-800 font-medium' : 'text-red-800 font-medium'}>
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
      </div>
    </div>
  );
};

export default ConnectionStatusDisplay;
