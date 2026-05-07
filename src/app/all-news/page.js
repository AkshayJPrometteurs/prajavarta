import AllNews from "@/screens/AllNews";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - सर्व न्यूज",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - सर्व न्यूज",
};

const AllNewsPage = () => {
    return (
        <AllNews />
    );
}

export default AllNewsPage;

