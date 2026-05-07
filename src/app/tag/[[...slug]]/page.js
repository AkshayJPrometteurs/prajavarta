import Tags from "@/screens/Tags";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - टॅग",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - टॅग",
};

const TagsPage = () => {
    return (
        <Tags />
    );
}

export default TagsPage;

