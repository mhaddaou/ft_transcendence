import FormName from "./FormName";
import FormAvatar from "./FormAvatar";
import Form2fa from "./Form2fa";


export default function  Updates (){
}
export function UpdateName () {
    return (
        <div className="h-1/3 w-full  flex flex-col gap-4">
            <div className="h-1/4  py-2">
                <h1 className="h-[70%] font-mono font-semibold">change username</h1>
                <hr className="w-[60%] h-[30%] border-t-4"/>
            </div>
            <div className="h-1/2 text-base md:text-lg font-mono ">
                <p>"Update your username with ease! </p>
                <p>Choose a new username between 8 and</p>
                <p>20 characters to personalize your </p>
                <p>account."</p>
            </div>
            <div className="h-1/4">
                <FormName />                        
            </div>
         </div>
    );
}

export function UpdateAvatar() {
    return (
        <div className="h-1/3 w-full  flex flex-col gap-4">
        <div className="h-1/4  py-2">
            <h1 className="h-[70%] font-mono font-semibold">change avatar</h1>
            <hr className="w-[60%] h-[30%] border-t-4"/>
        </div>
        <div className="h-1/2 text-base md:text-lg font-mono ">
            <p >"Give your profile a fresh look! You can change your user   </p>
            <p >image to a JPEG or PNG format, with a maximum file size of 6MB.  </p>
            <p > Get ready to showcase your personality with a stylish new </p>
            <p>image!"</p>
        </div>
        <div className="h-1/4">
            <FormAvatar />
        </div>
     </div>
    );
}

export function Twofactor(){
    return (
        <div className="h-1/3 w-full  flex flex-col gap-4">
        <div className="h-1/4  py-2">
            <h1 className="h-[70%] font-mono font-semibold">2FA</h1>
            <hr className="w-[60%] h-[30%] border-t-4"/>
        </div>
        <div className="h-1/2 text-sm md:text-lg font-mono mb-4 sm:mb-0">
            <p>"Secure your account with an extra layer of protection! Our platform offers Two-Factor Authentication (2FA) to safeguard your login process. Enable 2FA for your account to add an additional security measure, requiring both your password and a unique verification code. Protect your account and enjoy peace of mind knowing that your information is secure."</p>
        </div>
        <div className="h-1/4 ">
            <Form2fa />
        </div>
     </div>
    );

}












 