import RowOne from "./_components/row-one";
import RowThree from "./_components/row-three";
import RowTwo from "./_components/row-two";

const page = () => {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <RowOne />
        <RowTwo />
        <RowThree />
      </div>
    </div>
  );
};

export default page;
