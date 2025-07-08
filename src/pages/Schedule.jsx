import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  FileText, 
  Save,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const scheduleSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  location: z.string().min(1, 'Local é obrigatório'),
  estimatedDuration: z.number().min(1, 'Duração estimada é obrigatória'),
  priority: z.enum(['baixa', 'media', 'alta'], {
    required_error: 'Prioridade é obrigatória'
  }),
  status: z.enum(['agendado', 'em_andamento', 'concluido', 'cancelado']).default('agendado')
});

const priorityColors = {
  baixa: 'bg-green-100 text-green-800',
  media: 'bg-yellow-100 text-yellow-800',
  alta: 'bg-red-100 text-red-800'
};

const statusColors = {
  agendado: 'bg-blue-100 text-blue-800',
  em_andamento: 'bg-orange-100 text-orange-800',
  concluido: 'bg-green-100 text-green-800',
  cancelado: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  agendado: 'Agendado',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado'
};

export default function Schedule() {
  const [searchParams] = useSearchParams();
  const [schedules, setSchedules] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(scheduleSchema)
  });

  useEffect(() => {
    // Carregar dados do localStorage
    const savedSchedules = JSON.parse(localStorage.getItem('schedules') || '[]');
    const savedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    setSchedules(savedSchedules);
    setClients(savedClients);

    // Se há um cliente pré-selecionado na URL
    const clientId = searchParams.get('client');
    if (clientId) {
      setValue('clientId', clientId);
      setShowForm(true);
    }
  }, [searchParams, setValue]);

  const onSubmit = (data) => {
    const schedule = {
      id: editingSchedule?.id || Date.now(),
      ...data,
      estimatedDuration: Number(data.estimatedDuration),
      createdAt: editingSchedule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedSchedules;
    if (editingSchedule) {
      updatedSchedules = schedules.map(s => s.id === editingSchedule.id ? schedule : s);
    } else {
      updatedSchedules = [...schedules, schedule];
    }

    setSchedules(updatedSchedules);
    localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
    
    reset();
    setShowForm(false);
    setEditingSchedule(null);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    Object.keys(schedule).forEach(key => {
      setValue(key, schedule[key]);
    });
    setShowForm(true);
  };

  const handleDelete = (scheduleId) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      const updatedSchedules = schedules.filter(s => s.id !== scheduleId);
      setSchedules(updatedSchedules);
      localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
    }
  };

  const updateStatus = (scheduleId, newStatus) => {
    const updatedSchedules = schedules.map(s => 
      s.id === scheduleId 
        ? { ...s, status: newStatus, updatedAt: new Date().toISOString() }
        : s
    );
    setSchedules(updatedSchedules);
    localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === parseInt(clientId));
    return client ? `${client.name} (${client.company})` : 'Cliente não encontrado';
  };

  const upcomingSchedules = schedules
    .filter(s => s.status === 'agendado')
    .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Agendamentos</h1>
            <p className="text-gray-600">Gerencie os agendamentos de inventários</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Agendados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {schedules.filter(s => s.status === 'agendado').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {schedules.filter(s => s.status === 'em_andamento').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Concluídos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {schedules.filter(s => s.status === 'concluido').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulário */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}
              </CardTitle>
              <CardDescription>
                {editingSchedule ? 'Atualize as informações do agendamento' : 'Agende um novo inventário'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientId">Cliente *</Label>
                    <select
                      id="clientId"
                      {...register('clientId')}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.clientId ? 'border-red-500' : ''}`}
                    >
                      <option value="">Selecione um cliente</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name} ({client.company})
                        </option>
                      ))}
                    </select>
                    {errors.clientId && (
                      <p className="text-sm text-red-500 mt-1">{errors.clientId.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="Ex: Inventário Anual 2024"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      {...register('date')}
                      className={errors.date ? 'border-red-500' : ''}
                    />
                    {errors.date && (
                      <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="time">Horário *</Label>
                    <Input
                      id="time"
                      type="time"
                      {...register('time')}
                      className={errors.time ? 'border-red-500' : ''}
                    />
                    {errors.time && (
                      <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location">Local *</Label>
                    <Input
                      id="location"
                      {...register('location')}
                      placeholder="Endereço ou local do inventário"
                      className={errors.location ? 'border-red-500' : ''}
                    />
                    {errors.location && (
                      <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="estimatedDuration">Duração Estimada (horas) *</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      min="1"
                      step="0.5"
                      {...register('estimatedDuration', { valueAsNumber: true })}
                      className={errors.estimatedDuration ? 'border-red-500' : ''}
                    />
                    {errors.estimatedDuration && (
                      <p className="text-sm text-red-500 mt-1">{errors.estimatedDuration.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="priority">Prioridade *</Label>
                    <select
                      id="priority"
                      {...register('priority')}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.priority ? 'border-red-500' : ''}`}
                    >
                      <option value="">Selecione a prioridade</option>
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                    {errors.priority && (
                      <p className="text-sm text-red-500 mt-1">{errors.priority.message}</p>
                    )}
                  </div>

                  {editingSchedule && (
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        {...register('status')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="agendado">Agendado</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <textarea
                    id="description"
                    {...register('description')}
                    placeholder="Detalhes adicionais sobre o inventário"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingSchedule ? 'Atualizar' : 'Salvar'} Agendamento
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingSchedule(null);
                      reset();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Agendamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>
              Agendamentos ordenados por data e horário
            </CardDescription>
          </CardHeader>
          <CardContent>
            {schedules.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum agendamento encontrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Comece criando seu primeiro agendamento de inventário
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Agendamento
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900">{schedule.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[schedule.status]}`}>
                            {statusLabels[schedule.status]}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[schedule.priority]}`}>
                            {schedule.priority}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {getClientName(schedule.clientId)}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(schedule.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {schedule.time} ({schedule.estimatedDuration}h)
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {schedule.location}
                          </div>
                        </div>

                        {schedule.description && (
                          <p className="text-sm text-gray-600 mb-3">{schedule.description}</p>
                        )}

                        <div className="flex gap-2">
                          {schedule.status === 'agendado' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(schedule.id, 'em_andamento')}
                            >
                              Iniciar
                            </Button>
                          )}
                          {schedule.status === 'em_andamento' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(schedule.id, 'concluido')}
                            >
                              Concluir
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(schedule)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(schedule.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

