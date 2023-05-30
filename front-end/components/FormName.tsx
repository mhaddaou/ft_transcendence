

const FormName = () =>{
    const name = "mhaddaou"
    return (
        <form className="w-full max-w-sm">
            <div className="flex items-center border-b border-slate-600 py-2">
                <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder={`${name}`} aria-label="Full name"/>
                    <button className="flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                        Submit
                    </button>
                    <button className="flex-shrink-0 border-transparent border-4 text-slate-600 hover:text-slate-800 text-sm py-1 px-2 rounded" type="button">
                            Cancel
                    </button>
            </div>
        </form>
    );
}

export default FormName;