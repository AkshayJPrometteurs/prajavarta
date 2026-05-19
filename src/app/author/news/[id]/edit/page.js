import NewsFormScreen from '@/screens/admin/news/NewsFormScreen'

export const metadata = {
  title: 'Edit News - Prajavarta Admin',
  description: 'Edit news'
}

export default async function EditNewsPage({ params }) {
  const { id } = await params
  return <NewsFormScreen mode="edit" newsId={id} />
}
