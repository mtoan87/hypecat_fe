import NewForm from "../../../../containers/news/NewForm";
interface NewsFormProps {
    isEdit?: boolean;
}

const NewsFormPage = ({ isEdit = false }: NewsFormProps) => {
    return (
        <>
            <NewForm isEdit={isEdit} />
        </>
    );
};

export default NewsFormPage;
