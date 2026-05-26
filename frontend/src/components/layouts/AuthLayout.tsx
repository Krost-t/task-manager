import React from "react";
import UI_IMG from "../../assets/img/authImg.jpg";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <div className="w-screen h-screen md:w[60vw] px-12 pt-8 pb-12">
                <h2 className="text-lg font-medium text-black">Welcome to the Task Manager</h2>
                {children}
            </div>

            <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-[#005AE6]  bg-cover bg-center bg-no-repeat overflow-hidden p-8">
                <img src={UI_IMG} alt="UI" className="w-64 lg:w-[90%]" />
            </div>
        </div>
    );
};

export default AuthLayout;
