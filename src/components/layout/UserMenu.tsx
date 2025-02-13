import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, User, LogOut, DollarSign } from "lucide-react";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { currencies } from "@/lib/currency";
import { getStore, setStore } from "@/lib/store";
import { useState } from "react";

export function UserMenu() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [currentCurrency, setCurrentCurrency] = useState(getStore().currency);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleCurrencyChange = (currency: typeof currencies[0]) => {
    const store = getStore();
    store.currency = currency;
    setStore(store);
    setCurrentCurrency(currency);
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              alt={user.name}
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/app/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="w-full">
              <div className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel className="font-normal px-2">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Currency</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currencies.map((currency) => (
                  <DropdownMenuItem
                    key={currency.code}
                    onClick={() => handleCurrencyChange(currency)}
                    className="flex items-center justify-between"
                  >
                    <span>{currency.name}</span>
                    <span className="text-muted-foreground">
                      {currency.symbol} ({currency.code})
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
