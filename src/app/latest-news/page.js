import LatestNews from '@/screens/LatestNews'

export const metadata = {
    title: 'नवीनतम बातम्या - ' + process.env.NEXT_PUBLIC_APP_NAME,
    description: 'संपूर्ण महाराष्ट्रातील नवीनतम आणि ताज्या बातम्या.',
};

const LatestNewsPage = () => {
    return <LatestNews />
}

export default LatestNewsPage
