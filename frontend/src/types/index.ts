export interface User{
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    contactInfo: {
        phoneNo: string;
        contactEmail: string;
    };
    location: {
        city: string;
        state: string;
        country: string;
    };
}