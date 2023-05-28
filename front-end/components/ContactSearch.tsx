import { useState } from "react";

const ContactSearch = () => {
    const contacts  = ["alice","bob","charl"];

//   const [contact, setContact] = useState("");
  const [inp, setInp] = useState("");

  const handleInputChange = (event: any) => {
    setInp(event.target.value);
   
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      click();
    }
  };
  let check = false;
  const click = () => {
    if (inp !== "") {
      for (const cnt of contacts) {
        if (cnt === inp.toLowerCase()) {
          console.log("found");
          setInp("");
          check = true;
          break;
        }
      }
    }
    if (check === false) {
      setInp("");
      console.log("not found");
    }
  };
  

  return (
    <div className="mb-3 ">
      <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        <input
          type="search"
          className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
          placeholder="Search"
          aria-label="Search"
          value={inp}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Add this line to handle "Enter" key press
          aria-describedby="button-addon3"
        />
        <button
          className="relative z-[2] rounded-r border-2 border-primary px-6 py-2 text-xs font-medium uppercase text-primary transition duration-150 ease-in-out hover:bg-black hover:text-white hover:bg-opacity-5 focus:outline-none focus:ring-0"
          type="button"
          onClick={click}
          data-te-ripple-init
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default ContactSearch;

