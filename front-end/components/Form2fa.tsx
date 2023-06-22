

const Form2fa = () =>{

    const handl2th = () =>{
        //two-factor authentication
    }

    return (
        <form className="w-full max-w-sm">
        <div className="flex items-center border-b border-slate-600 py-2">
                <button onClick={handl2th} className="flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                        enable two-factor authentication
                </button>
        </div>
    </form>
        
    );
}

export default Form2fa;