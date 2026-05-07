import ContactUs from "@/screens/Company/ContactUs";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - संपर्क",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - संपर्क",
};

const ContactUsPage = () => {
    return (
        <ContactUs />
    );
}

export default ContactUsPage;

