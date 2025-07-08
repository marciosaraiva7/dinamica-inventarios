import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Package, 
  Search, 
  Filter, 
  Calendar,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    // Carregar itens do localStorage
    const items = JSON.parse(localStorage.getItem('inventoryItems') || '[]');
    setInventoryItems(items);
  }, []);

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.barcode.includes(searchTerm) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterState === 'all' || item.physicalState === filterState;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalItems: inventoryItems.length,
    totalQuantity: inventoryItems.reduce((sum, item) => sum + (item.quantity * item.multiplier), 0),
    locations: [...new Set(inventoryItems.map(item => item.location))].length,
    manufacturers: [...new Set(inventoryItems.map(item => item.manufacturer))].length
  };

  const physicalStateColors = {
    novo: 'bg-green-100 text-green-800',
    usado: 'bg-blue-100 text-blue-800',
    danificado: 'bg-red-100 text-red-800',
    obsoleto: 'bg-gray-100 text-gray-800'
  };

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Dinâmica</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <nav className="mt-6">
        <div className="px-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.company}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1 px-3">
          <Link
            to="/dashboard"
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/inventory/new"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            <Plus className="w-5 h-5 mr-3" />
            Novo Item
          </Link>
          <Link
            to="/inventory"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            <Package className="w-5 h-5 mr-3" />
            Inventário
          </Link>
          <Link
            to="/schedule"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            <Calendar className="w-5 h-5 mr-3" />
            Agendamentos
          </Link>
          <Link
            to="/clients"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            <Users className="w-5 h-5 mr-3" />
            Clientes
          </Link>
        </div>

        <div className="absolute bottom-0 w-full p-3">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link to="/inventory/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Item
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Package className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Itens</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Quantidade Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalQuantity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Locais</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.locations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Fabricantes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.manufacturers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de itens */}
          <Card>
            <CardHeader>
              <CardTitle>Itens Recentes</CardTitle>
              <CardDescription>
                Últimos itens adicionados ao inventário
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por descrição, código ou local..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="all">Todos os estados</option>
                    <option value="novo">Novo</option>
                    <option value="usado">Usado</option>
                    <option value="danificado">Danificado</option>
                    <option value="obsoleto">Obsoleto</option>
                  </select>
                </div>
              </div>

              {/* Lista de itens */}
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {inventoryItems.length === 0 ? 'Nenhum item encontrado' : 'Nenhum item corresponde aos filtros'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {inventoryItems.length === 0 
                      ? 'Comece adicionando seu primeiro item ao inventário'
                      : 'Tente ajustar os filtros de busca'
                    }
                  </p>
                  {inventoryItems.length === 0 && (
                    <Button asChild>
                      <Link to="/inventory/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Primeiro Item
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.slice(0, 10).map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{item.description}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${physicalStateColors[item.physicalState]}`}>
                              {item.physicalState}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Código:</span> {item.barcode}
                            </div>
                            <div>
                              <span className="font-medium">Quantidade:</span> {item.quantity * item.multiplier} {item.unit}
                            </div>
                            <div>
                              <span className="font-medium">Local:</span> {item.location}
                            </div>
                            <div>
                              <span className="font-medium">Fabricante:</span> {item.manufacturer}
                            </div>
                          </div>
                        </div>
                        {item.photos && item.photos.length > 0 && (
                          <div className="ml-4">
                            <img
                              src={item.photos[0].url}
                              alt={item.description}
                              className="w-16 h-16 object-cover rounded-md border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

