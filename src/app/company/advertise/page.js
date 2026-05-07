import Advertise from "@/screens/Company/Advertise";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - जाहिरात",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - जाहिरात",
};

const AdvertisePage = () => {
    return (
        <Advertise />
    );
}

export default AdvertisePage;

