import Avatar from "./Avatar";
import Search from "./Search";
interface NavProps{
    page : string;
}
// h-[12%]
// 4

const NavBar = (props:NavProps ) =>{
    return (
        <div className={`bg-gray-200 h-[${props.page === 'Chat' ? '5' : '12'}%] rounded-2xl flex items-center px-2 md:px-6 justify-between `}>
            <div className='w-[50%] md:w-full '>

          <Search page={props.page} />
            </div>
                
                <Avatar id={0} page={props.page} check={true} />
          </div>
    );
}



export default NavBar;