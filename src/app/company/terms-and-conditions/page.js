import TermsAndConditions from "@/screens/Company/TermsAndConditions";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - अटी व शर्ती",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - अटी व शर्ती",
};

const TermsAndConditionsPage = () => {
    return (
        <TermsAndConditions />
    );
}

export default TermsAndConditionsPage;

