import Author from "@/screens/Author";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - लेखक",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - लेखक",
};

const AuthorPage = () => {
    return (
        <Author />
    );
}

export default AuthorPage;

