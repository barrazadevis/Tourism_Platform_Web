import { TravelPlanForm } from "@/components/travel-plans/travel-plan-form"

interface EditTravelPlanPageProps {
  params: { tenant: string; id: string }
}

// Datos de ejemplo para editar
const mockEditData = {
  name: "Cartagena Mágica",
  description: "Descubre la ciudad amurallada más hermosa de Colombia con este plan completo de 4 días y 3 noches.",
  destination: "Cartagena, Colombia",
  durationDays: 4,
  basePrice: 850000,
  planType: "Ciudad Colonial",
  inclusions: [
    "3 noches de alojamiento en hotel 4 estrellas",
    "Desayunos buffet incluidos",
    "City tour por el centro histórico",
    "Visita guiada a las murallas",
    "Traslados aeropuerto-hotel-aeropuerto"
  ],
  exclusions: [
    "Tiquetes aéreos",
    "Almuerzos y cenas",
    "Actividades opcionales",
    "Gastos personales"
  ],
  services: [
    {
      id: "1",
      serviceType: "Alojamiento",
      name: "Hotel Boutique Centro Histórico",
      description: "Hotel 4 estrellas en el corazón del centro histórico",
      price: 200000,
      isIncluded: true,
      isOptional: false
    },
    {
      id: "2",
      serviceType: "Transporte",
      name: "Traslados Privados",
      description: "Traslados en vehículo privado con aire acondicionado",
      price: 150000,
      isIncluded: true,
      isOptional: false
    }
  ]
}

export default function EditTravelPlanPage({ params }: EditTravelPlanPageProps) {
  return (
    <TravelPlanForm 
      tenant={params.tenant} 
      isEditing={true}
      initialData={mockEditData}
    />
  )
}