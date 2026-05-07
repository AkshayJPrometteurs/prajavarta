import EditorialPolicy from "@/screens/Company/EditorialPolicy";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - संपर्क",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - संपर्क",
};

const ContactUsPage = () => {
    return (
        <EditorialPolicy />
    );
}

export default ContactUsPage;

