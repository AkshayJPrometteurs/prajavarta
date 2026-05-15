import RelatedNews from "@/screens/RelatedNews";

export default function Page() {
    return <RelatedNews />;
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    return {
        title: `Related News - ${slug} | Prajavarta`,
        description: `Explore more news related to ${slug} on Prajavarta.`,
    };
}
