import CookiePolicy from "@/screens/Company/CookiePolicy";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - कुकी धोरण",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - कुकी धोरण",
};

const CookiePolicyPage = () => {
    return (
        <CookiePolicy />
    );
}

export default CookiePolicyPage;

