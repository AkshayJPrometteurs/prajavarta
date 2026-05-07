import AboutUs from "@/screens/Company/AboutUs";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - आमच्याबद्दल",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - आमच्याबद्दल",
};

const AboutUsPage = () => {
    return (
        <AboutUs />
    );
}

export default AboutUsPage;

