import NewsFormScreen from '@/screens/admin/news/NewsFormScreen'

export const metadata = {
  title: 'Add News - Prajavarta Admin',
  description: 'Create news'
}

export default function AddNewsPage() {
  return <NewsFormScreen mode="add" />
}
