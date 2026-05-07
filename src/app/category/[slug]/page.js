import Categories from "@/screens/Categories";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - श्रेणी",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - श्रेणी",
};

const CategoryPage = () => {
    return (
        <Categories />
    );
}

export default CategoryPage;

