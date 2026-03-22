import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ShowroomInfo {
    name: string;
    email: string;
    address: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    model: string;
    features: Array<string>;
    hpMax: bigint;
    hpMin: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
    category: string;
    priceMax: number;
    priceMin: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimAdminByEmail(email: string): Promise<boolean>;
    deleteProduct(id: bigint): Promise<boolean>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getShowroomInfo(): Promise<ShowroomInfo>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(id: bigint, product: Product): Promise<boolean>;
    updateShowroomInfo(info: ShowroomInfo): Promise<boolean>;
}
