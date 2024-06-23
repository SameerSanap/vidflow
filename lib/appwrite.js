// endpoint: process.env.EXPO_ENDPOINT,
// platform: process.env.EXPO_PLATFORM,
// projectId: process.env.EXPO_PRO_ID,
// databaseId: process.env.EXPO_DATABASE_ID,
// userCollectionId: process.env.EXPO_USECOLL_ID,
// videoCollectionId: process.env.EXPO_VIDCOLL_ID,
// storageId: process.env.EXPO_STORAGE_ID,
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwrite = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.sam.auro",
  projectId: "66719f5b000ef8dc5806",
  databaseId: "6671bb97001816ecb25a",
  userCollectionId: "6671bbae0010c2cd1eb5",
  videoCollectionId: "6671bbc5001ead1923db",
  storageId: "6671bd0d002c78ac4ed7",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwrite.endpoint) // Your Appwrite Endpoint
  .setProject(appwrite.projectId) // Your project ID
  .setPlatform(appwrite.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatar = new Avatars(client);
const database = new Databases(client);
const storage = new Storage(client);

// Register User
export async function createUser(email, password, username) {
  try {
    const userId = ID.unique();
    console.log("Generated user ID:", userId); // Log the generated user ID

    const newAccount = await account.create(userId, email, password, username);
    console.log("Account created:", newAccount);

    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatar.getInitials(username);
    console.log("Avatar URL:", avatarUrl);

    const newUser = await database.createDocument(
      appwrite.databaseId,
      appwrite.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );
    console.log("User document created:", newUser);

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error.message);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("New session created:", session);
    return session;
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error(error.message);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw new Error("No current account found");
    }

    const currentUser = await database.listDocuments(
      appwrite.databaseId,
      appwrite.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("User not found");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.error("Error getting current user:", error);
    throw new Error(error.message || "Failed to get current user");
  }
}

// All posts for home page
export async function getPosts() {
  try {
    const post = await database.listDocuments(
      appwrite.databaseId,
      appwrite.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );
    return post.documents;
  } catch (error) {
    console.error("Error getting posts:", error);
    throw new Error(error.message);
  }
}

// Trending posts
export async function getLatestPosts() {
  try {
    const post = await database.listDocuments(
      appwrite.databaseId,
      appwrite.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    return post.documents;
  } catch (error) {
    console.error("Error getting latest posts:", error);
    throw new Error(error.message);
  }
}

// Search Post
export async function searchPost(query) {
  try {
    const posts = await database.listDocuments(
      appwrite.databaseId,
      appwrite.videoCollectionId,
      [Query.search("title", query)]
    );
    if (!posts || posts.documents.length === 0) {
      throw new Error("No posts found");
    }
    return posts.documents;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw new Error(error.message);
  }
}

// User's Posts
export async function getUserPosts(userId) {
  try {
    const post = await database.listDocuments(
      appwrite.databaseId,
      appwrite.videoCollectionId,
      [Query.equal("creator", userId)]
    );
    if (!post || post.documents.length === 0) {
      throw new Error("No posts found for this user");
    }
    return post.documents;
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw new Error(error.message);
  }
}

// Log out
export async function signOut() {
  try {
    const currentSession = await account.get();
    if (!currentSession) {
      throw new Error("No active session found");
    }
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error(error.message);
  }
}

// Get file preview
export async function getFilePreview(fileId, type) {
  try {
    let fileUrl;

    if (type === "video") {
      fileUrl = storage.getFileView(appwrite.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwrite.storageId,
        fileId,
        2000, // width
        2000, // height
        "top",
        100 // quality
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw new Error("Failed to get file preview");

    return fileUrl;
  } catch (error) {
    console.error("Error getting file preview:", error);
    throw new Error(error.message);
  }
}

// Upload file
export async function uploadFile(file, type) {
  if (!file) {
    throw new Error("No file provided");
  }

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      appwrite.storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(error.message);
  }
}

// Upload post with thumbnail and video
export async function upload(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
    const newPost = await database.createDocument(
      appwrite.databaseId,
      appwrite.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        video: videoUrl,
        thumbnail: thumbnailUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    console.error("Error uploading post:", error);
    throw new Error(error.message);
  }
}

export async function updateProfile(avatar, userid) {
  try {
    console.log(avatar);
    const avatarUrl = avatar;
    await database.updateDocument(
      appwrite.databaseId,
      appwrite.userCollectionId,
      userid,
      {
        avatar: avatarUrl,
      }
    );
    console.log("Profile updated successfully");
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error(error.message);
  }
}
