export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    admin: boolean; 
    phoneNumber?: string; 
    isActive?: boolean; 
    createdAt: Date; 
    updatedAt: Date; 
    lastLogin?: Date; 
};
