import { PreferencesItem } from "./_components";

const Preferences = () => {
    return (
        <>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li>
                        <a>Home</a>
                    </li>
                    <li>
                        <a>Dashboard</a>
                    </li>
                    <li>Preferences</li>
                </ul>
            </div>
            <div className="grid gap-1 xl:gap-2">
                <PreferencesItem />
            </div>
        </>
    );
};

export default Preferences;
