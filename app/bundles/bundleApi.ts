import type { ObjectId } from "mongoose";

export interface Bundle {
  _id: string;
  name: string;
  price: number;
  credits: number;
  discount: number;
  validity: number;
  support:
    | "VIP"
    | "Dedicated account manager"
    | "24/7 support"
    | "Basic support";
  features: string[];
  activationDate?: Date;
  bonus: "5" | "10" | "20";
  userId: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const API_BASE_URL = "https://api.merge.ws:8000/api/auth/home/bundle";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log("API Response:", data);
  return data;
}

export async function getBundles(): Promise<Bundle[]> {
  const data = await fetchWithAuth(API_BASE_URL);
  if (Array.isArray(data)) {
    return data;
  } else if (data && typeof data === "object" && Array.isArray(data.bundles)) {
    return data.bundles;
  } else {
    console.error("Unexpected data structure:", data);
    return [];
  }
}

export async function createBundle(
  bundle: Omit<Bundle, "_id" | "createdAt" | "updatedAt">
): Promise<Bundle> {
  return fetchWithAuth(API_BASE_URL, {
    method: "POST",
    body: JSON.stringify(bundle),
  });
}

export async function getBundle(id: string): Promise<Bundle> {
  return fetchWithAuth(`${API_BASE_URL}/${id}`);
}

export async function updateBundle(
  id: string,
  bundle: Partial<Omit<Bundle, "_id" | "createdAt" | "updatedAt">>
): Promise<Bundle> {
  return fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(bundle),
  });
}

export async function deleteBundle(id: string): Promise<void> {
  await fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
}
