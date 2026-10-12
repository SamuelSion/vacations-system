export interface IVacation {
    _id: string;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    imageName: string;
    imageUrl: string;
    likesCount: number;
    likedByMe: boolean;
}

export interface IVacationsResponse {
    vacations: IVacation[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

export type VacationFilter = "all" | "liked" | "active" | "notStarted";

export interface IVacationFormData {
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: string;
    image: File | null;
}
