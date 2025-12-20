export interface PublicUserResponse {
    id: string;
    name: string;
    profileImagePath: string;
}

export interface UserProfileResponse {
    id: string;
    name: string;
    email: string;
    profileImagePath: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    createdByUserId: string;
    updatedByUserId: string;
}

export interface UpdateProfileRequest {
    name: string;
}
