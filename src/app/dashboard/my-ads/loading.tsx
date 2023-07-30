import { MyAdItem } from "./_components";

const MyAdvertsLoading = () => {
    return (
        <div className="grid gap-1 xl:gap-2">
            {new Array(5).fill("").map((_, i) => (
                <MyAdItem key={i} loading />
            ))}
        </div>
    );
};

export default MyAdvertsLoading;
