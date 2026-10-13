import { IVacation } from "../models/vacation-model";

// A fixed vacation used by the component tests:
export const sampleVacation: IVacation = {
    _id: "665f1c2e8b3a4d0012ab34cd",
    destination: "Paris, France",
    description: "Fall in love with the City of Light and its cozy cafes.",
    startDate: "2026-11-10T00:00:00.000Z",
    endDate: "2026-11-20T00:00:00.000Z",
    price: 1450,
    imageName: "paris-france.jpg",
    imageUrl: "http://localhost:4000/api/vacations/images/paris-france.jpg",
    likesCount: 3,
    likedByMe: false
};
