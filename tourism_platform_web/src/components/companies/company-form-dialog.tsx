import { useState, useEffect } from "react"
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from "@/types/company"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
  onSave: (data: CreateCompanyRequest | UpdateCompanyRequest) => Promise<void>;
}

export function CompanyFormDialog({ open, onOpenChange, company, onSave }: CompanyFormDialogProps) {
  const [formData, setFormData] = useState<Partial<CreateCompanyRequest>>({
    name: "",
    planType: "Basic",
    applicationId: 1,
    subscriptionEndsAt: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (company && open) {
      setFormData({
        name: company.name,
        planType: company.planType,
        applicationId: company.applicationId,
        subscriptionEndsAt: company.subscriptionEndsAt ? new Date(company.subscriptionEndsAt).toISOString().split('T')[0] : ""
      });
    } else if (open) {
      setFormData({
        name: "",
        planType: "Basic",
        applicationId: 1,
        subscriptionEndsAt: ""
      });
    }
  }, [company, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData as CreateCompanyRequest);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save company", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{company ? "Editar Compañía" : "Nueva Compañía"}</DialogTitle>
        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogHeader>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Compañía</Label>
            <Input 
              id="name" 
              required 
              value={formData.name || ""} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder="Ej. Turismo Global"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="planType">Tipo de Plan</Label>
            <Select 
              value={formData.planType || "Basic"} 
              onValueChange={(value) => setFormData({ ...formData, planType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Básico</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationId">ID de Aplicación</Label>
            <Input 
              id="applicationId" 
              type="number"
              required 
              value={formData.applicationId || ""} 
              onChange={(e) => setFormData({ ...formData, applicationId: parseInt(e.target.value) })} 
              placeholder="ID del sistema (Ej. 1)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriptionEndsAt">Fecha de Vencimiento</Label>
            <Input 
              id="subscriptionEndsAt" 
              type="date"
              value={formData.subscriptionEndsAt || ""} 
              onChange={(e) => setFormData({ ...formData, subscriptionEndsAt: e.target.value })} 
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
