import NewsFormScreen from '@/screens/admin/NewsFormScreen'

export const metadata = {
  title: 'Add News - Prajavarta Admin',
  description: 'Create news'
}

export default function AddNewsPage() {
  return <NewsFormScreen mode="add" />
}
