import api from ".";

//Define User type
interface User {
    id: string;
    weight: number;
    height: number;
    BMI: number;
    childId: string;
    createDate: Date;
    updateDate: Date;
    status: boolean;
}