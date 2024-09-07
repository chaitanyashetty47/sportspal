
import {Link} from "react-router-dom"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-4 bg-background border-b md:px-6">
      <Link to="#" className="flex items-center gap-2" >
        <MountainIcon className="w-6 h-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <div className="relative flex-1 max-w-md">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="w-full pl-8 rounded-lg" />
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="#"
          className="text-muted-foreground hover:text-foreground hover:underline hover:text-green-500"
        >
          Book
        </Link>
        <Link
          to="#"
          className="text-muted-foreground hover:text-foreground hover:underline hover:text-green-500"
        >
          Play
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">C</Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>My Account</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function MountainIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}


function SearchIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}