import { Company } from "@/types/company"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, Users, Briefcase, FileText, CheckCircle, XCircle } from "lucide-react"

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onToggleStatus: (company: Company) => void;
}

export function CompanyCard({ company, onEdit, onToggleStatus }: CompanyCardProps) {
  return (
    <Card className="glass-card hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border-t-4 border-t-primary">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-bold">{company.name}</CardTitle>
          </div>
          <Badge variant={company.isActive ? "default" : "destructive"} className={company.isActive ? "bg-success hover:bg-success/80" : ""}>
            {company.isActive ? "Activa" : "Inactiva"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 text-sm space-y-4">
        <div className="grid grid-cols-2 gap-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>Plan: <strong className="text-foreground">{company.planType}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Vence: <strong className="text-foreground">{company.subscriptionEndsAt ? new Date(company.subscriptionEndsAt).toLocaleDateString() : 'N/A'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Usuarios: <strong className="text-foreground">{company.usersCount}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>App: <strong className="text-foreground">{company.applicationName || company.applicationId}</strong></span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t flex justify-between gap-2">
        <Button variant="outline" className="flex-1" onClick={() => onEdit(company)}>
          Editar
        </Button>
        <Button 
          variant={company.isActive ? "secondary" : "default"} 
          className={company.isActive ? "flex-1 bg-destructive/10 text-destructive hover:bg-destructive/20" : "flex-1 bg-success/10 text-success hover:bg-success/20"}
          onClick={() => onToggleStatus(company)}
        >
          {company.isActive ? (
            <><XCircle className="w-4 h-4 mr-2" /> Desactivar</>
          ) : (
            <><CheckCircle className="w-4 h-4 mr-2" /> Activar</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
