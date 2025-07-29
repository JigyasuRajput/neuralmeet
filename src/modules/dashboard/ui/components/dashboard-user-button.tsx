import { authClient } from "@/lib/auth-client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";

import {
  ChevronDown,
  ChevronDownIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const isMobile = useIsMobile();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  if (isPending || !data?.user) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button 
            variant="ghost" 
            className="gap-x-2 rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden h-auto"
          >
            {data.user.image ? (
              <Avatar>
                <AvatarImage src={data.user.image} />
              </Avatar>
            ) : (
              <GeneratedAvatar
                seed={data.user.id}
                variant="initials"
                className="size-9 mr-3"
              />
            )}
            <div className="flex flex-col gap-0.5 text-left pl-1 overflow-hidden flex-1 min-w-0">
              <p className="text-sm truncate w-full">{data.user.name}</p>
              <p className="text-xs text-muted-foreground truncate w-full">
                {data.user.email}
              </p>
            </div>
            <ChevronDownIcon className="size-4 shrink-0" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
            variant="outline"
            onClick={() => {}}
            >
              <CreditCardIcon className="size-4 text-black" />
              Billing
            </Button>
            <Button
            variant="outline"
            onClick={onLogout}
            >
              <LogOutIcon className="size-4 text-black" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="gap-x-2 rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden h-auto"
        >
          {data.user.image ? (
            <Avatar>
              <AvatarImage src={data.user.image} />
            </Avatar>
          ) : (
            <GeneratedAvatar
              seed={data.user.id}
              variant="initials"
              className="size-9 mr-3"
            />
          )}
          <div className="flex flex-col gap-0.5 text-left pl-1 overflow-hidden flex-1 min-w-0">
            <p className="text-sm truncate w-full">{data.user.name}</p>
            <p className="text-xs text-muted-foreground truncate w-full">
              {data.user.email}
            </p>
          </div>
          <ChevronDownIcon className="size-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72" side="right">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">{data.user.name}</span>
            <span className="text-sm font-normal text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-between"
          onClick={onLogout}
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};