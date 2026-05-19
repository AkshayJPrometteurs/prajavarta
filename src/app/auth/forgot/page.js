import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen'

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - Forget Password",
    description: process.env.NEXT_PUBLIC_APP_NAME + " - Forget Password",
};


export default function Page() {
    return <ForgotPasswordScreen />
}
