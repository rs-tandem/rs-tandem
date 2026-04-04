import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

import { app } from './config';

export const db = getFirestore(app);

export async function saveSessionResults(
  userId: string,
  sessionResults: Record<number, boolean>,
) {
  await setDoc(doc(db, 'users', userId), { sessionResults }, { merge: true });
}

export async function loadSessionResults(
  userId: string,
): Promise<Record<number, boolean>> {
  const docSnap = await getDoc(doc(db, 'users', userId));
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data['sessionResults']) {
      return data['sessionResults'];
    }
    return {};
  }
  return {};
}
