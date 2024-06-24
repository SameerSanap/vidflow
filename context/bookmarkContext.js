import { createContext, useContext, useState } from "react";
import { getBookmarks } from "../lib/appwrite";
import { useAuth } from "./authContext";

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useAuth();

  async function fetchBookmark() {
    try {
      const res = await getBookmarks(user.$id);
      setBookmarks(res);
    } catch (error) {
      console.log("Fail to Fetch", error);
    }
  }
  const refetch = () => {
    fetchBookmark();
  };
  return (
    <BookmarkContext.Provider
      value={{ bookmarks, fetchBookmark, refetch, setBookmarks }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (context === undefined) throw new Error("outside boundary");

  return context;
}
