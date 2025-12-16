import Link from "next/link";

const Home = () => {
  return (
    <div>
      <h1 className="text-center"> Main Home page</h1>
      <div className="flex justify-between max-w-96">
        <button className="p-4 py-2 rounded-md border">
          <Link href={"/signup"}>click to Signup</Link>
        </button>
        <button className="p-4 py-2 rounded-md border">
          <Link href={"/login"}>click to login</Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
