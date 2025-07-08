import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const OfflineContext = createContext();

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline deve ser usado dentro de um OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }) => {
  const isOnline = useOnlineStatus();
  const [pendingSync, setPendingSync] = useState([]);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    // Carregar dados pendentes de sincronização
    const pending = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    setPendingSync(pending);
    
    const lastSyncTime = localStorage.getItem('lastSync');
    if (lastSyncTime) {
      setLastSync(new Date(lastSyncTime));
    }
  }, []);

  useEffect(() => {
    // Quando voltar online, tentar sincronizar dados pendentes
    if (isOnline && pendingSync.length > 0) {
      syncPendingData();
    }
  }, [isOnline, pendingSync]);

  const addToPendingSync = (data) => {
    const newPending = [...pendingSync, {
      id: Date.now(),
      data,
      timestamp: new Date().toISOString(),
      type: data.type || 'unknown'
    }];
    
    setPendingSync(newPending);
    localStorage.setItem('pendingSync', JSON.stringify(newPending));
  };

  const syncPendingData = async () => {
    try {
      // Simular sincronização com servidor
      // Em produção, aqui seria feita a chamada para API
      console.log('Sincronizando dados pendentes...', pendingSync);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Limpar dados pendentes após sincronização bem-sucedida
      setPendingSync([]);
      localStorage.removeItem('pendingSync');
      
      const now = new Date();
      setLastSync(now);
      localStorage.setItem('lastSync', now.toISOString());
      
      return { success: true, message: 'Dados sincronizados com sucesso' };
    } catch (error) {
      console.error('Erro na sincronização:', error);
      return { success: false, error: 'Erro ao sincronizar dados' };
    }
  };

  const saveOfflineData = (key, data) => {
    // Salvar dados localmente
    localStorage.setItem(key, JSON.stringify(data));
    
    // Se offline, adicionar à lista de sincronização pendente
    if (!isOnline) {
      addToPendingSync({
        type: 'save',
        key,
        data,
        action: 'create_or_update'
      });
    }
  };

  const getOfflineData = (key, defaultValue = []) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Erro ao carregar dados offline:', error);
      return defaultValue;
    }
  };

  const clearOfflineData = (key) => {
    localStorage.removeItem(key);
    
    if (!isOnline) {
      addToPendingSync({
        type: 'delete',
        key,
        action: 'delete'
      });
    }
  };

  const value = {
    isOnline,
    pendingSync,
    lastSync,
    addToPendingSync,
    syncPendingData,
    saveOfflineData,
    getOfflineData,
    clearOfflineData
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

