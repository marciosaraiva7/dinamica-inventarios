import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useOffline } from '../contexts/OfflineContext';

export default function OfflineIndicator() {
  const { 
    isOnline, 
    pendingSync, 
    lastSync, 
    syncPendingData 
  } = useOffline();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncPendingData();
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (date) => {
    if (!date) return 'Nunca';
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days} dias atrás`;
  };

  return (
    <>
      {/* Indicador fixo no canto da tela */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant={isOnline ? "default" : "destructive"}
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="shadow-lg"
        >
          {isOnline ? (
            <Wifi className="w-4 h-4 mr-2" />
          ) : (
            <WifiOff className="w-4 h-4 mr-2" />
          )}
          {isOnline ? 'Online' : 'Offline'}
          {pendingSync.length > 0 && (
            <span className="ml-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs">
              {pendingSync.length}
            </span>
          )}
        </Button>
      </div>

      {/* Modal de detalhes */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Status da Conexão</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Status atual */}
                <div className="flex items-center gap-3">
                  {isOnline ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium">Conectado</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-700 font-medium">Desconectado</span>
                    </>
                  )}
                </div>

                {/* Última sincronização */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Última sincronização: {formatLastSync(lastSync)}</span>
                </div>

                {/* Dados pendentes */}
                {pendingSync.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        {pendingSync.length} item(s) aguardando sincronização
                      </span>
                    </div>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {pendingSync.slice(0, 3).map((item, index) => (
                        <li key={index}>
                          • {item.type} - {new Date(item.timestamp).toLocaleString('pt-BR')}
                        </li>
                      ))}
                      {pendingSync.length > 3 && (
                        <li>• ... e mais {pendingSync.length - 3} itens</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Modo offline */}
                {!isOnline && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <WifiOff className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Modo Offline Ativo
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Você pode continuar trabalhando. Os dados serão sincronizados 
                      automaticamente quando a conexão for restabelecida.
                    </p>
                  </div>
                )}

                {/* Botão de sincronização */}
                {isOnline && pendingSync.length > 0 && (
                  <Button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="w-full"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sincronizando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sincronizar Agora
                      </>
                    )}
                  </Button>
                )}

                {/* Status de sucesso */}
                {isOnline && pendingSync.length === 0 && lastSync && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Todos os dados estão sincronizados</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

