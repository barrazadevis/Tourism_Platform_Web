'use client'

import { useState, useRef } from "react"
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
  FolderOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  DialogClose,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"

interface Document {
  id: string
  documentType: string
  fileName: string
  originalFileName: string
  fileExtension: string
  fileSizeBytes: number
  fileSizeFormatted: string
  bookingNumber?: string
  customerName?: string
  uploadedAt: string
  uploadedBy: string
  downloadUrl: string
}

// Datos de ejemplo
const mockDocuments: Document[] = [
  {
    id: "1",
    documentType: "Pasaporte",
    fileName: "passport_maria_gonzalez.pdf",
    originalFileName: "Pasaporte María González.pdf",
    fileExtension: ".pdf",
    fileSizeBytes: 2048576,
    fileSizeFormatted: "2.0 MB",
    bookingNumber: "BK-202401-0001",
    customerName: "María González",
    uploadedAt: "2024-01-20",
    uploadedBy: "Admin",
    downloadUrl: "/api/documents/1/download"
  },
  {
    id: "2",
    documentType: "Voucher",
    fileName: "voucher_hotel_cartagena.pdf",
    originalFileName: "Voucher Hotel Cartagena.pdf",
    fileExtension: ".pdf",
    fileSizeBytes: 1536000,
    fileSizeFormatted: "1.5 MB",
    bookingNumber: "BK-202401-0001",
    customerName: "María González",
    uploadedAt: "2024-01-22",
    uploadedBy: "Admin",
    downloadUrl: "/api/documents/2/download"
  },
  {
    id: "3",
    documentType: "Factura",
    fileName: "invoice_202401_0001.pdf",
    originalFileName: "Factura BK-202401-0001.pdf",
    fileExtension: ".pdf",
    fileSizeBytes: 512000,
    fileSizeFormatted: "500 KB",
    bookingNumber: "BK-202401-0001",
    customerName: "María González",
    uploadedAt: "2024-01-25",
    uploadedBy: "Contabilidad",
    downloadUrl: "/api/documents/3/download"
  },
  {
    id: "4",
    documentType: "Cédula",
    fileName: "cedula_carlos_ruiz.jpg",
    originalFileName: "Cédula Carlos Ruiz.jpg",
    fileExtension: ".jpg",
    fileSizeBytes: 1024000,
    fileSizeFormatted: "1.0 MB",
    bookingNumber: "BK-202401-0002",
    customerName: "Carlos Ruiz",
    uploadedAt: "2024-02-01",
    uploadedBy: "Admin",
    downloadUrl: "/api/documents/4/download"
  }
]

interface UploadFormData {
  documentType: string
  bookingId: string
  customerId: string
  file: File | null
}

interface DocumentListProps {
  tenant: string
}

export function DocumentList({ tenant }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterBooking, setFilterBooking] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    documentType: "",
    bookingId: "",
    customerId: "",
    file: null
  })
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.originalFileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = !filterType || doc.documentType === filterType
    const matchesBooking = !filterBooking || doc.bookingNumber === filterBooking
    
    return matchesSearch && matchesType && matchesBooking
  })

  const documentTypes = [...new Set(documents.map(d => d.documentType))]
  const bookingNumbers = [...new Set(documents.filter(d => d.bookingNumber).map(d => d.bookingNumber!))]

  const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case '.pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      case '.jpg':
      case '.jpeg':
      case '.png':
        return <Image className="h-5 w-5 text-blue-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const handleFileSelect = (file: File) => {
    setUploadForm(prev => ({ ...prev, file }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleUpload = async () => {
    if (!uploadForm.file) return

    try {
      // Simular upload
      console.log('Uploading file:', uploadForm)
      
      const newDoc: Document = {
        id: Date.now().toString(),
        documentType: uploadForm.documentType,
        fileName: uploadForm.file.name.replace(/\s+/g, '_').toLowerCase(),
        originalFileName: uploadForm.file.name,
        fileExtension: '.' + uploadForm.file.name.split('.').pop()!,
        fileSizeBytes: uploadForm.file.size,
        fileSizeFormatted: formatFileSize(uploadForm.file.size),
        bookingNumber: uploadForm.bookingId || undefined,
        customerName: uploadForm.customerId ? "Cliente Demo" : undefined,
        uploadedAt: new Date().toISOString().split('T')[0],
        uploadedBy: "Usuario Actual",
        downloadUrl: `/api/documents/${Date.now()}/download`
      }

      setDocuments(prev => [newDoc, ...prev])
      setShowUpload(false)
      setUploadForm({
        documentType: "",
        bookingId: "",
        customerId: "",
        file: null
      })
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const handleDownload = (doc: Document) => {
    // Simular descarga
    console.log('Downloading:', doc.originalFileName)
    // En una app real, esto haría una petición al backend
  }

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

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
                <p className="text-2xl font-bold">{documents.length}</p>
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
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.fileExtension === '.pdf').length}
                </p>
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
                <p className="text-2xl font-bold">
                  {documents.filter(d => ['.jpg', '.jpeg', '.png'].includes(d.fileExtension)).length}
                </p>
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
                <p className="text-2xl font-bold">
                  {documents.filter(d => 
                    new Date(d.uploadedAt).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Documentos</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Todos los tipos</option>
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filterBooking}
              onChange={(e) => setFilterBooking(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Todas las reservas</option>
              {bookingNumbers.map(booking => (
                <option key={booking} value={booking}>{booking}</option>
              ))}
            </select>
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
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.fileExtension)}
                      <div>
                        <div className="font-medium">{doc.originalFileName}</div>
                        <div className="text-sm text-gray-500">{doc.fileExtension.toUpperCase()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.documentType}</Badge>
                  </TableCell>
                  <TableCell>
                    {doc.bookingNumber && doc.customerName ? (
                      <div>
                        <div className="font-medium">{doc.customerName}</div>
                        <div className="text-sm text-gray-500">{doc.bookingNumber}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin asociar</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{doc.fileSizeFormatted}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      {doc.uploadedBy}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDocuments.length === 0 && (
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
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogHeader>
          <DialogTitle>Subir Documento</DialogTitle>
          <DialogClose onClose={() => setShowUpload(false)} />
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo de Documento</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={uploadForm.documentType}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, documentType: e.target.value }))}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Cédula">Cédula</option>
                  <option value="Voucher">Voucher</option>
                  <option value="Factura">Factura</option>
                  <option value="Seguro">Seguro de Viaje</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Reserva (Opcional)</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={uploadForm.bookingId}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, bookingId: e.target.value }))}
                >
                  <option value="">Sin asociar</option>
                  <option value="BK-202401-0001">BK-202401-0001 - María González</option>
                  <option value="BK-202401-0002">BK-202401-0002 - Carlos Ruiz</option>
                  <option value="BK-202401-0003">BK-202401-0003 - Ana Martínez</option>
                </select>
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
                    {getFileIcon('.' + uploadForm.file.name.split('.').pop()!)}
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
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file)
                    }}
                  />
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500">
              Formatos permitidos: PDF, JPG, PNG, DOC, DOCX. Tamaño máximo: 10MB
            </div>

            <div className="flex space-x-4 pt-4">
              <Button 
                onClick={handleUpload} 
                disabled={!uploadForm.file || !uploadForm.documentType}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                Subir Documento
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowUpload(false)}
                className="flex-1"
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