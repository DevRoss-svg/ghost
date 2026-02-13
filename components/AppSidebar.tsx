import { getUser } from "@/app/auth/auth/server";
import { createClient } from "@/app/auth/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import SidebarGroupContent from "./SidebarGroupContent";
import Link from "next/link";

type Note = {
  id: string;
  text: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

async function AppSidebar() {
  const user = await getUser()
  let notes: Note[] = [];
  
  if (user) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('Note')
      .select('*')
      .eq('authorId', user.id)
      .order('updatedAt', { ascending: false });
    
    if (data && !error) {
      notes = data.map(note => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
    }
  }
  
  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-4 text-base font-semibold">
            Your Notes
          </SidebarGroupLabel>
          {user && <SidebarGroupContent notes={notes} />}
          {!user && (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              <Link href="/login" className="underline hover:text-primary">
                Login
              </Link>{" "}
              to see your notes
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar;