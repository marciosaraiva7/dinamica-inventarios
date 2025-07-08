import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Camera, 
  QrCode, 
  Save, 
  Plus, 
  Trash2, 
  Upload,
  Package,
  MapPin,
  Building,
  Info
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const inventorySchema = z.object({
  barcode: z.string().min(1, 'Código de barras é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
  multiplier: z.number().min(1, 'Multiplicador deve ser maior que 0').default(1),
  location: z.string().min(1, 'Local é obrigatório'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  manufacturer: z.string().min(1, 'Fabricante é obrigatório'),
  physicalState: z.enum(['novo', 'usado', 'danificado', 'obsoleto'], {
    required_error: 'Estado físico é obrigatório'
  }),
  // Campos opcionais
  serialNumber: z.string().optional(),
  size: z.string().optional(),
  observations: z.string().optional(),
});

const physicalStateOptions = [
  { value: 'novo', label: 'Novo' },
  { value: 'usado', label: 'Usado' },
  { value: 'danificado', label: 'Danificado' },
  { value: 'obsoleto', label: 'Obsoleto' }
];

const unitOptions = [
  'Unidade', 'Peça', 'Metro', 'Quilograma', 'Litro', 'Caixa', 'Pacote', 'Par'
];

export default function InventoryForm() {
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      multiplier: 1,
      quantity: 1
    }
  });

  const watchedQuantity = watch('quantity');
  const watchedMultiplier = watch('multiplier');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simular salvamento - em produção seria uma chamada para API
      const inventoryItem = {
        ...data,
        photos,
        totalQuantity: data.quantity * data.multiplier,
        createdAt: new Date().toISOString(),
        id: Date.now()
      };
      
      // Salvar no localStorage para demonstração
      const existingItems = JSON.parse(localStorage.getItem('inventoryItems') || '[]');
      existingItems.push(inventoryItem);
      localStorage.setItem('inventoryItems', JSON.stringify(existingItems));
      
      alert('Item salvo com sucesso!');
      reset();
      setPhotos([]);
    } catch (error) {
      alert('Erro ao salvar item. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const scanBarcode = () => {
    // Simular leitura de código de barras
    const mockBarcode = Math.random().toString().substr(2, 13);
    setValue('barcode', mockBarcode);
    alert(`Código de barras simulado: ${mockBarcode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Novo Item de Inventário</h1>
          <p className="text-gray-600">Preencha os dados do item para adicionar ao inventário</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Código de Barras */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Identificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="barcode">Código de Barras *</Label>
                  <Input
                    id="barcode"
                    {...register('barcode')}
                    placeholder="Digite ou escaneie o código"
                    className={errors.barcode ? 'border-red-500' : ''}
                  />
                  {errors.barcode && (
                    <p className="text-sm text-red-500 mt-1">{errors.barcode.message}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={scanBarcode}
                  className="mt-6"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  {...register('description')}
                  placeholder="Descrição detalhada do item"
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quantidade e Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Quantidade e Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    {...register('quantity', { valueAsNumber: true })}
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="multiplier">Multiplicador *</Label>
                  <Input
                    id="multiplier"
                    type="number"
                    min="1"
                    {...register('multiplier', { valueAsNumber: true })}
                    className={errors.multiplier ? 'border-red-500' : ''}
                  />
                  {errors.multiplier && (
                    <p className="text-sm text-red-500 mt-1">{errors.multiplier.message}</p>
                  )}
                </div>
              </div>

              {(watchedQuantity && watchedMultiplier) && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Total no servidor:</strong> {watchedQuantity * watchedMultiplier} unidades
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unidade *</Label>
                  <select
                    id="unit"
                    {...register('unit')}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.unit ? 'border-red-500' : ''}`}
                  >
                    <option value="">Selecione a unidade</option>
                    {unitOptions.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-sm text-red-500 mt-1">{errors.unit.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Local *</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="Ex: Sala 101, Estoque A"
                    className={errors.location ? 'border-red-500' : ''}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Produto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informações do Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="manufacturer">Fabricante *</Label>
                <Input
                  id="manufacturer"
                  {...register('manufacturer')}
                  placeholder="Nome do fabricante"
                  className={errors.manufacturer ? 'border-red-500' : ''}
                />
                {errors.manufacturer && (
                  <p className="text-sm text-red-500 mt-1">{errors.manufacturer.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="physicalState">Estado Físico *</Label>
                <select
                  id="physicalState"
                  {...register('physicalState')}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.physicalState ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecione o estado</option>
                  {physicalStateOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.physicalState && (
                  <p className="text-sm text-red-500 mt-1">{errors.physicalState.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Campos Opcionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Informações Adicionais (Opcional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serialNumber">Número de Série</Label>
                  <Input
                    id="serialNumber"
                    {...register('serialNumber')}
                    placeholder="Número de série"
                  />
                </div>

                <div>
                  <Label htmlFor="size">Tamanho</Label>
                  <Input
                    id="size"
                    {...register('size')}
                    placeholder="Ex: 10x20cm, Grande"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observations">Observações</Label>
                <textarea
                  id="observations"
                  {...register('observations')}
                  placeholder="Observações adicionais sobre o item"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Fotos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Fotos do Item
              </CardTitle>
              <CardDescription>
                Adicione fotos para melhor identificação do item
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Carregar Foto
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Tirar Foto
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {photos.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-32 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 h-6 w-6"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Salvando...' : 'Salvar Item'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setPhotos([]);
              }}
            >
              Limpar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

