import { FC } from "react";

export const Pagination: FC = () => {
    return (
        <div className="mt-16 flex justify-center">
            <div className="btn-group ">
                <button className="btn">«</button>
                <button className="btn">1</button>
                <button className="btn-neutral btn">2</button>
                <button className="btn">3</button>
                <button className="btn">4</button>
                <button className="btn">»</button>
            </div>
        </div>
    );
};
