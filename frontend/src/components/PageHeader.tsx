import { FaReact } from "react-icons/fa";
import { LuCircleUser } from "react-icons/lu";
import { NavigationMenu, NavigationMenuLink } from "./ui/navigation-menu";
import { Link } from "react-router-dom";

const PageHeader = () => {
  return (
    <div className="flex justify-between m-4 px-3 py-2 border-1 shadow-sm rounded-full">
      <div className="flex items-center">
        <Link to="/" className="flex gap-2">
          <FaReact size="2em" />
          <h1 className="text-2xl font-semibold me-4">React Royale</h1>
        </Link>

        <NavigationMenu>
          <NavigationMenuLink asChild className="text-md">
            <Link to="/docs">Docs</Link>
          </NavigationMenuLink>
        </NavigationMenu>
      </div>

      <div className="flex items-center">
        <LuCircleUser size="2em" />
      </div>
    </div>
  );
};

export default PageHeader;
