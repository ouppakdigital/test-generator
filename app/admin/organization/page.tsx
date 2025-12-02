import OrganizationClient from './OrganizationClient';

// const PROJECT_ID = 'quiz-app-f197b';
// const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;


import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";



interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
  nullValue?: null;
}

interface FirestoreDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
}

function parseFirestoreValue(value: FirestoreValue): any {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue);
  if (value.doubleValue !== undefined) return parseFloat(String(value.doubleValue));
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.nullValue !== undefined) return null;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.arrayValue !== undefined) {
    return (value.arrayValue.values || []).map(parseFirestoreValue);
  }
  if (value.mapValue !== undefined) {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(value.mapValue.fields || {})) {
      result[key] = parseFirestoreValue(val);
    }
    return result;
  }
  return null;
}

function parseDocument(doc: FirestoreDocument): { id: string; data: Record<string, any> } {
  const pathParts = doc.name.split('/');
  const id = pathParts[pathParts.length - 1];
  
  const data: Record<string, any> = {};
  for (const [key, value] of Object.entries(doc.fields || {})) {
    data[key] = parseFirestoreValue(value);
  }
  
  return { id, data };
}


async function fetchSchools() {
  try {
    const querySnapshot = await getDocs(collection(db, "schools"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching schools:", error);
    return [];
  }
}



async function fetchCampuses() {
  try {
    const querySnapshot = await getDocs(collection(db, "campuses"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching campuses:", error);
    return [];
  }
}



async function fetchUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}


function calculateUserCounts(users: any[]) {
  const bySchool: Record<string, { total: number; students: number; teachers: number; schoolAdmins: number; contentManagers: number }> = {};
  const byCampus: Record<string, { total: number; students: number; teachers: number; schoolAdmins: number; contentManagers: number }> = {};
  
  users.forEach(user => {
    const schoolId = user.schoolId;
    const campusId = user.campusId;
    const role = user.role;
    
    if (schoolId) {
      if (!bySchool[schoolId]) {
        bySchool[schoolId] = { total: 0, students: 0, teachers: 0, schoolAdmins: 0, contentManagers: 0 };
      }
      bySchool[schoolId].total++;
      
      if (role === 'student') bySchool[schoolId].students++;
      else if (role === 'teacher') bySchool[schoolId].teachers++;
      else if (role === 'school_admin') bySchool[schoolId].schoolAdmins++;
      else if (role === 'content_manager') bySchool[schoolId].contentManagers++;
    }
    
    if (campusId) {
      if (!byCampus[campusId]) {
        byCampus[campusId] = { total: 0, students: 0, teachers: 0, schoolAdmins: 0, contentManagers: 0 };
      }
      byCampus[campusId].total++;
      
      if (role === 'student') byCampus[campusId].students++;
      else if (role === 'teacher') byCampus[campusId].teachers++;
      else if (role === 'school_admin') byCampus[campusId].schoolAdmins++;
      else if (role === 'content_manager') byCampus[campusId].contentManagers++;
    }
  });
  
  return { bySchool, byCampus };
}

export default async function OrganizationSetup() {
  const [schools, campuses, users] = await Promise.all([
    fetchSchools(),
    fetchCampuses(),
    fetchUsers()
  ]);
  
  const userCounts = calculateUserCounts(users);
  
  return (
    <OrganizationClient 
      initialSchools={schools}
      initialCampuses={campuses}
      userCounts={userCounts}
    />
  );
}
