
interface IconBol{
    checked : boolean;
}
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';


const IconUpdate = (props : IconBol) => {
    const Upload = ()=>{

    }
    const Change = () =>{

    }

    return (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 m-2 p-2 rounded-lg opacity-70">
            <div className="flex flex-col gap-2">

            <div className='flex gap-1'>
                <InsertPhotoIcon className='text-white' />
                <button onClick={Change} className='font-mono hover:text-white'>Change Avatar</button>
            </div>

            <div className='flex gap-1'>
                <CloudUploadIcon className='text-white' />
                <button onClick={Upload} className='font-mono hover:text-white'>Upload Avatar</button>
            </div>
            </div>

        </div>
    );
}

export default IconUpdate;