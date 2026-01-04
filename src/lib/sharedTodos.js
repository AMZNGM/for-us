import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function addSharedTodo(todoText, currentUserId, partnerUserId) {
  try {
    const todoData = {
      text: todoText,
      completed: false,
      createdBy: currentUserId,
      assignedTo: [currentUserId, partnerUserId],
      loveLevel: Math.floor(Math.random() * 3) + 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "sharedTodos"), todoData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding shared todo:", error);
    throw error;
  }
}

export function listenToSharedTodos(callback, errorCallback) {
  const q = query(collection(db, "sharedTodos"), orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const todos = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          ...data,
          createdAt:
            data.createdAt && typeof data.createdAt.toDate === "function"
              ? data.createdAt.toDate()
              : new Date(),
          updatedAt:
            data.updatedAt && typeof data.updatedAt.toDate === "function"
              ? data.updatedAt.toDate()
              : new Date(),
        };
      });
      callback(todos);
    },
    (error) => {
      console.error("Error listening to shared todos:", error);
      if (errorCallback && typeof errorCallback === "function") {
        errorCallback(error);
      }
    }
  );

  return unsubscribe;
}

export async function toggleSharedTodo(todoId, completed) {
  try {
    const todoRef = doc(db, "sharedTodos", todoId);
    await updateDoc(todoRef, {
      completed,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error toggling todo:", error);
    throw error;
  }
}

export async function deleteSharedTodo(todoId) {
  try {
    const todoRef = doc(db, "sharedTodos", todoId);
    await deleteDoc(todoRef);
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
}
