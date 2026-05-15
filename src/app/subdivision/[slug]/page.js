import SubdivisionNews from "@/screens/SubdivisionNews";

export const metadata = {
    title: "उप-विभाग बातम्या - " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "विशिष्ट उप-विभागातील ताज्या बातम्या आणि घडामोडी.",
};

const SubdivisionPage = () => {
    return <SubdivisionNews />;
}

export default SubdivisionPage;
