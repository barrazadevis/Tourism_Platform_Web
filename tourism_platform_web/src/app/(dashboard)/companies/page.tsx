"use client"

import { useEffect, useState, useCallback } from "react"
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from "@/types/company"
import { companyService } from "@/services/company.service"
import { CompanyCard } from "@/components/companies/company-card"
import { CompanyTable } from "@/components/companies/company-table"
import { CompanyFormDialog } from "@/components/companies/company-form-dialog"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, List } from "lucide-react"

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  const loadCompanies = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await companyService.getAllCompanies()
      setCompanies(data)
    } catch (error) {
      console.error("Failed to load companies", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

  const handleCreateNew = () => {
    setSelectedCompany(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (company: Company) => {
    setSelectedCompany(company)
    setIsDialogOpen(true)
  }

  const handleToggleStatus = async (company: Company) => {
    try {
      if (company.isActive) {
        await companyService.deactivateCompany(company.id)
      } else {
        await companyService.activateCompany(company.id)
      }
      await loadCompanies()
    } catch (error) {
      console.error("Failed to toggle company status", error)
    }
  }

  const handleSave = async (data: CreateCompanyRequest | UpdateCompanyRequest) => {
    if (selectedCompany) {
      await companyService.updateCompany(selectedCompany.id, data as UpdateCompanyRequest)
    } else {
      await companyService.createCompany(data as CreateCompanyRequest)
    }
    await loadCompanies()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Compañías</h1>
          <p className="text-muted-foreground mt-1">
            Administra todas las compañías y sus suscripciones.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-lg p-1 border border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-3 py-1 ${viewMode === 'grid' ? 'bg-background shadow-sm' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={`px-3 py-1 ${viewMode === 'table' ? 'bg-background shadow-sm' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <List className="w-4 h-4 mr-2" />
              Tabla
            </Button>
          </div>
          
          <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Compañía
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {companies.map(company => (
                <CompanyCard 
                  key={company.id} 
                  company={company} 
                  onEdit={handleEdit} 
                  onToggleStatus={handleToggleStatus} 
                />
              ))}
              {companies.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-lg border border-border border-dashed">
                  No hay compañías registradas.
                </div>
              )}
            </div>
          ) : (
            <CompanyTable 
              companies={companies} 
              onEdit={handleEdit} 
              onToggleStatus={handleToggleStatus} 
            />
          )}
        </>
      )}

      <CompanyFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        company={selectedCompany} 
        onSave={handleSave} 
      />
    </div>
  )
}
