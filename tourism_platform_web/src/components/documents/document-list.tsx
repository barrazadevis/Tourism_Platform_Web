'use client'

import { useState, useRef, useEffect } from "react"
import { 
  Search, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  FileText, 
  File, 
  Image,
  Filter,
  Calendar,
  User,
  FolderOpen,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loading } from "@/components/shared/loading"
import { formatDate } from "@/lib/utils"
import { useApi } from "@/hooks/use-api"
import { documentService } from "@/services/documentService"
import { bookingService} from "@/services/bookingService"
import { 
  DocumentResponseDto, 
  DocumentSearchParams, 
  UploadDocumentDto,
  DocumentType,
  formatFileSize,
  getDocumentTypeText,
  getDocumentIcon
} from "@/types/document"
import { Booking } from "@/types"

interface UploadFormData {
  documentType: string
  title: string
  description: string
  bookingId: string
  customerId: string
  tags: string[]
  file: File | null
}

interface DocumentListProps {
  tenant: string
}

export function DocumentList({ tenant }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterBooking, setFilterBooking] = useState("")
  const [filterFromDate, setFilterFromDate] = useState("")
  const [filterToDate, setFilterToDate] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [page, setPage] = useState(1)
  const [dragOver, setDragOver] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [documentTypes, setDocumentTypes] = useState<string[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pageSize = 10

  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    documentType: "",
    title: "",
    description: "",
    bookingId: "",
    customerId: "",
    tags: [],
    file: null
  })

  // Build search parameters
  const searchParams: DocumentSearchParams = {
    fileName: searchTerm,
    documentType: filterType,
    bookingId: filterBooking,
    fromDate: filterFromDate,
    toDate: filterToDate,
    page,
    pageSize
  }

  const { data: documents, loading, error, refetch } = useApi<DocumentResponseDto[]>(
    () => documentService.getDocuments(searchParams),
    [searchTerm, filterType, filterBooking, filterFromDate, filterToDate, page]
  )

  // Load options when dialog opens
  useEffect(() => {
    if (showUpload && (documentTypes.length === 0 || bookings.length === 0)) {
      loadFormOptions()
    }
  }, [showUpload])

  const loadFormOptions = async () => {
    setLoadingOptions(true)
    try {
      const [docTypesData, bookingsData] = await Promise.all([
        documentService.getDocumentTypes(),
        bookingService.getBookings()
      ])
      // Filtrar datos vacíos antes de establecer en el estado
      setDocumentTypes(docTypesData.filter((type: string) => type && type.trim() !== ''))
      setBookings(bookingsData.filter((booking: { id: string }) => booking && booking.id && booking.id.trim() !== ''))
    } catch (error) {
      console.error('Error loading form options:', error)
      // Establecer arrays vacíos en caso de error
      setDocumentTypes([])
      setBookings([])
    } finally {
      setLoadingOptions(false)
    }
  }

  const getFileIcon = (mimeType: string, extension?: string) => {
    if (mimeType?.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />
    }
    if (mimeType === 'application/pdf' || extension === '.pdf') {
      return <FileText className="h-5 w-5 text-red-500" />
    }
    return <File className="h-5 w-5 text-gray-500" />
  }

  const handleFileSelect = (file: File) => {
    setUploadForm(prev => ({ 
      ...prev, 
      file,
      title: prev.title || file.name.replace(/\.[^/.]+$/, "") // Auto-generate title from filename
    }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const addTag = () => {
    if (newTag.trim() && !uploadForm.tags.includes(newTag.trim())) {
      setUploadForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setUploadForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.documentType || !uploadForm.title) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    setUploading(true)
    try {
      const uploadData: UploadDocumentDto = {
        file: uploadForm.file,
        documentType: uploadForm.documentType,
        title: uploadForm.title,
        description: uploadForm.description || undefined,
        bookingId: uploadForm.bookingId || undefined,
        customerId: uploadForm.customerId || undefined,
        tags: uploadForm.tags.length > 0 ? uploadForm.tags : undefined
      }

      await documentService.uploadDocument(uploadData)
      
      // Reset form
      setUploadForm({
        documentType: "",
        title: "",
        description: "",
        bookingId: "",
        customerId: "",
        tags: [],
        file: null
      })
      
      setShowUpload(false)
      refetch() // Refresh the documents list
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error al subir el documento. Por favor intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (doc: DocumentResponseDto) => {
    try {
      await documentService.downloadAndSave(doc.id, doc.originalFileName)
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Error al descargar el documento')
    }
  }

  const handlePreview = (doc: DocumentResponseDto) => {
    // Open document in new tab for preview
    window.open(documentService.getDownloadUrl(doc.id), '_blank')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      return
    }

    try {
      await documentService.deleteDocument(id)
      refetch() // Refresh the documents list
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Error al eliminar el documento')
    }
  }

  const resetForm = () => {
    setUploadForm({
      documentType: "",
      title: "",
      description: "",
      bookingId: "",
      customerId: "",
      tags: [],
      file: null
    })
    setNewTag("")
  }

  if (loading) return <Loading message="Cargando documentos..." />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button onClick={refetch} variant="outline" className="mt-2">
          Reintentar
        </Button>
      </div>
    )
  }

  // Calculate stats from actual data
  const totalDocs = documents?.length || 0
  const pdfDocs = documents?.filter(d => d.mimeType === 'application/pdf').length || 0
  const imageDocs = documents?.filter(d => d.mimeType?.startsWith('image/')).length || 0
  const thisMonthDocs = documents?.filter(d => 
    new Date(d.uploadedAt).getMonth() === new Date().getMonth()
  ).length || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
          <p className="text-gray-600">Gestiona archivos y documentos de viaje</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Subir Documento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Documentos</p>
                <p className="text-2xl font-bold">{totalDocs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">PDFs</p>
                <p className="text-2xl font-bold">{pdfDocs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Image className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Imágenes</p>
                <p className="text-2xl font-bold">{imageDocs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold">{thisMonthDocs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Documentos</CardTitle>
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {documentTypes
                  .filter(type => type && type.trim() !== '') // Filtrar valores vacíos
                  .map(type => (
                    <SelectItem key={type} value={type}>{getDocumentTypeText(type)}</SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={filterBooking} onValueChange={setFilterBooking}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todas las reservas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las reservas</SelectItem>
                {bookings
                  .filter(booking => booking && booking.id && booking.id.trim() !== '') // Filtrar bookings inválidos
                  .map(booking => (
                    <SelectItem key={booking.id} value={booking.id}>
                      {booking.bookingNumber} - {booking.customerName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filterFromDate}
              onChange={(e) => setFilterFromDate(e.target.value)}
              className="w-[150px]"
              placeholder="Desde"
            />
            
            <Input
              type="date"
              value={filterToDate}
              onChange={(e) => setFilterToDate(e.target.value)}
              className="w-[150px]"
              placeholder="Hasta"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Archivo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Asociado a</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Subido por</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents?.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.mimeType, getFileExtension(doc.fileName))}
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-sm text-gray-500">{doc.originalFileName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getDocumentTypeText(doc.documentType)}</Badge>
                  </TableCell>
                  <TableCell>
                    {doc.booking ? (
                      <div>
                        <div className="font-medium">{doc.booking.customerName}</div>
                        <div className="text-sm text-gray-500">{doc.booking.bookingNumber}</div>
                      </div>
                    ) : doc.customer ? (
                      <div>
                        <div className="font-medium">{doc.customer.name}</div>
                        <div className="text-sm text-gray-500">{doc.customer.email}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin asociar</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{formatFileSize(doc.fileSize)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      {doc.uploadedBy}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-1">
                      {doc.canDownload && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handlePreview(doc)}
                          title="Ver documento"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {doc.canDownload && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          title="Descargar documento"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {doc.canDelete && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                          title="Eliminar documento"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {documents?.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay documentos</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron documentos que coincidan con los filtros aplicados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={(open) => {
        setShowUpload(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subir Documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Documento *</label>
                {loadingOptions ? (
                  <Input placeholder="Cargando tipos..." disabled />
                ) : (
                  <Select 
                    value={uploadForm.documentType}
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, documentType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes
                        .filter(type => type && type.trim() !== '') // Filtrar valores vacíos
                        .map(type => (
                          <SelectItem key={type} value={type}>{getDocumentTypeText(type)}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Reserva (Opcional)</label>
                {loadingOptions ? (
                  <Input placeholder="Cargando reservas..." disabled />
                ) : (
                  <Select 
                    value={uploadForm.bookingId}
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, bookingId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sin asociar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Sin asociar</SelectItem>
                      {bookings
                        .filter(booking => booking && booking.id && booking.id.trim() !== '') // Filtrar bookings inválidos
                        .map(booking => (
                          <SelectItem key={booking.id} value={booking.id}>
                            {booking.bookingNumber} - {booking.customerName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Título *</label>
              <Input
                value={uploadForm.title}
                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título del documento"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descripción</label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
                placeholder="Descripción del documento..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium mb-2 block">Etiquetas</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Agregar etiqueta..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {uploadForm.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center space-x-1 px-2 py-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
            >
              {uploadForm.file ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    {getFileIcon(uploadForm.file.type)}
                  </div>
                  <p className="font-medium">{uploadForm.file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(uploadForm.file.size)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadForm(prev => ({ ...prev, file: null }))}
                  >
                    Cambiar archivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Arrastra un archivo aquí</p>
                    <p className="text-xs text-gray-500">o haz clic para seleccionar</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Seleccionar archivo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,.xls,.xlsx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file)
                    }}
                  />
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500">
              Formatos permitidos: PDF, JPG, PNG, DOC, DOCX, TXT, XLS, XLSX. Tamaño máximo: 10MB
            </div>

            <div className="flex space-x-4 pt-4">
              <Button 
                onClick={handleUpload} 
                disabled={!uploadForm.file || !uploadForm.documentType || !uploadForm.title || uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Documento
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowUpload(false)}
                className="flex-1"
                disabled={uploading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper function
const getFileExtension = (fileName: string): string => {
  return fileName.substring(fileName.lastIndexOf('.'))
}