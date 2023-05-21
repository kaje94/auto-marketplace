import { FC } from "react";

export const Pagination: FC = () => {
  return (
    <div className="flex justify-center mt-16">
      <div className="btn-group ">
        <button className="btn">«</button>
        <button className="btn">1</button>
        <button className="btn btn-active">2</button>
        <button className="btn">3</button>
        <button className="btn">4</button>
        <button className="btn">»</button>
      </div>
    </div>
  );
};
