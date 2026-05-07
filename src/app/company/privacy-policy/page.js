import PrivacyPolicy from "@/screens/Company/PrivacyPolicy";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - गोपनीयता धोरण",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - गोपनीयता धोरण",
};

const PrivacyPolicyPage = () => {
    return (
        <PrivacyPolicy />
    );
}

export default PrivacyPolicyPage;

