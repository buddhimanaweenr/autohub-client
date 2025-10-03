import CarDetails from '@/components/CarDetails'

interface PageProps {
  params: {
    id: string
  }
}

export default function CarDetailPage({ params }: PageProps) {
  return <CarDetails carId={params.id} />
}
