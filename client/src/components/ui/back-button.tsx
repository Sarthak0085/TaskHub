import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import { ArrowLeft } from 'lucide-react';

export const BackButton = () => {
    const navigate = useNavigate();

    return (
        <Button variant={'outline'} size={'sm'} onClick={() => navigate(-1)} className="p-4 mr-4">
            <ArrowLeft className="size-4 mr-1" /> Back
        </Button>
    );
};
