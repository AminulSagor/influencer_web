import { AiFillTikTok } from "react-icons/ai";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { PiYoutubeLogoFill } from "react-icons/pi";
import StarRating from "./star-rating";
const UserCardItem = () => {
  return (
    <div className="px-6 py-4 bg-linear-to-r from-light-green to-Primary rounded-md col-span-12 md:col-span-2 flex flex-col items-center text-center gap-1">
      <div className="h-20 rounded-full bg-gray-100 aspect-square" />{" "}
      <h2 className="text-white-two text-lg font-semibold">Hania Amir</h2>{" "}
      <div className="flex text-white-two gap-2 justify-center">
        <BiLogoInstagramAlt size={30} /> <PiYoutubeLogoFill size={30} />{" "}
        <AiFillTikTok size={30} />{" "}
      </div>{" "}
      <p className="text-xs text-white-two">TVC Actress, Fashion</p>{" "}
      <div>
        <p className="text-lg font-semibold text-white-two">23</p>{" "}
        <p className="text-white-two text-sm">Job Done</p>{" "}
      </div>{" "}
      <StarRating max={5} rating={4.5} />{" "}
    </div>
  );
};
export default UserCardItem;

// import { AiFillTikTok } from "react-icons/ai";
// import { BiLogoInstagramAlt } from "react-icons/bi";
// import { PiYoutubeLogoFill } from "react-icons/pi";
// import StarRating from "./star-rating";

// const UserCardItem = () => {
//   return (
//     <div
//       className="
//         group
//         px-6 py-4 rounded-md col-span-12 md:col-span-2
//         flex flex-col items-center text-center gap-1
//         bg-linear-to-r from-light-green to-Primary
//         border border-transparent
//         transition-all duration-500 ease-in-out
//         hover:border-light-green
//         hover:bg-linear-to-b hover:from-white hover:to-Secondary
//         hover:shadow-lg
//       "
//     >
//       <div className="h-20 rounded-full bg-gray-100 group-hover:bg-light-green aspect-square transition-all duration-500 ease-in-out" />
//       <h2 className="text-white-two text-lg font-semibold transition-colors duration-500 ease-in-out group-hover:text-light-green">
//         Hania Amir
//       </h2>

//       <div className="flex gap-2 justify-center text-white-two transition-colors duration-500 ease-in-out group-hover:text-light-green">
//         <BiLogoInstagramAlt size={30} />
//         <PiYoutubeLogoFill size={30} />
//         <AiFillTikTok size={30} />
//       </div>

//       <p className="text-xs text-white-two transition-colors duration-500 ease-in-out group-hover:text-light-green">
//         TVC Actress, Fashion
//       </p>

//       <div>
//         <p className="text-lg font-semibold text-white-two transition-colors duration-500 ease-in-out group-hover:text-light-green">
//           23
//         </p>
//         <p className="text-sm text-white-two transition-colors duration-500 ease-in-out group-hover:text-light-green">
//           Job Done
//         </p>
//       </div>

//       <div className="transition-colors duration-500 ease-in-out group-hover:text-light-green">
//         <StarRating max={5} rating={4.5} />
//       </div>
//     </div>
//   );
// };

// export default UserCardItem;
