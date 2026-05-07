import Articles from "@/screens/Articles";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - लेख",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - लेख",
};

const ArticlePage = () => {
    return (
        <Articles />
    );
}

export default ArticlePage;

