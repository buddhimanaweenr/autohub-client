import HeroSection from '@/components/HeroSection'
import StatsSection from '@/components/StatsSection'
import PopularTags from '@/components/PopularTags'
import BrowseSection from '@/components/BrowseSection'
import FeaturesSection from '@/components/FeaturesSection'
import NewsSection from '@/components/NewsSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <PopularTags />
      <BrowseSection />
      <FeaturesSection />
      <NewsSection />
    </>
  )
}